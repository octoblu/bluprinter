import _ from 'lodash'
import React, { PropTypes } from 'react'
import { Page } from 'zooid-ui'
import url from 'url'
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'
import superagent from 'superagent'
import { OCTOBLU_URL, FLOW_DEPLOY_URL } from 'config'

import CreateAppForm from '../components/CreateAppForm'

import NodeService          from '../services/node-service'
import { getMeshbluConfig } from '../services/auth-service'
import FlowService          from '../services/flow-service'


const propTypes = {
  routeParams: PropTypes.object,
}

class CreateBluprint extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      loading: true,
      error: null,
      flowDevice: null,
      nodeSchemaMap: null,
      version: '1.0.0',
      manifest: null
    }

    this.flowService = new FlowService()

    this.handleCreate = this.handleCreate.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)

    this.nodeService = new NodeService()
  }

  componentWillMount() {
    const { flowUuid } = this.props.routeParams

    this.flowService.getFlowDevice(flowUuid, (error, flowDevice) => {
      if (error) {
        this.setErrorState(error)
        return
      }

      this.setState({ flowDevice })

      this.nodeService.createManifest(flowDevice.draft.nodes).then((manifest) => {
        this.setState({ manifest })
      })

      this.flowService
        .getNodeSchemaMap(flowDevice.draft)
        .then((nodeSchemaMap) => {
          this.setState({ nodeSchemaMap, loading: false })
        })
    })
  }

  setErrorState(error) {
    this.setState({
      error,
      loading: false,
      flowDevice: null,
      nodeSchemaMap: null,
    })
  }

  handleUpdate(mappings) {
    this.configSchema = this.mappingToConfig({ mappings })
    console.log('mappings', mappings)
  }

  mappingToConfig({ mappings }) {
    const config = {
      type: 'object',
      properties: {},
    }

    _.each(mappings, function (mapping) {
      let property = config.properties[mapping.configureProperty]
      property = property || { type: mapping.type, enum: mapping.enum }
      property.required = mapping.required
      property.description = mapping.description
      property['x-node-map'] = property['x-node-map'] || []
      property['x-node-map'].push({ id: mapping.nodeId, property: mapping.nodeProperty })
      config.properties[mapping.configureProperty] = property
    })

    return config
  }

  handleCreate(event) {
    event.preventDefault()
    this.setState({ loading: true })

    const { appName } = event.target
    const { flowUuid } = this.props.routeParams
    const meshbluConfig = getMeshbluConfig()
    const meshblu = new MeshbluHttp(meshbluConfig)
    const { flowDevice, version } = this.state

    const bluprintConfig = this.deviceDefaults({
      name: appName.value,
      version: version,
      flowId: flowUuid,
      configSchema: this.configSchema,
      manifest: this.state.manifest
    })

    superagent
      .post(`${FLOW_DEPLOY_URL}/bluprint/${flowUuid}/${version}`)
      .auth(meshbluConfig.uuid, meshbluConfig.token)
      .end((error, response) => {
        meshblu.register(bluprintConfig, (error, device) => {
          if (error) {
            this.setErrorState(error)
            return
          }

          const { uuid } = device
          const update = this.linksProperties({ uuid })

          meshblu.update(uuid, update, (updateError) => {
            if (updateError) {
              this.setErrorState(updateError)
              return
            }

            window.location = `${OCTOBLU_URL}/device/${device.uuid}`
          })
        })
    })
  }

  deviceDefaults({ flowId, name, configSchema, version, manifest }) {
    const USER_UUID = getMeshbluConfig().uuid
    return {
      name,
      owner: USER_UUID,
      online: true,
      type: 'octoblu:bluprint',
      bluprint: {
        flowId,
        latest: version,
        manifest,
        versions: [
          {
            version,
            schemas: {
              configure: {
                bluprint: configSchema || {},
              },
            },
          },
        ],
      },
      meshblu: {
        version: '2.0.0',
        whitelists: {
          configure: {
            update: [{ uuid: USER_UUID }],
          },
          discover: {
            view: [{ uuid: USER_UUID }],
          },
        },
      },
    }
  }

  linksProperties({ uuid }) {
    const { protocol, hostname, port } = window.location

    return {
      octoblu: {
        links: [{
          title: 'Import Bluprint',
          url: url.format({ protocol, hostname, port, pathname: `/bluprints/${uuid}/import` }),
        }],
      },
    }
  }

  render() {
    const { error, loading, flowDevice, nodeSchemaMap } = this.state
    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    if (!flowDevice || !nodeSchemaMap) return null

    return (
      <main>
        <Page width="small">
          <CreateAppForm
            flow={flowDevice.draft}
            nodeSchemaMap={nodeSchemaMap}
            onCreate={this.handleCreate}
            onUpdate={this.handleUpdate}
          />
        </Page>
      </main>
    )
  }
}

CreateBluprint.propTypes = propTypes

export default CreateBluprint
