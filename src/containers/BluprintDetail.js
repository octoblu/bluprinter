import _ from 'lodash'
import React, { PropTypes } from 'react'
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'
import superagent from 'superagent'
import Toast from 'zooid-toast'
import Button from 'zooid-button'
import Heading from 'zooid-heading'
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
      device: null,
      loading: false,
      error: null,
      alertMessage: null,
      updatingVersion: false,
      selectableDevices: []
    }
  }

  componentDidMount() {
    console.log(this.props)
    const { uuid } = this.props.routeParams
    console.log("uuid", uuid)
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

    meshblu.search({query: {owner: meshbluConfig.uuid} , projection: {name: true, type: true, uuid: true}}, (error, selectableDevices) =>{
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
          updatingVersion: false,
          alertMessage: 'Bluprint Version Updated',
        })
      })
  }

  render() {
    const { device, error, loading, alertMessage, updatingVersion, selectableDevices } = this.state

    if (loading) return <Page loading={loading} />
    if (error)   return <Page error={error} />
    if (_.isEmpty(device)) return <Page><div>Device not found.</div></Page>

    const { bluprint, name } = device
    const latestConfigSchema = getLatestConfigSchema(bluprint)

    return (
      <Page title={name}>
        <BluprintDetailPageActions
          onUpdateVersion={this.handleUpdateVersion}
          updating={updatingVersion}
        />
        <BluprintConfigureForm schema={latestConfigSchema} selectableDevices={selectableDevices} />
        <BluprintManifestList manifest={bluprint.manifest} />
      </Page>
    )
  }
}

BluprintDetail.propTypes = propTypes

export default BluprintDetail
