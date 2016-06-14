import React from 'react'
import {Button, Page, FormField, FormInput} from 'zooid-ui'
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'

import {getMeshbluConfig} from '../services/auth-service'
import {OCTOBLU_URL} from 'config'
import superagent from 'superagent'
import Form from 'react-jsonschema-form'

import * as deviceConfig from '../../test/data/bluprint-config.json'

class ImportBluprint extends React.Component {
  state = {}

  componentWillMount = () => {
    this.bluprintId = this.props.params.uuid
    this.meshblu = new MeshbluHttp(getMeshbluConfig())
    // this.setState({bluprint: deviceConfig.bluprint})
    this.meshblu.device(this.bluprintId, (error, device) => {
      this.setState({bluprint: device.bluprint})
    })
  }

  importBluprint = ({formData}) => {
    this.createFlow(formData, (error, flow) => {
      if(error) return
      const {flowId} = flow
      this.deployFlow({flowId}, (error, flow) => {
        if(error) return
      })
    })
  }

  createFlow = (flowData, callback) => {
    const {uuid, token} = getMeshbluConfig()
    superagent
      .post(`${OCTOBLU_URL}/api/flows`)
      .redirects(0)
      .auth(uuid, token)
      .send(this.getDeviceData(flowData))
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

  getDeviceData = (formData) => {
    const {bluprint} = this.state
    const deviceData = {
      name: bluprint.name,
      bluprint: {
        flowId: bluprint.flowId,
        version: bluprint.latest
      },
      schemas: {
        version: '1.0.0',
        configure: {
          bluprint: this.getLatestSchema(bluprint)
        }
      }
    }

    return deviceData
  }

  getLatestSchema = (bluprint) => {
    return _.get(bluprint, `versions.${bluprint.latest}.schemas.configure.bluprint`)
  }

  render = () => {
    const {bluprint} = this.state
    if(!bluprint) return <div>Hang On...</div>
    const latestSchema = this.getLatestSchema(bluprint)
    return (
      <main>
        <Page>
          <Form schema={latestSchema} onSubmit={this.importBluprint}></Form>
        </Page>
      </main>
    )
  }
}

ImportBluprint.propTypes = {}

export default ImportBluprint
