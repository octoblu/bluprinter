import React from 'react'
import {Button, Page, FormField, FormInput} from 'zooid-ui'
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'

import {getMeshbluConfig} from '../services/auth-service'
import {OCTOBLU_URL, FLOW_DEPLOY_URL} from 'config'
import superagent from 'superagent'
import Form from 'react-jsonschema-form'

import * as deviceConfig from '../../test/data/bluprint-config.json'

class ImportBluprint extends React.Component {
  state = {}

  componentWillMount = () => {
    this.bluprintId = this.props.params.uuid
    this.meshblu = new MeshbluHttp(getMeshbluConfig())
    this.meshblu.device(this.bluprintId, (error, device) => {
      this.setState({bluprint: device.bluprint})
    })
  }

  importBluprint = ({formData}) => {
    const flowData = formData
    this.createFlow(flowData, (error, flow) => {
      console.log('createFlow', {error, flow})
      if(error) return
      const {flowId} = flow
      this.linkFlowToIoTApp({flowId, flowData}, (error, flow) => {
        console.log('linkFlowToIoTApp', {error, flow})
        if(error) return
        this.deployFlow({flowId}, (error, flow) => {
          console.log('deployFlow', {error, flow})
          if(error) return
          window.location = `${OCTOBLU_URL}/device/${flowId}`
        })
      })
    })
  }

  createFlow = (flowData, callback) => {
    const {uuid, token} = getMeshbluConfig()
    superagent
      .post(`${OCTOBLU_URL}/api/flows`)
      .redirects(0)
      .auth(uuid, token)
      .send({})
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
    this.meshblu.update(flowId, this.getDeviceData(flowData), callback)
  }

  getDeviceData = (flowData) => {
    console.log("WARNING: USE UPDATE DANGEROUSLY!! This is only working because of an order-of-operations thing.")
    const {bluprint} = this.state
    const deviceData = {
      name: bluprint.name,
      meshblu: {
        forwarders: {
          configure: {
            sent: [ {
                type: "webhook",
                url: `${FLOW_DEPLOY_URL}/bluprint/${bluprint.flowId}/${bluprint.latest}/link`,
                method: "POST",
                generateAndForwardMeshbluCredentials: true
              },
              {
                  type: "webhook",
                  url: 'http://requestb.in/1bji3ej1',
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
        version: '1.0.0',
        configure: {
          bluprint: this.getLatestSchema(bluprint)
        }
      }
    }
    return _.extend({}, deviceData, flowData)
  }

  getLatestSchema = (bluprint) => {
    return _.find(bluprint.versions, {version: bluprint.latest}).schemas.configure.bluprint
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
