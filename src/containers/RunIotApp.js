import React from 'react'
import MeshbluHttp from 'browser-meshblu-http'
import {getMeshbluConfig} from '../services/auth-service'
import {Page} from 'zooid-ui'
import {DeviceMessageSchemaContainer} from 'zooid-meshblu-device-editor';
import MeshbluJsonSchemaResolver from 'meshblu-json-schema-resolver'

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

  render = () => {
    const {device} = this.state
    if(!device) return <h1>Haaaaaaaaaaang onnnnnnnn</h1>
    return (
      <main>
        <Page>
          <h1> Omg, you are totally running your IoT App </h1>

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
