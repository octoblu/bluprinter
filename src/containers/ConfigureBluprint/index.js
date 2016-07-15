import _ from 'lodash'
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Alert from 'zooid-alert'
import Button from 'zooid-button'
import Heading from 'zooid-heading'
import Input from 'zooid-input'
import FormField from 'zooid-form-field'
import BluprintConfigBuilder from 'zooid-ui-bluprint-config-builder'

import styles from './styles.css'
import { createBluprint } from '../../actions/bluprint.actions'

const propTypes = {
  bluprint: PropTypes.object,
  dispatch: PropTypes.func,
  onCreateBluprint: PropTypes.func,
  params: PropTypes.object,
}

class ConfigureBluprint extends React.Component {
  constructor(props) {
    super(props)

    this.handleCreateBluprint = this.handleCreateBluprint.bind(this)
  }

  componentWillReceiveProps({ bluprint }) {
    // if (_.isEmpty(bluprint.device)) return
    //
    // this.props.dispatch(push(`/bluprints/${bluprint.device.uuid}/configure`))
  }

  handleCreateBluprint(event) {
    event.preventDefault()

    const { name, description, visibility } = event.target
    const bluprintAction = {
      name: name.value,
      description: description.value,
      visibility: visibility.value,
      flowId: this.props.params.flowUuid,
    }

    this.props.dispatch(createBluprint(bluprintAction))
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
    const { creating, device, error } = this.props.bluprint

    return (
      <div className={styles.root}>
        <Heading level={4}>Configure Bluprint: {device.name}</Heading>

        {/*<fieldset className={styles.fieldset}>
          <BluprintConfigBuilder
            nodes={nodes}
            operationSchemas={operationSchemas}
            deviceSchemas={deviceSchemas}
            onUpdate={onUpdate}
          />

          <ShareDevices sharedDevices={sharedDevices} onShareDevices={onShareDevices} />
        </fieldset>*/}
      </div>
    )
  }
}

const mapStateToProps = ({ bluprint }) => {
  return { bluprint }
}

ConfigureBluprint.propTypes = propTypes

export default connect(mapStateToProps)(ConfigureBluprint)
