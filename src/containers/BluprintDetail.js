import _ from 'lodash'
import React, { PropTypes } from 'react'
import MeshbluHttp from 'browser-meshblu-http'
import superagent from 'superagent'
import Toast from 'zooid-toast'
import Button from 'zooid-button'
import Heading from 'zooid-heading'
import Input from 'zooid-input'
import Spinner from 'zooid-spinner'
import Page from 'zooid-page'
import { OCTOBLU_URL, FLOW_DEPLOY_URL } from 'config'

import { getMeshbluConfig } from '../services/auth-service'
import { getLatestConfigSchema } from '../services/bluprint-service'

import BluprintManifestList from '../components/BluprintManifestList/'
import BluprintConfigureForm from '../components/BluprintConfigureForm/'
import BluprintDetailPageActions from '../components/BluprintDetailPageActions/'

const propTypes = {
  routeParams: PropTypes.object,
}

class BluprintDetail extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      alertMessage: null,
      device: null,
      error: null,
      loading: false,
      selectableDevices: [],
      updatingVersion: false,
      deletingBluprint: false,
    }
  }

  componentDidMount() {
    const { uuid } = this.props.routeParams
    const meshbluConfig = getMeshbluConfig()
    const meshblu = new MeshbluHttp(meshbluConfig)

    this.setState({ loading: true })

    meshblu.device(uuid, (error, device) => {
      if (error) {
        this.setState({ error, loading: false })
        return
      }

      this.setState({ device, loading: false })
    })

    meshblu.search({ query: { owner: meshbluConfig.uuid } , projection: {name: true, type: true, uuid: true}}, (error, selectableDevices) =>{
      this.setState({selectableDevices})
    })
  }

  handleUpdateVersion = () => {
    this.setState({ updatingVersion: true })

    const { uuid, token } = getMeshbluConfig()
    const { flowId, latest } = this.state.device.bluprint

    superagent
      .post(`${FLOW_DEPLOY_URL}/bluprint/${flowId}/${latest}`)
      .auth(uuid, token)
      .end((error) => {
        if (error) {
          this.setState({
            error,
            updatingVersion: false,
          })
          return
        }

        this.setState({
          alertMessage: 'Bluprint Version Updated',
          updatingVersion: false,
        })
      })
  }

  handleDeleteBluprint = () => {
    console.log('Delete Bluprint');
  }

  render() {
    const {
      alertMessage,
      device,
      error,
      loading,
      selectableDevices,
      updatingVersion,
      deletingBluprint,
    } = this.state

    if (loading) return <Page loading={loading} />
    if (error)   return <Page error={error} />
    if (_.isEmpty(device)) return <Page><div>Device not found.</div></Page>

    const { bluprint, name } = device
    const latestConfigSchema = getLatestConfigSchema(bluprint)

    return (
      <Page title={name}>
        <BluprintDetailPageActions
          onDeleteBluprint={this.handleDeleteBluprint}
          deleting={deletingBluprint}
          onUpdateVersion={this.handleUpdateVersion}
          updating={updatingVersion}
        />

        <Input label="Name" name="bluprintName" value={name} />

        <BluprintManifestList manifest={bluprint.manifest} />
      </Page>
    )
  }
}

BluprintDetail.propTypes = propTypes

export default BluprintDetail
