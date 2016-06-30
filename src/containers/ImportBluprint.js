import url from 'url'

import React from 'react'
import { Page, FormField, FormInput } from 'zooid-ui'
import Spinner from 'zooid-spinner'
import Input from 'zooid-input'
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'

import FlowService from '../services/flow-service'
import {getMeshbluConfig} from '../services/auth-service'

import {OCTOBLU_URL, FLOW_DEPLOY_URL} from 'config'
import superagent from 'superagent'
import {SchemaContainer} from 'zooid-meshblu-device-editor'

import BluprintManifestList from '../components/BluprintManifestList/'
import * as deviceConfig from '../../test/data/bluprint-config.json'

class ImportBluprint extends React.Component {
  state = {}

  componentWillMount = () => {

    const meshbluConfig = getMeshbluConfig()
    this.bluprintId     = this.props.params.uuid
    this.meshblu        = new MeshbluHttp(meshbluConfig)
    this.flowService    = new FlowService(meshbluConfig)

    this.meshblu.device(this.bluprintId, (error, device) => {
      this.setState({bluprint: device.bluprint, name: device.name})
    })

    const ownedDevices = {
      query: {owner: meshbluConfig.uuid},
      projection: {name: true, type: true, uuid: true}
    }

    this.meshblu.search(ownedDevices, (error, selectableDevices) =>{
      this.setState({selectableDevices})
    })
  }

  getMessageFromDevices = (bluprint) => {
    return _(bluprint.manifest)
      .map('deviceId')
      .compact()
      .uniq()
      .value()
  }

  importBluprint = (flowData) => {
    console.log('importBluprint')
    this.setState({loading: true})
    this.createFlow((error, flow) => {
      if(error) return

      const {bluprint}         = this.state
      const {flowId}           = flow
      const schema             = this.getLatestConfigSchema(bluprint)
      const messageFromDevices = this.getMessageFromDevices(bluprint)

      const options = {uuid: flowId, appData: flowData, schema: schema, messageFromDevices: messageFromDevices}
      this.flowService.updatePermissions(options, (error) => {
        if(error) return console.log('updatePermissions', error)

        this.linkFlowToIoTApp({flowId, flowData}, (error) => {
          if(error) return console.log('linkFlowToIoTApp', error)

          this.deployFlow({flowId}, (error) => {
            if(error) return console.log('deployFlow', error)
            window.location = `${OCTOBLU_URL}/device/${flowId}`
          })
        })
      })
    })
  }

  createFlow = (callback) => {
    const {uuid, token} = getMeshbluConfig()
    superagent
      .post(`${OCTOBLU_URL}/api/flows`)
      .redirects(0)
      .auth(uuid, token)
      .send({"name": this.state.appName})
      .end((error, response) => {
        if(error) return callback(error)
        return callback(null, response.body)
      })
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
    const {bluprint, appName} = this.state
    const {protocol, hostname, port} = window.location

    const deviceData = {
      name: appName,
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
                url: `${FLOW_DEPLOY_URL}/bluprint/${bluprint.flowId}/${bluprint.latest}/link`,
                method: "POST",
                generateAndForwardMeshbluCredentials: true
              }
            ]
          }
        }
      },
      bluprint: {
        flowId: bluprint.flowId,
        version: bluprint.latest
      },

      schemas: {
        version: '2.0.0',
        configure: {
          bluprint: this.getLatestConfigSchema(bluprint)
        },
        message: {
          bluprint: this.getLatestMessageSchema(bluprint)
        }
      },
    }

    return _.extend({}, flowData, deviceData)
  }

  getLatestConfigSchema = (bluprint) => {
    return _.find(bluprint.versions, {version: bluprint.latest}).schemas.configure.bluprint
  }

  getLatestMessageSchema = (bluprint) => {
    return _.find(bluprint.versions, {version: bluprint.latest}).schemas.message.bluprint
  }

  updateDeviceName = (event) => {
    this.setState({appName: event.target.value})
  }

  render = () => {
    const {bluprint, name, selectableDevices} = this.state

    if(!bluprint || loading) return <Page width="small"><Spinner>Hang On...</Spinner></Page>
    const latestSchema = this.getLatestConfigSchema(bluprint)
    return (
      <Page>
        <h3>Things Manifest</h3>
        <BluprintManifestList manifest={bluprint.manifest} />

        <h2>Configure App {name}</h2>

        <form onChange={this.updateDeviceName}>
          <Input
            name="appName"
            label="IoT App Name"
            placeholder="App Name"
            autofocus
            required
          />
        </form>

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
