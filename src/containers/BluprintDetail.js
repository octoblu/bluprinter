import _ from 'lodash'
import React, { PropTypes } from 'react'
import MeshbluHttp from 'browser-meshblu-http'
import superagent from 'superagent'
import Input from 'zooid-input'
import Page from 'zooid-page'
import Card from 'zooid-card'
import { OCTOBLU_URL, FLOW_DEPLOY_URL } from 'config'

import { getMeshbluConfig } from '../services/auth-service'
import { getLatestConfigSchema } from '../services/bluprint-service'

import BluprintManifestList from '../components/BluprintManifestList/'
import BluprintPageHeader from '../components/BluprintPageHeader/'
import ShareUrl from '../components/ShareUrl/'

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
      deletingBluprint: false,
      publicBluprint: false,
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

  handleDeleteBluprint = () => {
    console.log('Delete Bluprint');
  }

  handleImport = () => {
    this.props.history.push(`bluprints/${this.state.device.uuid}/import`)
  }

  handlePublic = () => {
    this.setState({publicBluprint: !this.state.publicBluprint})
  }


  render() {
    const {
      alertMessage,
      deletingBluprint,
      device,
      error,
      loading,
      publicBluprint,
      selectableDevices,
    } = this.state

    if (loading) return <Page loading={loading} />
    if (error)   return <Page error={error} />
    if (_.isEmpty(device)) return <Page><div>Device not found.</div></Page>

    const { bluprint, name } = device
    const latestConfigSchema = getLatestConfigSchema(bluprint)

    return (
      <Page>
        <Card>
          <BluprintPageHeader
            device={device}
            onDelete={this.handleDeleteBluprint}
            deleting={deletingBluprint}
            onImport={this.handleImport}
          />

          <Input label="Name" name="bluprintName" value={name} />

          <ShareUrl uuid={device.uuid} publicBluprint={publicBluprint} onChange={this.handlePublic} />

          <BluprintManifestList manifest={bluprint.manifest} />
        </Card>
      </Page>
    )
  }
}


BluprintDetail.propTypes = propTypes

export default BluprintDetail
