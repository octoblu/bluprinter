import _ from 'lodash'
import React, { PropTypes } from 'react'
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'
import superagent from 'superagent'
import Button from 'zooid-button'
import Heading from 'zooid-heading'
import Toast from 'zooid-toast'
import { Page, PageHeader, PageTitle, PageActions, Spinner } from 'zooid-ui'

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
      toastMessage: null,
    }
  }

  componentWillMount() {
    const { uuid } = this.props.routeParams
    const meshbluConfig = getMeshbluConfig()
    const meshblu = new MeshbluHttp(meshbluConfig)

    this.setState({ loading: true })

    meshblu.device(uuid, (error, device) => {
      if (error) {
        this.setState({
          error,
          loading: false,
        })

        return
      }

      this.setState({
        device,
        loading: false,
      }, () => {
        console.log(this.state.device)
      })
    })
  }

  handleUpdateVersion = () => {
    this.setState({ loading: true })

    const { uuid, token } = getMeshbluConfig()
    const { flowId, latest } = this.state.device.bluprint

    superagent
      .put(`${FLOW_DEPLOY_URL}/bluprint/${flowId}/${latest}`)
      .auth(uuid, token)
      .end((error) => {
        if (error) {
          this.setState({
            error,
            loading: false,
          })
          return
        }

        this.setState({
          loading: false,
          toastMessage: 'Bluprint Version Updated',
        })
      })
  }

  render() {
    const { device, error, loading, toastMessage } = this.state

    if (loading) return <Spinner size="large" />
    if (error)   return <div>Error: {error.message}</div>
    if (_.isEmpty(device)) return <div>Device not found.</div>

    const { bluprint, name } = device
    const latestConfigSchema = getLatestConfigSchema(bluprint)

    return (
      <Page width="small">
        <PageHeader>
          <PageTitle>{name}</PageTitle>
          <BluprintDetailPageActions onUpdateVersion={this.handleUpdateVersion} />
        </PageHeader>

        <BluprintConfigureForm schema={latestConfigSchema} />
        <BluprintManifestList manifest={bluprint.manifest} />

        <Toast message={toastMessage} />

      </Page>
    )
  }
}

BluprintDetail.propTypes = propTypes

export default BluprintDetail
