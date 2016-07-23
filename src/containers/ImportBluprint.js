import React from 'react'
import MeshbluHttp from 'browser-meshblu-http'
import superagent from 'superagent'
import url from 'url'
import Button from 'zooid-button'
import Heading from 'zooid-heading'
import Spinner from 'zooid-spinner'
import Input from 'zooid-input'
import {SchemaContainer} from 'zooid-meshblu-device-editor'
import { Page, FormField, FormInput } from 'zooid-ui'

import {OCTOBLU_URL, FLOW_DEPLOY_URL} from 'config'

import FlowService from '../services/flow-service'
import {getMeshbluConfig} from '../services/auth-service'


import BluprintManifestList from '../components/BluprintManifestList/'
import * as deviceConfig from '../../test/data/bluprint-config.json'

import async from 'async'


class ImportBluprint extends React.Component {

  constructor(props) {
    super(props)

    this.bluprintId    = this.props.params.uuid
    this.meshbluConfig = getMeshbluConfig()
    this.meshblu       = new MeshbluHttp(this.meshbluConfig)
    this.flowService   = new FlowService(this.meshbluConfig)

    this.state = {
      loading: false,
      showManifest: false,
    }
  }

  componentDidMount() {
    this.meshblu.device(this.bluprintId, (error, device) => {
      console.log("Bluprint Device", device)

      const latestSchema = this.getLatestConfigSchema(device.bluprint)
      const {manifest}   = this.getLatestVersion(device.bluprint)

      this.setState({bluprint: device.bluprint, name: device.name, appId: this.bluprintId, manifest, latestSchema})
    })

    const ownedDevices = {
      query: {owner: this.meshbluConfig.uuid},
      projection: {name: true, type: true, uuid: true}
    }

    this.meshblu.search(ownedDevices, (error, selectableDevices) =>{
      this.setState({selectableDevices})
    })
  }

  getMessageFromDevices = (bluprint) => {
    const {manifest, sharedDevices} = this.getLatestVersion(bluprint)
    return _(manifest)
      .map('deviceId')
      .compact()
      .union(sharedDevices)
      .uniq()
      .value()
  }

  importBluprint = (flowData) => {
    this.setState({loading: true})
    this.createFlow((error, flow) => {
      if(error) return

      const {bluprint}         = this.state
      const {flowId}           = flow
      const schema             = this.getLatestConfigSchema(bluprint)
      const messageFromDevices = this.getMessageFromDevices(bluprint)

      const options = {uuid: flowId, appData: flowData, schema: schema, messageFromDevices: messageFromDevices}
      async.series([
        async.apply(this.flowService.updatePermissions, options),
        async.apply(this.linkFlowToIoTApp, {flowId, flowData}),
        async.apply(this.deployFlow, {flowId}),
        async.apply(this.updateLinks, {flowId})
      ], (error) => {
        if(error) return console.log('updateLinks', error)
        window.location = `${OCTOBLU_URL}/device/${flowId}`
      })
    })
  }

  createFlow = (callback) => {
    const {uuid, token} = getMeshbluConfig()
    superagent
      .post(`${OCTOBLU_URL}/api/flows`)
      .redirects(0)
      .auth(uuid, token)
      .send({name: this.appName, type: 'iot-app'})
      .end((error, response) => {
        if(error) return callback(error)
        return callback(null, response.body)
      })
  }

  updateLinks = ({flowId}, callback) => {
    const { protocol, hostname, port } = window.location

    const update = {
      $set: {
        octoblu: {
          links: [{
            title: 'Run App',
            url: url.format({ protocol, hostname, port, pathname: `/app/${flowId}` })
          }]
        }
      }
    }
    this.meshblu.updateDangerously(flowId, update, callback)
  }

  deployFlow = ({flowId}, callback) => {
    const {uuid, token} = getMeshbluConfig()
    superagent
      .post(`${OCTOBLU_URL}/api/flows/${flowId}/instance`)
      .auth(uuid, token)
      .send({})
      .end((error, response) =>{
        if(error) return callback(error)
        return callback(error, response.body)
      })
  }

  linkFlowToIoTApp = ({flowId, flowData}, callback) => {
    this.meshblu.update(flowId, this.getDeviceData({flowId, flowData}), callback)
  }

  getDeviceData = ({flowId, flowData}) => {
    console.log("WARNING: USE UPDATE DANGEROUSLY!! This is only working because of an order-of-operations thing.")
    const {bluprint} = this.state
    const {protocol, hostname, port} = window.location

    const deviceData = {
      name: this.appName,
      type: 'iot-app',
      logo: 'https://s3-us-west-2.amazonaws.com/octoblu-icons/device/iot-app.svg',
      octoblu: {
        links: [{
          title: 'Run App',
          url: url.format({ protocol, hostname, port, pathname: `/app/${flowId}` }),
        }]
      },
      meshblu: {
        forwarders: {
          configure: {
            sent: [ {
                type: "webhook",
                url: `${FLOW_DEPLOY_URL}/bluprint/${this.bluprintId}/${bluprint.latest}/link`,
                method: "POST",
                generateAndForwardMeshbluCredentials: true
              }
            ]
          }
        }
      },
      bluprint: {
        bluprintId: this.bluprintId,
        version: bluprint.latest
      },

      schemas: {
        version: '2.0.0',
        configure: {
          default: {
            $ref: `meshbludevice://${this.bluprintId}/#/bluprint/schemas/configure/default`
          }
        },
        message: {
          default: {
            $ref: `meshbludevice://${this.bluprintId}/#/bluprint/schemas/message/default`
          }
        }
      },
    }

    return _.extend({}, flowData, deviceData)
  }

  getLatestVersion = (bluprint) => {
    return  _.find(bluprint.versions, {version: bluprint.latest})
  }

  getLatestConfigSchema = (bluprint) => {
    return this.getLatestVersion(bluprint).schemas.configure.default
  }

  getLatestMessageSchema = (bluprint) => {
    return this.getLatestVersion(bluprint).schemas.message.default
  }

  updateDeviceName = ({target}) => {
    this.appName = target.value
  }


  render = () => {
    const {
      bluprint,
      latestSchema,
      loading,
      manifest,
      name,
      selectableDevices,
      showManifest,
    } = this.state

    if(!bluprint || loading) return <Page width="small"><Spinner>Hang On...</Spinner></Page>

    return (
      <Page width="small">
        <Heading level={4}>Import {name}</Heading>

        <BluprintManifestList
          manifest={manifest}
          expanded={showManifest}
          onChange={() => this.setState({ showManifest: !this.state.showManifest })}
        />

        <Heading level={5}>Configure</Heading>

        <Input
          name="appName"
          label="IoT App Name"
          placeholder="App Name"
          value={this.appName}
          onChange={this.updateDeviceName}
          required
        />

        <SchemaContainer
          schema={latestSchema}
          selectableDevices={selectableDevices}
          onSubmit={this.importBluprint}
        />
      </Page>
    )
  }
}

ImportBluprint.propTypes = {}

export default ImportBluprint
