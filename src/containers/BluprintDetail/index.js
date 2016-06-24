import _ from 'lodash'
import React, { PropTypes } from 'react'
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'
import Button from 'zooid-button'
import Heading from 'zooid-heading'
import { Page, PageHeader, PageTitle, PageActions } from 'zooid-ui'

import { getMeshbluConfig } from '../../services/auth-service'

import BluprintManifestList from '../../components/BluprintManifestList/'

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

  render() {
    const { device, error, loading } = this.state

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>
    if (_.isEmpty(device)) return <div>Device not found.</div>

    const { bluprint, name } = device

    return (
      <Page width="small">
        <PageHeader>
          <PageTitle>{name}</PageTitle>
          
          <PageActions>
            <Button>Update Version</Button>
            <Button>Import</Button>
          </PageActions>
        </PageHeader>

        <BluprintManifestList manifest={bluprint.manifest} />
      </Page>
    )
  }
}

BluprintDetail.propTypes = propTypes

export default BluprintDetail
