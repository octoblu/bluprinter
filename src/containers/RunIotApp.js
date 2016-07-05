import React from 'react'
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'
import {getMeshbluConfig} from '../services/auth-service'
import {Page} from 'zooid-ui'
import {DeviceMessageSchemaContainer} from 'zooid-meshblu-device-editor';
import DeployButton from '../components/DeployButton'

class RunIotApp extends React.Component {
  state = {}

  componentWillMount = () => {
    this.appId = this.props.params.uuid
    this.meshbluConfig = getMeshbluConfig()
    this.meshblu = new MeshbluHttp(this.meshbluConfig)
    this.fetchDevice()
  }

  handleMessage = ({ message }) => {
    const messageWithDevices = _.extend({devices: [this.appId]}, message)
    this.meshblu.message(messageWithDevices, (error) => console.log(error))
  }

  fetchDevice = () => {
    this.meshblu.device(this.appId, (error, device) => {
      this.setState({device})
    })
  }

  render = () => {
    const {device} = this.state
    if(!device) return <h1>Haaaaaaaaaaang onnnnnnnn</h1>
    return (
      <main>
        <Page>
          <h1> Omg, you are totally running your IoT App </h1>

          <DeployButton
            flowId={device.draft.flowId}
            status={device.online}
            meshbluConfig={this.meshbluConfig}
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
