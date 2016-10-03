import _ from 'lodash'
import superagent from 'superagent'
import MeshbluHttp from 'browser-meshblu-http'
import { TOOLS_SCHEMA_REGISTRY_URL } from 'config'
import { getMeshbluConfig } from './auth-service'
import Promise from 'bluebird'
import $RefParser from 'json-schema-ref-parser'
import async from 'async'

export default class FlowService {
  constructor(meshbluConfig = getMeshbluConfig()) {
    this.meshblu = new MeshbluHttp(meshbluConfig)

    this.getOperationSchemas = this.getOperationSchemas.bind(this)
    this.getFlowDevice = this.getFlowDevice.bind(this)
  }

  getOperationSchemas = () => {
    if (this.toolsSchema) return this.toolsSchema

    return new Promise((resolve, reject) => {
      superagent
      .get(`${TOOLS_SCHEMA_REGISTRY_URL}`)
      .end((error, response) => {
        if (error) reject(error)
        this.toolsSchema = response.body
        resolve(this.toolsSchema)
      })
    })
  }

  setDeviceSchemas = (nodes) => {
    const deviceUuids = _(nodes)
      .filter(({category}) => {
        return (category === 'device' || category === "endo")
      })
      .uniqBy('type')
      .map('uuid')
      .value()

    return new Promise((resolve, reject) => {
      const search = {query: {uuid: {$in: deviceUuids}}, projection: {type: true, 'schemas.message': true, messageSchema: true}}

      this.meshblu.search(search, (error, devices) => {
        if(error) return reject(error)

        $RefParser.dereference(devices, (error, resolvedSchemas) => {
          const schemaRegistry = _.reduce(resolvedSchemas, this._reduceSchemas, {})
          resolve(schemaRegistry)
        })

      })
    })
  }

  _reduceSchemas = (result, value) => {
    const type = _.last(value.type.split(':'))
    if(value.schemas) {
      result[type] = value.schemas.message
    } else {
      result[type] = value.messageSchema
    }

    return result
  }

  getFlowDevice = (flowUuid, callback) => {
    this.meshblu.device(flowUuid, callback)
  }

  addGlobalMessageReceivePermissions = (sharedDevices, callback) => {
    this._allowSendAndSubscribeToBroadcast({uuid: '*', devices: sharedDevices}, callback)
  }

  getMessageSchema = ({nodes}) => {
    const triggers = _.filter(nodes, { class: 'trigger' })

    const messageSchema = {
      type: 'object',
      properties: {
        metadata: {
          type: 'object',
          properties: {
            to: {
              type: 'object',
              properties: {
                nodeId: {
                  type: 'string',
                  title: 'Trigger',
                  required: true,
                  enum: _.map(triggers, 'id'),
                  enumNames: _.map(triggers, (trigger) => trigger.name || trigger.id)
                }
              }
            }
          }
        },
        data: {
          title: 'data',
          type: 'string',
          description: 'Use {{msg}} to send the entire message'
        }
      }
    }

    return messageSchema
  }

  _getDevicesAndEventTypes = ({schema, sharedDevices, manifest, appData}) => {
    appData = appData.options
    schema = schema.properties.options
    let resultSet = {}
    _.each(manifest, (node) => {
      if(!node.category === 'device') { return }
      const key = _.find( _.keys(schema.properties), (property) => {
        return _.some(schema.properties[property]['x-node-map'], {id: node.id, property: 'uuid'})
      })
      if (key !== undefined) {
        const appUuid = appData[key]
        if (resultSet[key] === undefined) {
          resultSet[key] = {uuid: appUuid, eventTypes: []}
        }
        if (_.includes(resultSet[key].eventTypes, node.eventType)) return

        resultSet[key].eventTypes.push(node.eventType)
      }
    })
    return _.union( _.values(resultSet), sharedDevices)
  }

  updatePermissions = ({uuid, schema, appData, devicesInFlow, sharedDevices, manifest}, callback) => {
    const deviceEventTypes  = this._getDevicesAndEventTypes({schema, manifest, sharedDevices, appData})
    const messageDevices    = _.map(_.filter(deviceEventTypes, (deviceEventType) => _.includes(deviceEventType.eventTypes, 'message')), 'uuid')
    const configureDevices  = _.map(_.filter(deviceEventTypes, (deviceEventType) => _.includes(deviceEventType.eventTypes, 'configure')), 'uuid')
    const update = {$addToSet: { sendWhitelist: { $each: _.union(devicesInFlow, messageDevices) } }}

    async.series([
      async.apply(this.meshblu.updateDangerously, uuid, update),
      async.apply(this._allowSendAndSubscribeToBroadcast, {uuid, devices:messageDevices}),
      async.apply(this._allowConfigureAndSubscribeToConfigure, {uuid, devices:configureDevices}),
    ], callback)
  }

  _allowSendAndSubscribeToBroadcast = ({uuid, devices}, callback) => {
      const search = {
        query: {uuid: {$in: devices}, 'meshblu.version': '2.0.0'},
        projection: {uuid: true}
      }

    this.meshblu.search(search, (error, result) => {
      if (error) return callback(error)

      const v2devices = _.map(result, 'uuid')
      const v1devices = _.difference(devices, v2devices)

      this._updateMessagePermissionsV1({uuid, v1devices}, (error) => {
        if (error) return callback(error)

        this._updateMessagePermissionsV2({uuid, v2devices}, callback)
      })
    })
  }

  _allowConfigureAndSubscribeToConfigure = ({uuid, devices}, callback) => {
      const search = {
        query: {uuid: {$in: devices}, 'meshblu.version': '2.0.0'},
        projection: {uuid: true}
      }

    this.meshblu.search(search, (error, result) => {
      if (error) return callback(error)

      const v2devices = _.map(result, 'uuid')
      const v1devices = _.difference(devices, v2devices)

      this._updateConfigurePermissionsV1({uuid, v1devices}, (error) => {
        if (error) return callback(error)

        this._updateConfigurePermissionsV2({uuid, v2devices}, callback)
      })
    })
  }

  _updateMessagePermissionsV1 = ({uuid, v1devices}, callback) => {
    async.each(v1devices, (item, cb) => {
      const deviceUpdate = {$addToSet: { receiveWhitelist: uuid, sendWhitelist: uuid }}
      this.meshblu.updateDangerously(item, deviceUpdate, cb)
    }, callback)
  }

  _updateMessagePermissionsV2 = ({uuid, v2devices}, callback) => {
    async.each(v2devices, (item, cb) => {
      const deviceUpdate = {
        $addToSet: {
          'meshblu.whitelists.message.from': {uuid},
          'meshblu.whitelists.broadcast.sent': {uuid}
        }
      }
      this.meshblu.updateDangerously(item, deviceUpdate, cb)
    }, callback)
  }

  _updateConfigurePermissionsV1 = ({uuid, v1devices}, callback) => {
    async.each(v1devices, (item, cb) => {
      const deviceUpdate = {$addToSet: { configureWhitelist: uuid }}
      this.meshblu.updateDangerously(item, deviceUpdate, cb)
    }, callback)
  }

  _updateConfigurePermissionsV2 = ({uuid, v2devices}, callback) => {
    async.each(v2devices, (item, cb) => {
      const deviceUpdate = {
        $addToSet: {
          'meshblu.whitelists.configure.update': {uuid},
          'meshblu.whitelists.configure.sent': {uuid}
        }
      }
      this.meshblu.updateDangerously(item, deviceUpdate, cb)
    }, callback)
  }

  createSubscriptions = ({uuid, schema, manifest, appData}, callback) => {
    const deviceEventTypes = this._getDevicesAndEventTypes({schema, manifest, appData})

    const subscriptions = _.flatten( _.map(deviceEventTypes, (deviceEventType) => {
      const deviceUuid = deviceEventType.uuid
      const eventTypes = deviceEventType.eventTypes
      const subscriptionsForDevice = []
      if(_.includes(eventTypes, 'message')) {
        subscriptionsForDevice.push({subscriberUuid: uuid, emitterUuid: deviceUuid, type: 'broadcast.sent'})
      }
      if(_.includes(eventTypes, 'configure')) {
        subscriptionsForDevice.push({subscriberUuid: uuid, emitterUuid: deviceUuid, type: 'configure.sent'})
      }
      return subscriptionsForDevice
    }))

    async.eachSeries(subscriptions, (subscription, cb) => {
      this.meshblu.createSubscription(subscription, cb)
    }, callback)
  }
}
