import _ from 'lodash'
import React from 'react'
import MeshbluHttp from 'browser-meshblu-http'
import superagent from 'superagent'
import url from 'url'
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

      const latestSchema = device.bluprint.schemas.configure.default
      const {manifest}   = device.bluprint

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

  importBluprint = (flowData) => {
    this.setState({loading: true})
    this.createFlow((error, flow) => {
      if(error) return

      const {bluprint}         = this.state
      const {flowId}           = flow
      const schema             = _.get(bluprint, 'schemas.configure.default')
      const manifest           = bluprint.manifest
      const sharedDevices      = bluprint.sharedDevices

      const options = {uuid: flowId, appData: flowData, manifest, sharedDevices, schema}
      async.series([
        async.apply(this.flowService.updatePermissions, options),
        async.apply(this.flowService.createSubscriptions, options),
        async.apply(this.deployFlow, {flowId}),
        async.apply(this.linkFlowToIoTApp, {flowId, flowData})
      ], (error) => {
        if(error) return console.log('An error occurred during some import step', error)
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
    this.meshblu.updateDangerously(flowId, this.getDeviceUpdate({flowId, flowData}), callback)
  }

  getDeviceUpdate = ({flowId, flowData}) => {
    const {bluprint} = this.state
    const {protocol, hostname, port} = window.location

    const updateData =  {
      $set: {
        name: this.appName,
        type: 'iot-app',
        logo: 'https://s3-us-west-2.amazonaws.com/octoblu-icons/device/iot-app.svg',
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
        }
      },
      $addToSet: {
        discoverWhitelist: this.bluprintId,
        'octoblu.links': {
          title: 'Run App',
          url: url.format({ protocol, hostname, port, pathname: `/app/${flowId}` }),
        },
        'meshblu.forwarders.configure.sent': {
          type: "webhook",
          url: `${FLOW_DEPLOY_URL}/bluprint/${this.bluprintId}/link`,
          method: "POST",
          generateAndForwardMeshbluCredentials: true
        },
      },
    }

    _.extend(updateData.$set, flowData)
    return updateData
  }

  getLatestMessageSchema = (bluprint) => {
    return bluprint.schemas.message.default
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
