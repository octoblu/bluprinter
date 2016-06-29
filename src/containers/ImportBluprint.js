import url from 'url'

import React from 'react'
import { Page, FormField, FormInput } from 'zooid-ui'
import Spinner from 'zooid-spinner'
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'

import {getMeshbluConfig} from '../services/auth-service'
import {OCTOBLU_URL, FLOW_DEPLOY_URL} from 'config'
import superagent from 'superagent'
import {SchemaContainer} from 'zooid-meshblu-device-editor'
import * as deviceConfig from '../../test/data/bluprint-config.json'

class ImportBluprint extends React.Component {
  state = {}

  componentWillMount = () => {
    this.bluprintId = this.props.params.uuid
    const meshbluConfig = getMeshbluConfig()
    this.meshblu = new MeshbluHttp(meshbluConfig)

    this.meshblu.device(this.bluprintId, (error, device) => {
      this.setState({bluprint: device.bluprint})
    })

    this.meshblu.search({query: {owner: meshbluConfig.uuid} , projection: {name: true, type: true, uuid: true}}, (error, selectableDevices) =>{
      this.setState({selectableDevices})
    })

  }

  importBluprint = (flowData) => {
    this.createFlow((error, flow) => {
      console.log('createFlow', {error, flow})
      if(error) return

      const {flowId} = flow
      this.linkFlowToIoTApp({flowId, flowData}, (error, flow) => {
        if(error) return


        this.deployFlow({flowId}, (error, flow) => {
          if(error) return
          window.location = `${OCTOBLU_URL}/device/${flowId}`
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
    this.meshblu.update(flowId, this.getDeviceData({flowId, flowData}), callback)
  }

  getDeviceData = ({flowId, flowData}) => {
    console.log("WARNING: USE UPDATE DANGEROUSLY!! This is only working because of an order-of-operations thing.")
    const {bluprint} = this.state
    const {protocol, hostname, port} = window.location

    const deviceData = {
      name: bluprint.name,
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

  render = () => {
    const {bluprint, selectableDevices} = this.state
    if(!bluprint) return <Page width="small"><Spinner>Hang On...</Spinner></Page>
    const latestSchema = this.getLatestConfigSchema(bluprint)
    return (
      <main>
        <Page>
          <SchemaContainer schema={latestSchema} selectableDevices={selectableDevices} onSubmit={this.importBluprint}></SchemaContainer>
        </Page>
      </main>
    )
  }
}

ImportBluprint.propTypes = {}

export default ImportBluprint
