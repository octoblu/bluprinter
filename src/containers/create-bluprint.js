import _ from 'lodash'
import superagent from 'superagent'
import React, { PropTypes } from 'react'
import { Page } from 'zooid-ui'
import url from 'url'
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'
import { OCTOBLU_URL, TOOLS_SCHEMA_REGISTRY_URL } from 'config'

import CreateAppForm from '../components/CreateAppForm'


import { getMeshbluConfig } from '../services/auth-service'
import FlowService from '../services/flow-service'


const propTypes = {
  routeParams: PropTypes.object,
}

class CreateBluprint extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      loading: false,
      errror: null,
      flowDevice: null,
      toolsSchema: null,
    }

    this.flowService = new FlowService()

    this.handleCreate = this.handleCreate.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentWillMount() {
    const { flowUuid } = this.props.routeParams

    this.flowService.getFlowDevice(flowUuid, (error, flowDevice) => {
      if (error) {
        this.setErrorState(error)
        return
      }

      this.flowService
      .getNodeSchemaMap(flowDevice.flow)
      .then((nodeSchemaMap) => {
        console.log('Node Schema Map', nodeSchemaMap)
      })
    })

    // superagent
    //   .get(`${TOOLS_SCHEMA_REGISTRY_URL}`)
    //   .end((error, response) => {
    //     const { body } = response
    //     if (error) return
    //     this.setState({ toolsSchema: body, loading: false })
    //   })

    // desviceSchemaRegistry
  }

  setErrorState(error) {
    this.setState({
      error,
      loading: false,
      flowDevice: null,
      toolsSchema: null,
    })
  }

  handleUpdate(mappings) {
    this.configSchema = this.mappingToConfig({ mappings })
  }

  mappingToConfig({ mappings }) {
    const config = {
      type: 'object',
      properties: {},
    }

    _.each(mappings, function (mapping) {
      let property = config.properties[mapping.configureProperty]
      property = property || { type: mapping.type }
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
    const meshblu = new MeshbluHttp(getMeshbluConfig())
    const { flowDevice } = this.state
    const bluprintConfig = this.deviceDefaults({
      name: appName.value,
      version: flowDevice.instanceId,
      flowId: flowUuid,
      configSchema: this.configSchema,
    })

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
  }

  deviceDefaults({ flowId, name, configSchema, version }) {
    const USER_UUID = getMeshbluConfig().uuid
    return {
      name,
      owner: USER_UUID,
      online: true,
      type: 'octoblu:bluprint',
      bluprint: {
        flowId,
        latest: version,
        versions: [
          {
            version,
            schemas: {
              configure: {
                bluprint: configSchema,
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
    const { error, loading, flowDevice, toolsSchema } = this.state
    if (!flowDevice || !toolsSchema) return null

    return (
      <main>
        <Page width="small">
          <CreateAppForm
            onCreate={this.handleCreate}
            loading={loading}
            error={error}
            flow={flowDevice.flow}
            toolsSchema={toolsSchema}
            onUpdate={this.handleUpdate}
          />
        </Page>
      </main>
    )
  }
}

CreateBluprint.propTypes = propTypes

export default CreateBluprint
