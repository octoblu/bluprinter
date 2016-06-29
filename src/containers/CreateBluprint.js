import _ from 'lodash'
import React, { PropTypes } from 'react'
import url from 'url'
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'
import superagent from 'superagent'
import Toast from 'zooid-toast'
import { Page, Spinner } from 'zooid-ui'
import Heading from 'zooid-heading'

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
      error: null,
      flowDevice: null,
      loading: true,
      manifest: null,
      nodeSchemaMap: null,
      configSchema: null,
      sharedDevices: null,
      name: '',
      version: '1.0.0',
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
        .getDeviceSchemas(flowDevice.draft.nodes)
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
    console.log('Receiving configSchema and sharedDevices', configSchema, sharedDevices)
    this.setState({configSchema, sharedDevices, toastMessage: null })
  }

  handleShareDevices = ({shareExistingDevices, sharedDevices}) => {
    if (shareExistingDevices) {
      this.flowService
      .addGlobalMessageReceivePermissions(sharedDevices, (error, deviceResult) => {
        console.log('Added Global Message Receive Permission', error, deviceResult)
      })
    } else {
      this
      .flowService
      .removeGlobalMessageReceivePermissions(sharedDevices, (error, deviceResult) => {
        console.log('Removed Global Message Receive Permission', error, deviceResult)
      })
    }
    this.setState({toastMessage: 'Device permissions updated'})
  }

  handleCreate = (event) => {
    event.preventDefault()

    this.setState({ loading: true })

    const { configSchema } = this.state

    const { appName } = event.target
    const { flowUuid } = this.props.routeParams
    const meshbluConfig = getMeshbluConfig()
    const meshblu = new MeshbluHttp(meshbluConfig)
    const { flowDevice, version } = this.state

    const bluprintConfig = this.deviceDefaults({
      name: appName.value,
      version,
      flowId: flowUuid,
      configSchema,
      messageSchema: this.flowService.getMessageSchema({nodes: flowDevice.draft.nodes}),
      manifest: this.state.manifest,
    })

    superagent
      .post(`${FLOW_DEPLOY_URL}/bluprint/${flowUuid}/${version}`)
      .auth(meshbluConfig.uuid, meshbluConfig.token)
      .end(() => {
        console.log('Registering a new device')
        meshblu.register(bluprintConfig, (error, device) => {
          if (error) {
            this.setErrorState(error)
            return
          }

          const { uuid } = device
          const update = this.linksProperties({ uuid })

          console.log('Updating new IoT App')
          meshblu.update(uuid, update, (updateError) => {
            if (updateError) {
              this.setErrorState(updateError)
              return
            }
            console.log('Redirecting to octoblu')
            window.location = `${OCTOBLU_URL}/device/${device.uuid}`
          })
        })
      })
  }

  deviceDefaults({ flowId, name, configSchema, messageSchema, version, manifest }) {
    const USER_UUID = getMeshbluConfig().uuid
    return {
      name,
      owner: USER_UUID,
      online: true,
      type: 'bluprint',
      logo: 'https://s3-us-west-2.amazonaws.com/octoblu-icons/device/bluprint.svg',
      bluprint: {
        flowId,
        latest: version,
        manifest,
        versions: [
          {
            version,
            schemas: {
              configure: {
                bluprint: configSchema,
              },
              message: {
                bluprint: messageSchema,
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
      toastMessage,
      configSchema,
      sharedDevices
    } = this.state



    if (loading) return <Page width="small"><Spinner size="large" /></Page>
    if (error) return <Page width="small">Error: {error.message}</Page>

    if (!flowDevice || !operationSchemas || !deviceSchemas) return null

    return (
      <Page width="small">
        <Toast message={toastMessage} />

        <Heading level={4}>Create IoT App</Heading>

        <CreateAppForm
          nodes={flowDevice.draft.nodes}
          operationSchemas={operationSchemas}
          deviceSchemas={deviceSchemas}
          sharedDevices={sharedDevices}
          onCreate={this.handleCreate}
          onUpdate={this.handleUpdate}
          onShareDevices={this.handleShareDevices}
        />
      </Page>
    )
  }
}

CreateBluprint.propTypes = propTypes

export default CreateBluprint
