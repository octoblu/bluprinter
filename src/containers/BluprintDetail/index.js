import _ from 'lodash'
import React, { PropTypes } from 'react'
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'
import superagent from 'superagent'
import Toast from 'zooid-toast'
import Button from 'zooid-button'
import Heading from 'zooid-heading'
import Spinner from 'zooid-spinner'
import Page from '../../components/Page'
import { OCTOBLU_URL, FLOW_DEPLOY_URL } from 'config'

import { getMeshbluConfig } from '../../services/auth-service'
import { getLatestConfigSchema } from '../../services/bluprint-service'

import BluprintManifestList from '../../components/BluprintManifestList/'
import BluprintConfigureForm from '../../components/BluprintConfigureForm/'
import BluprintDetailPageActions from '../../components/BluprintDetailPageActions/'

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
    }
  }

  componentWillMount() {
    const { uuid } = this.props.routeParams
    const meshbluConfig = getMeshbluConfig()
    const meshblu = new MeshbluHttp(meshbluConfig)

    this.setState({ loading: true })

    meshblu.device(uuid, (error, device) => {
      if (error) {
        this.setState({ error, loading: false })
        return
      }

      this.setState({ device, loading: false }, () => {
        console.log(this.state.device)
      })
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
    const { device, error, loading, alertMessage, updatingVersion } = this.state

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
        <BluprintConfigureForm schema={latestConfigSchema} />
        <BluprintManifestList manifest={bluprint.manifest} />
      </Page>
    )
  }
}

BluprintDetail.propTypes = propTypes

export default BluprintDetail
