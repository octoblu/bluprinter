import _ from 'lodash'
import React, { PropTypes } from 'react'
import {browserHistory} from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import MeshbluHttp from 'browser-meshblu-http'
import Button from 'zooid-button'
import Card from 'zooid-card'
import Input from 'zooid-input'
import Page from 'zooid-page'
import { OCTOBLU_URL } from 'config'

import BluprintManifestList from '../components/BluprintManifestList/'
import BluprintVersionSelect from '../components/BluprintVersionSelect/'
import DeviceHeader from '../components/DeviceHeader/'
import Dialog from '../components/Dialog/'
import ShareUrl from '../components/ShareUrl/'

import { getBluprint } from '../actions/bluprint/'
import { getMeshbluConfig } from '../services/auth-service'

const propTypes = {
  device: PropTypes.object,
  error: PropTypes.object,
  fetching: PropTypes.bool,
  dispatch: PropTypes.func,
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
      deletingBluprint: false,
      publicBluprint: false,
      showDeleteDialog: false,
    }
  }

  componentDidMount() {
    const { dispatch, routeParams } = this.props
    const { uuid } = routeParams

    dispatch(getBluprint(uuid))
  }

  handleDeleteBluprint = () => {
    this.setState({deletingBluprint: true, showDeleteDialog: false})

    const meshbluConfig = getMeshbluConfig()
    const meshblu       = new MeshbluHttp(meshbluConfig)

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

  handlePush = (path) => {
    const {dispatch} = this.props
    dispatch(push(path))
  }

  handlePublic = () => {
    this.setState({publicBluprint: !this.state.publicBluprint})
  }

  handleVersionSelect = () => {
    console.log("VERSION SELECTED!")
  }

  render() {
    const { device, error, fetching } = this.props
    const { publicBluprint, showDeleteDialog } = this.state

    if (fetching) return <Page loading />
    if (error)   return <Page error={error} />
    if (_.isEmpty(device)) return <Page><div>Device not found.</div></Page>

    const { bluprint, name, uuid } = device

    return (
      <Page>
        <Card>
          <DeviceHeader device={device}>
            <div>
              <Button
                onClick={() => this.handlePush(`/bluprints/${uuid}/import`)}
                kind="hollow-neutral"
                disabled={false}
                size="small"
              >
                Import
              </Button>

              <Button
                onClick={() => this.handlePush(`/bluprints/${uuid}/update`)}
                kind="hollow-neutral"
                disabled={false}
                size="small"
              >
                Update
              </Button>

              <Button onClick={this.checkBeforeDeleting} kind="hollow-danger" disabled={false} size="small">
                Delete
              </Button>
            </div>
          </DeviceHeader>

          <Input label="Name" name="bluprintName" defaultValue={name} />

          <BluprintVersionSelect latest={bluprint.latest} versions={bluprint.versions} onChange={this.handleVersionSelect} />

          <ShareUrl uuid={device.uuid} publicBluprint={publicBluprint} onChange={this.handlePublic} />

          <BluprintManifestList manifest={bluprint.manifest} />
        </Card>

        <Dialog
          showDialog={showDeleteDialog}
          body="Are you sure you want to delete this bluprint?"
          onCancel={this.cancelDeleteBluprint}
          onConfirm={this.handleDeleteBluprint}
        />
      </Page>
    )
  }
}

BluprintDetail.propTypes = propTypes

const mapStateToProps = ({bluprint}) => {
  const { device, error, fetching } = bluprint

  return {
    device,
    error,
    fetching,
  }
}

export default connect(mapStateToProps)(BluprintDetail)
