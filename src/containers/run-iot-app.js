import React from 'react'
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'
import {getMeshbluConfig} from '../services/auth-service'

class RunIotApp extends React.Component {

  componentWillMount = () => {
    this.appId = this.props.params.uuid
    this.meshblu = new MeshbluHttp(getMeshbluConfig())
    this.meshblu.device(this.appId, (error, device) => {
      this.setState({device})
    })
  }

  state = {}
  render = () => {
    return (
      <main>
        <Page>
          <h1> Omg, you are totally running your IoT App </h1>
        </Page>
      </main>
    )
  }
}

RunIotApp.propTypes = {}

export default RunIotApp
