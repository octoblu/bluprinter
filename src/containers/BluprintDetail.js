import _ from 'lodash'
import React, { PropTypes } from 'react'
import {browserHistory} from 'react-router'
import MeshbluHttp from 'browser-meshblu-http'
import Input from 'zooid-input'
import Page from 'zooid-page'
import Card from 'zooid-card'
import { OCTOBLU_URL } from 'config'

import ShareUrl from '../components/ShareUrl/'
import Dialog from '../components/Dialog/'
import BluprintPageHeader from '../components/BluprintPageHeader/'
import BluprintManifestList from '../components/BluprintManifestList/'
import BluprintVersionSelect from '../components/BluprintVersionSelect/'

import { getMeshbluConfig } from '../services/auth-service'

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
      loading: true,
      selectableDevices: [],
      deletingBluprint: false,
      publicBluprint: false,
      showDeleteDialog: false,
    }
  }

  componentDidMount() {
    const { uuid } = this.props.routeParams
    const meshbluConfig = getMeshbluConfig()
    const meshblu = new MeshbluHttp(meshbluConfig)

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
    this.setState({deletingBluprint: true, showDeleteDialog: false})
    const meshbluConfig = getMeshbluConfig()
    const meshblu = new MeshbluHttp(meshbluConfig)

    meshblu.unregister(this.state.device.uuid, () => {
      window.location = `${OCTOBLU_URL}/things/my`
    })
  }

  checkBeforeDeleting = () => {
    this.setState({showDeleteDialog: true})
  }

  cancelDeleteBluprint = () => {
    this.setState({showDeleteDialog: false})
  }

  handleImport = () => {
    browserHistory.push(`bluprints/${this.state.device.uuid}/import`)
  }

  handlePublic = () => {
    this.setState({publicBluprint: !this.state.publicBluprint})
  }

  handleVersionSelect = () => {
    console.log("VERSION SELECTED!")
  }


  render() {
    const {
      deletingBluprint,
      device,
      error,
      loading,
      publicBluprint,
      showDeleteDialog,
    } = this.state

    if (loading) return <Page loading={loading} />
    if (error)   return <Page error={error} />
    if (_.isEmpty(device)) return <Page><div>Device not found.</div></Page>

    const { bluprint, name } = device

    return (
      <Page>
        <Dialog
          showDialog={showDeleteDialog}
          body="Are you sure you want to delete this bluprint?"
          onCancel={this.cancelDeleteBluprint}
          onConfirm={this.handleDeleteBluprint}
        />
        <Card>
          <BluprintPageHeader
            device={device}
            onDelete={this.checkBeforeDeleting}
            deletingBluprint={deletingBluprint}
            onImport={this.handleImport}
          />

          <Input label="Name" name="bluprintName" defaultValue={name} />

          <BluprintVersionSelect latest={bluprint.latest} versions={bluprint.versions} onChange={this.handleVersionSelect} />

          <ShareUrl uuid={device.uuid} publicBluprint={publicBluprint} onChange={this.handlePublic} />

          <BluprintManifestList manifest={bluprint.manifest} />
        </Card>
      </Page>
    )
  }
}


BluprintDetail.propTypes = propTypes

export default BluprintDetail
