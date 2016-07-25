import React, { PropTypes } from 'react'
import url from 'url'
import MeshbluHttp from 'browser-meshblu-http'
import superagent from 'superagent'
import Card from 'zooid-card'
import Page from 'zooid-page'

import { FLOW_DEPLOY_URL } from 'config'

import CreateAppForm from '../components/CreateAppForm'

import NodeService          from '../services/node-service'
import { getMeshbluConfig } from '../services/auth-service'
import FlowService          from '../services/flow-service'
import BluprintService      from '../services/bluprint-service'

const propTypes = {
  history: PropTypes.object,
  routeParams: PropTypes.object,
}

class CreateBluprint extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
      flowDevice: null,
      loading: true,
      manifest: null,
      nodeSchemaMap: null,
      configSchema: null,
      sharedDevices: null,
      name: '',
      version: 1,
      toastMessage: null,
    }

    this.flowService = new FlowService()
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
        .getOperationSchemas()
        .then((operationSchemas) => {
          this.setState({ operationSchemas, loading: false})
        })

      this.flowService
        .setDeviceSchemas(flowDevice.draft.nodes)
        .then((deviceSchemas) => {
          this.setState({ deviceSchemas, loading: false})
        })
    })
  }

  setErrorState(error) {
    this.setState({
      error,
      loading: false,
      flowDevice: null,
      nodeSchemaMap: null,
      configSchema: null,
      devicesNeedingPermissions: null,
    })
  }

  handleUpdate = ({ configSchema, sharedDevices }) =>  {
    this.setState({configSchema, sharedDevices, toastMessage: null })
  }

  handleBluprintSelect = ({target}) => {
    const bluprint = target.value
    if (bluprint === 'new') return this.setState({bluprint: undefined})
    return this.setState({bluprint})
  }

  handleCreate = (event) => {
    event.preventDefault()
    this.setState({ loading: true })

    const { configSchema, sharedDevices } = this.state

    const { appName } = event.target
    const { history } = this.props
    const {flowUuid} = this.props.routeParams
    const meshbluConfig = getMeshbluConfig()
    const meshblu = new MeshbluHttp(meshbluConfig)
    const { flowDevice, version } = this.state

    this.flowService.addGlobalMessageReceivePermissions(sharedDevices, () => {
      const bluprintConfig = this.deviceDefaults({
        name: appName.value,
        flowId: flowUuid,
        messageSchema: this.flowService.getMessageSchema({nodes: flowDevice.draft.nodes}),
        manifest: this.state.manifest,
        configSchema,
        version,
        sharedDevices
      })

      meshblu.register(bluprintConfig, (error, device) => {
        if (error) {
          this.setErrorState(error)
          return
        }

        meshblu.updateDangerously(flowUuid, {
            $addToSet: {
              discoverWhitelist: device.uuid
          }
        },
        () => {
          superagent
            .post(`${FLOW_DEPLOY_URL}/bluprint/${device.uuid}/${version}`)
            .auth(meshbluConfig.uuid, meshbluConfig.token)
            .send({flowId: flowUuid})
            .end(() => {
              const { uuid } = device
              const update = this.linksProperties({ uuid })

              meshblu.update(uuid, update, (updateError) => {
                if (updateError) {
                  this.setErrorState(updateError)
                  return
                }
                history.push(`/bluprints/${device.uuid}`)
              })
            })
          })
        })
      })
  }

  deviceDefaults({ flowId, name, configSchema, messageSchema, version, manifest, sharedDevices }) {
    const USER_UUID = getMeshbluConfig().uuid
    return {
      name,
      owner: USER_UUID,
      online: true,
      type: 'bluprint',
      logo: 'https://s3-us-west-2.amazonaws.com/octoblu-icons/device/bluprint.svg',
      schemas: {
        version: '2.0.0',
        configure: {
          default: {
            type: 'object',
            properties: {
              description: {
                type: 'string'
              },
            },
          },
        },
      },
      bluprint: {
        version: '1.0.0',
        flowId,
        latest: version,
        schemas: {
          version: '2.0.0',
          configure: {
            default: configSchema,
          },
          message: {
            default: messageSchema,
          }
        },
        versions: [
          {
            manifest,
            version,
            sharedDevices,
            schemas: {
              configure: {
                default: configSchema,
              },
              message: {
                default: messageSchema,
              }
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
        links: [
          {
            title: 'Bluprint Detail',
            url: url.format({ protocol, hostname, port, pathname: `/bluprints/${uuid}` }),
          },
          {
            title: 'Import Bluprint',
            url: url.format({ protocol, hostname, port, pathname: `/bluprints/${uuid}/import` }),
          },
        ],
      },
    }
  }

  render() {
    const {
      deviceSchemas,
      error,
      flowDevice,
      loading,
      operationSchemas,
      bluprints,
      sharedDevices
    } = this.state

    if (loading) return <Page loading />
    if (error) return <Page error={error.message} />
    if (!flowDevice || !operationSchemas || !deviceSchemas) return null

    return (
      <Page title="Create a new Bluprint">
        <Card>
          <CreateAppForm
            bluprints={bluprints}
            nodes={flowDevice.draft.nodes}
            operationSchemas={operationSchemas}
            deviceSchemas={deviceSchemas}
            sharedDevices={sharedDevices}
            onCreate={this.handleCreate}
            onBluprintSelect={this.handleBluprintSelect}
            onUpdate={this.handleUpdate}
            onShareDevices={this.handleShareDevices}
          />
        </Card>
      </Page>
    )
  }
}

CreateBluprint.propTypes = propTypes

export default CreateBluprint
