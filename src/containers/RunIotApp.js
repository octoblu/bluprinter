import superagent from 'superagent'
import React from 'react'
import MeshbluHttp from 'browser-meshblu-http'
import {getMeshbluConfig} from '../services/auth-service'
import {Page} from 'zooid-ui'
import {DeviceMessageSchemaContainer} from 'zooid-meshblu-device-editor';
import MeshbluJsonSchemaResolver from 'meshblu-json-schema-resolver'
import RunPageHeader from '../components/RunPageHeader/'
import async from 'async'

import {FLOW_DEPLOY_URL} from 'config'

class RunIotApp extends React.Component {
  state = {}

  componentWillMount = () => {
    this.appId = this.props.params.uuid
    this.meshbluConfig = getMeshbluConfig()
    this.meshblu = new MeshbluHttp(this.meshbluConfig)
    this.meshbluJsonSchemaResolver = new MeshbluJsonSchemaResolver({meshbluConfig: this.meshbluConfig})
    this.fetchDevice()
  }

  handleMessage = ({ message }) => {
    const messageWithDevices = _.extend({devices: [this.appId]}, message)
    this.meshblu.message(messageWithDevices, (error) => console.log(error))
  }

  fetchDevice = () => {
    this.meshblu.device(this.appId, (error, device) => {
      this.meshbluJsonSchemaResolver.resolve(device, (error, resolvedDevice) => {
          this.setState({device: resolvedDevice})
      })
    })
  }

  onStart = () => {
    this.toggleOnline(true)
  }

  onStop = () => {
    this.toggleOnline(false)
  }

  toggleOnline = (online) => {
    const {device} = this.state
    if(!device) return

    const flowId = device.uuid

    async.series([
        async.apply(this.meshblu.update, flowId, {online}),
        async.apply(this.fetchDevice),
      ], this.handleError
    )
  }

  handleError = (error) => {
    if(!error) return
    console.log('error', error)
  }

  render = () => {
    const {device} = this.state
    if(!device) return <h1>Loading</h1>
    return (
      <main>
        <Page>
          <RunPageHeader
            device={device}
            onStart={this.onStart}
            onStop={this.onStop}
          />

          <DeviceMessageSchemaContainer
            device={device}
            onSubmit={this.handleMessage}
            selected="bluprint"
          />
        </Page>
      </main>
    )
  }

}

RunIotApp.propTypes = {}

export default RunIotApp
