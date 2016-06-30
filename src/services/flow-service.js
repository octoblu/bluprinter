import _ from 'lodash'
import superagent from 'superagent'
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'
import { TOOLS_SCHEMA_REGISTRY_URL } from 'config'
import { getMeshbluConfig } from './auth-service'
import Promise, { using } from 'bluebird'
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

  getDeviceSchemas = (nodes) => {
    const deviceUuids = _(nodes)
      .filter({category: 'device'})
      .uniqBy('type')
      .map('uuid')
      .value()

    return new Promise((resolve, reject) => {
      const search = {query: {uuid: {$in: deviceUuids}}, projection: {type: true, 'schemas.message': true}}

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
    result[type] = value.schemas.message
    return result
  }

  getFlowDevice = (flowUuid, callback) => {
    this.meshblu.device(flowUuid, callback)
  }

  addGlobalMessageReceivePermissions = (sharedDevices, callback) => {
    async.each(sharedDevices, this._addGlobalMessageReceivePermission,callback)
  }

  _addGlobalMessageReceivePermission = (deviceUuid, callback) => {
    const updateMessageFromQuery = {
      $addToSet: {
        'meshblu.whitelists.message.from': [{uuid: '*'}]
      }
    }
    return this.meshblu.updateDangerously(deviceUuid, updateMessageFromQuery, callback)
  }

  removeGlobalMessageReceivePermissions = (sharedDevices, callback) => {
    async.each(sharedDevices, this._addGlobalMessageReceivePermission,callback)
  }

  _removeGlobalMessageReceivePermission = (deviceUuid, callback) => {
    const updateMessageFromQuery = {
      $pull: {
        'meshblu.whitelists.message.from': [{uuid: '*'}]
      }
    }
    return this.meshblu.updateDangerously(deviceUuid, updateMessageFromQuery, callback)
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
                  enum: _.map(triggers, 'id')
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

  _getMeshbluDevices = (schema) => {
    let result = []
    _.forEach(schema.properties, (value, key) => {
      if (value.format == 'meshblu-device') {
        result.push(key)
      }
    })
    return result
  }

  _updatePermissionsV1 = ({uuid, v1devices}, callback) => {
    async.each(v1devices, (item, cb) => {
      const deviceUpdate = {$addToSet: { receiveWhitelist: uuid, sendWhitelist: uuid }}
      this.meshblu.updateDangerously(item, deviceUpdate, cb)
    }, callback)
  }

  _updatePermissionsV2 = ({uuid, v2devices}, callback) => {
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

  updatePermissions = ({uuid, appData, schema}, callback) => {
    const addToWhitelist = _.map(this._getMeshbluDevices(schema), (value) => {
      return appData[value]
    })

    const update = {$addToSet: { sendWhitelist: { $each: addToWhitelist } }}
    this.meshblu.updateDangerously(uuid, update, (error) => {

      const search = {query: {uuid: {$in: addToWhitelist}, 'meshblu.version': '2.0.0'}, projection: {uuid: true}}
      this.meshblu.search(search, (error, result) => {
        if (error) {
          return callback(error)
        }

        const v2devices = _.map(result, 'uuid')
        const v1devices = _.difference(addToWhitelist, v2devices)

        this._updatePermissionsV1({uuid, v1devices}, (error) => {
          if (error) {
            return callback(error)
          }
          this._updatePermissionsV2({uuid, v2devices}, callback)
        })
      })
    })
  }
}
