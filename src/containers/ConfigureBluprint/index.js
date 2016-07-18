import _ from 'lodash'
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Alert from 'zooid-alert'
import Button from 'zooid-button'
import FormField from 'zooid-form-field'
import Heading from 'zooid-heading'
import Input from 'zooid-input'
import Page from 'zooid-page'
import BluprintConfigBuilder from 'zooid-ui-bluprint-config-builder'
import { TOOLS_SCHEMA_REGISTRY_URL } from 'config'

import { getBluprint } from '../../actions/bluprint'
import { getFlow } from '../../actions/flow'
import { getOperationSchemas, getDeviceSchemas } from '../../actions/schemas'
import CreateBluprintSteps from '../../components/CreateBluprintSteps'
import styles from './styles.css'

const propTypes = {
  bluprint: PropTypes.object,
  dispatch: PropTypes.func,
  flow: PropTypes.object,
  params: PropTypes.object,
  schemas: PropTypes.object,
}

class ConfigureBluprint extends React.Component {
  componentDidMount() {
    const { dispatch, params } = this.props
    dispatch(getBluprint(params.bluprintUuid))
    dispatch(getOperationSchemas(TOOLS_SCHEMA_REGISTRY_URL))
  }

  componentWillReceiveProps(nextProps) {
    const { bluprint, flow } = nextProps

    if (bluprint === this.props.bluprint) return
    if (_.isEmpty(bluprint.device)) return

    if (_.isEmpty(flow.device) || (flow.device.uuid !== bluprint.device.bluprint.flowId)) {
      this.props.dispatch(getFlow(bluprint.device.bluprint.flowId))
      return
    }
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

  render() {
    const { bluprint, flow, schemas } = this.props
    const { error, fetching }         = bluprint
    const { fetchingOperationSchemas, fetchingDeviceSchemas } = schemas

    if (fetching) return <Page className={styles.NewBluprintPage} loading />
    if (fetchingOperationSchemas || fetchingDeviceSchemas) {
      return <Page className={styles.NewBluprintPage} loading />
    }
    if (error) return <Page className={styles.NewBluprintPage} error={error} />
    if (_.isEmpty(bluprint.device) || _.isEmpty(flow.device)) return null

    const { name } = bluprint.device
    const steps = [
      { label: 'Create a Bluprint', state: 'COMPLETED' },
      { label: 'Configure', state: 'ACTIVE' },
      { label: 'Finish' },
    ]

    return (
      <Page className={styles.NewBluprintPage}>
        <CreateBluprintSteps steps={steps} />
        <div className={styles.root}>
          <Heading level={4}>Configure Bluprint: {name}</Heading>

          <BluprintConfigBuilder
            nodes={flow.device.draft.nodes}
            operationSchemas={schemas.operationSchemas}
            deviceSchemas={schemas.deviceSchemas}
            onUpdate={_.noop}
          />
        </div>
      </Page>
    )
  }
}

const mapStateToProps = ({ bluprint, flow, schemas }) => {
  return { bluprint, flow, schemas }
}

ConfigureBluprint.propTypes = propTypes

export default connect(mapStateToProps)(ConfigureBluprint)
