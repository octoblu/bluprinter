import _ from 'lodash'
import superagent from 'superagent'
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'
import { TOOLS_SCHEMA_REGISTRY_URL } from 'config'
import { getMeshbluConfig } from './auth-service'
import Promise, { using } from 'bluebird'


export default class FlowService {
  constructor(meshbluConfig = getMeshbluConfig()) {
    this.meshblu = new MeshbluHttp(meshbluConfig)

    this.getToolsSchema = this.getToolsSchema.bind(this)
    this.getFlowDevice = this.getFlowDevice.bind(this)
    this.getNodeSchemaMap = this.getNodeSchemaMap.bind(this)
  }

  getToolsSchema() {
    if (this.toolsSchema) return this.toolsSchema

    return new Promise((resolve, reject) => {
      superagent
      .get(`${TOOLS_SCHEMA_REGISTRY_URL}`)
      .end((error, response) => {
        if (error) reject(error)
        this.toolsSchema = response.body
        resolve(this.toolsSchema)
      })
    })
  }

  getFlowDevice(flowUuid, callback) {
    this.meshblu.device(flowUuid, callback)
  }

  getNodeSchemaMap(flow) {
    return this.getToolsSchema().then((toolsSchema) => {
      return Promise.map(flow.nodes, (node) => {
        return this.getSchemaForNode(node, toolsSchema)
      })
    })
  }

  getSchemaForNode(node, toolsSchema) {
    const { category, uuid } = node
    const baseMap = { uuid, category }

    return new Promise((resolve, reject) => {
      if (node.category === 'device') {
        this.meshblu.device(node.uuid, (deviceError, device) => {
          let deviceSchema = {}
          if (device.schemas) { deviceSchema = device.schemas.message }

          if (deviceError) return reject(deviceError)
          return resolve({
            ...baseMap,
            schemas:  {
              message: deviceSchema
            }
          })
        })
      } else {
        return resolve({ ...baseMap, schema: toolsSchema[node.class] })
      }
    })
  }

  getMessageSchema({nodes}) {
    const triggers = _.filter(nodes, { 'class': 'trigger' })

    const messageSchema = {
      type: 'object',
      properties: {
        metadata: {
          type: 'object',
          properties: {
            to: {
              type: 'object',
              properties: {
                nodeId: {
                  type: 'string',
                  title: 'Trigger',
                  required: true,
                  enum: _.map(triggers, 'id')
                }
              }
            }
          }
        },
        data: {
          title: 'data',
          type: 'string',
          description: 'Use {{msg}} to send the entire message'
        }
      }
    }

    return messageSchema
  }
}
