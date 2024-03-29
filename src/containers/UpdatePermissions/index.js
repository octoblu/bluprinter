import _ from 'lodash'
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
import Alert from 'zooid-alert'
import Heading from 'zooid-heading'
import Page from 'zooid-page'

import { getBluprint } from '../../actions/bluprint'
import UpdateSharedDevicesAlert from '../../components/UpdateSharedDevicesAlert'
import { setActiveBreadcrumb } from '../../modules/Breadcrumbs'
import { getSharedDevices, updateSharedDevicesPermissions } from '../../modules/SharedDevices'

import styles from './styles.css'

const propTypes = {
  bluprint: PropTypes.object,
  dispatch: PropTypes.func,
  flow: PropTypes.object,
  params: PropTypes.object,
  sharedDevices: PropTypes.object,
}

class UpdatePermissions extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
    this.handleUpdatePermissions  = this.handleUpdatePermissions.bind(this)
    const { dispatch, params } = props
    dispatch(setActiveBreadcrumb('Update Permissions'))
    dispatch(getBluprint(params.bluprintUuid))

  }

  componentWillReceiveProps(nextProps) {
    const { bluprint, sharedDevices } = nextProps
    const {device} = bluprint
    if (bluprint === this.props.bluprint) return
    if (_.isEmpty(device)) return
    if (_.isEmpty(sharedDevices.devices)) {
      const {bluprint: bluprintDevice} = device
      const sharedDeviceUuids = _.map(bluprint.sharedDevices, 'uuid')
      this.props.dispatch(getSharedDevices(sharedDeviceUuids))
      return
    }
  }

  handleUpdatePermissions() {
    const { bluprint, dispatch, sharedDevices } = this.props
    const sharedDeviceUuids = _.map(sharedDevices.devices, 'uuid')

    dispatch(updateSharedDevicesPermissions(sharedDeviceUuids)).then(() => {
      dispatch(push(`/bluprints/${bluprint.device.uuid}`))
    })
  }

  render() {
    const { bluprint, sharedDevices } = this.props
    const { device, error, fetching, } = bluprint

    if (fetching) return <Page className={styles.UpdatePermissionsPage} loading />
    if (_.isEmpty(device)) return null

    let sharedDevicesAlert = null
    if (!sharedDevices.fetching) {
      sharedDevicesAlert = (
        <UpdateSharedDevicesAlert
          sharedDevices={sharedDevices.devices}
          onUpdatePermissions={this.handleUpdatePermissions}
        />
      )
    }

    return (
      <Page className={styles.NewBluprintPage}>
        <div className={styles.root}>
          <Heading level={4}>Bluprint: {name}</Heading>
          {sharedDevicesAlert}
          {error && <Alert type="error">{error.message}</Alert>}
        </div>
      </Page>
    )
  }
}

UpdatePermissions.propTypes = propTypes

const mapStateToProps = ({ bluprint,  sharedDevices }) => {
  return { bluprint, sharedDevices }
}

export default connect(mapStateToProps)(UpdatePermissions)
