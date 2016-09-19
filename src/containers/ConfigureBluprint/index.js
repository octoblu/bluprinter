import _ from 'lodash'
import React, { PropTypes } from 'react'
import {push} from 'react-router-redux'
import { connect } from 'react-redux'
import Alert from 'zooid-alert'
import Button from 'zooid-button'
import Heading from 'zooid-heading'
import Page from 'zooid-page'
import BluprintConfigBuilder from 'zooid-ui-bluprint-config-builder'
import { TOOLS_SCHEMA_REGISTRY_URL } from 'config'


import styles from './styles.css'

import { setActiveBreadcrumb, goToBreadcrumb } from '../../modules/Breadcrumbs'

import { getFlow } from '../../actions/flow'
import { getOperationSchemas } from '../../actions/schemas'
import {
  getBluprint,
  setBluprintConfigSchema,
  setBluprintSharedDevices,
  updateBluprint,
} from '../../actions/bluprint'

const propTypes = {
  bluprint: PropTypes.object,
  dispatch: PropTypes.func,
  flow: PropTypes.object,
  params: PropTypes.object,
  routing: PropTypes.object,
  schemas: PropTypes.object,
}

class ConfigureBluprint extends React.Component {
  componentDidMount() {
    const { dispatch, params } = this.props

    dispatch(setActiveBreadcrumb('Configure'))
    dispatch(getBluprint(params.bluprintUuid))
    dispatch(getOperationSchemas(TOOLS_SCHEMA_REGISTRY_URL))
  }

  componentWillReceiveProps(nextProps) {
    const { bluprint, flow } = nextProps

    if (bluprint === this.props.bluprint) return
    if (_.isEmpty(bluprint.device)) return

    if (_.isEmpty(flow.device) || (flow.device.uuid !== bluprint.device.bluprint.flowId)) {
      return this.props.dispatch(getFlow(bluprint.device.bluprint.flowId))
    }
  }

  handleConfigUpdate = ({ configSchema, sharedDevices }) => {
    const { dispatch } = this.props

    dispatch(setBluprintConfigSchema(configSchema))
    dispatch(setBluprintSharedDevices(sharedDevices))
  }

  handleBluprintUpdate = () => {
    const { bluprint, dispatch, routing } = this.props

    dispatch(updateBluprint(bluprint))
      .then(() => {
        const {pathname} = routing.locationBeforeTransitions

        if (_.isEmpty(bluprint.sharedDevices)) {
          return dispatch(push(`/bluprints/${bluprint.device.uuid}`))
        }

        dispatch(goToBreadcrumb(pathname, 'update-permissions'))
      })
      .catch(() => {
        console.log('Update failed')
      })
  }

  renderSubmitButton(loading) {
    let submitButton = (
      <Button type="submit" kind="primary">
        Continue
      </Button>
    )

    if (loading) {
      submitButton = (
        <Button type="submit" kind="primary" disabled>
          Creating...
        </Button>
      )
    }

    return submitButton
  }

  renderBluprintConfigBuilder() {
    const { flow, schemas } = this.props
    if (_.isEmpty(flow)) return <h1>Waiting for flow</h1>
    if (_.isEmpty(schemas.operationSchemas)) return <h1>Waiting for operation schemas</h1>
    if (!schemas.deviceSchemas) return <h1>Waiting for device schemas</h1>
    let nodes = flow.device.draft.nodes

    return (
      <BluprintConfigBuilder
        nodes={nodes}
        operationSchemas={schemas.operationSchemas}
        deviceSchemas={schemas.deviceSchemas}
        onUpdate={this.handleConfigUpdate}
      />
    )
  }
  render() {
    const { bluprint, flow, schemas } = this.props
    const { device, error, fetching, updating } = bluprint
    const { fetchingOperationSchemas, fetchingDeviceSchemas } = schemas

    if (fetching) return <Page className={styles.NewBluprintPage} loading />
    if (fetchingOperationSchemas || fetchingDeviceSchemas) {
      return <Page className={styles.NewBluprintPage} loading />
    }
    if (_.isEmpty(device) || _.isEmpty(flow.device)) return null

    const { name } = device

    return (
      <Page className={styles.NewBluprintPage}>
        <div className={styles.root}>
          <Heading level={4}>Configure Bluprint: {name}</Heading>

          {this.renderBluprintConfigBuilder()}

          <Button
            kind="primary"
            onClick={this.handleBluprintUpdate}
          >
            {updating ? 'Updating...' : 'Configure & Continue'}
          </Button>

          {error && <Alert type="error">{error.message}</Alert>}
        </div>
      </Page>
    )
  }
}

const mapStateToProps = ({ bluprint, flow, schemas, routing }) => {
  return { bluprint, flow, schemas, routing }
}

ConfigureBluprint.propTypes = propTypes

export default connect(mapStateToProps)(ConfigureBluprint)
