import React from 'react'
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'
import {getMeshbluConfig} from '../services/auth-service'
import {Page} from 'zooid-ui'
import {DeviceMessageSchemaContainer} from 'zooid-meshblu-device-editor';
class RunIotApp extends React.Component {

  componentWillMount = () => {
    const appId = this.props.params.uuid
    this.meshblu = new MeshbluHttp(getMeshbluConfig())
    this.meshblu.device(appId, (error, device) => {
      this.setState({device})
    })
  }

  state = {}
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
