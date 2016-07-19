import superagent from 'superagent'
import React from 'react'
import MeshbluHttp from 'browser-meshblu-http'
import {getMeshbluConfig} from '../services/auth-service'
import {Page} from 'zooid-ui'
import {DeviceMessageSchemaContainer} from 'zooid-meshblu-device-editor';
import MeshbluJsonSchemaResolver from 'meshblu-json-schema-resolver'
import RunPageHeader from '../components/RunPageHeader/'


import {OCTOBLU_URL} from 'config'

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
    const {device} = this.state
    if(!device) return
    this.startFlow(device.uuid, (error, response) => console.log('onStart', error, response))
  }

  onStop = () => {
    const {device} = this.state
    if(!device) return
    this.stopFlow(device.uuid, (error, response) => console.log('onStop', error, response))
  }

  startFlow = (flowId, callback) => {
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

  stopFlow = (flowId, callback) => {
    const {uuid, token} = getMeshbluConfig()
    superagent
      .del(`${OCTOBLU_URL}/api/flows/${flowId}/instance`)
      .auth(uuid, token)
      .end((error, response) =>{
        if(error) return callback(error)
        return callback(error, response.body)
      })
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
