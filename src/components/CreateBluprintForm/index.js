import _ from 'lodash'
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Alert from 'zooid-alert'
import Button from 'zooid-button'
import Heading from 'zooid-heading'
import Input from 'zooid-input'
import FormField from 'zooid-form-field'

import styles from './styles.css'
import { createBluprint } from '../../actions/bluprint'
import { setActiveBreadcrumb } from '../../modules/Breadcrumbs'

const propTypes = {
  bluprint: PropTypes.object,
  flowId: PropTypes.string,
  dispatch: PropTypes.func,
  onCreateBluprint: PropTypes.func,
  params: PropTypes.object,
}

class CreateBluprintForm extends React.Component {
  constructor(props) {
    super(props)

    this.handleCreateBluprint = this.handleCreateBluprint.bind(this)
    props.dispatch(setActiveBreadcrumb('Create a Bluprint'))
  }

  componentWillReceiveProps({bluprint}) {
    if (_.isEmpty(bluprint.device)) return
    this.props.dispatch(push(`/bluprints/setup/${bluprint.device.uuid}/configure`))
  }

  handleCreateBluprint(event) {
    event.preventDefault()

    const { bluprint, flowId } = this.props
    const { name, description, visibility } = event.target
    const bluprintAction = {
      name: name.value,
      description: description.value,
      visibility: visibility.value,
      flowId,
      manifest: bluprint.manifest,
    }

    this.props.dispatch(createBluprint(bluprintAction))
  }

  renderSubmitButton(loading) {
    let submitButton = (
      <Button type="submit" kind="primary">
        Create & Continue
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
    const { creating, error } = this.props.bluprint

    return (
      <div className={styles.root}>
        <Heading level={4}>Create a Bluprint</Heading>

        <form onSubmit={this.handleCreateBluprint}>
          <fieldset className={styles.fieldset}>
            <Input
              name="name"
              label="Bluprint Name"
              description="Pick a name to help you identify this Bluprint."
              autoFocus
              required
            />

            <Input
              name="description"
              label="Description"
            />
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Visibility</legend>

            <FormField>
              <label className={styles.radioLabel}>
                <input type="radio" name="visibility" value="private" defaultChecked />
                <div className={styles.radioBody}>
                  Private
                  <div className={styles.radioDescription}>
                    You choose who has permission.
                  </div>
                </div>
              </label>
            </FormField>

            <FormField>
              <label className={styles.radioLabel}>
                <input type="radio" name="visibility" value="public" />
                <div className={styles.radioBody}>
                  Public
                  <div className={styles.radioDescription}>
                    Shared in our App Store.
                  </div>
                </div>
              </label>
            </FormField>
          </fieldset>

          {this.renderSubmitButton(creating)}

          {error && <Alert type="error" className={styles.errorAlert}>{error.message}</Alert>}
        </form>
      </div>
    )
  }
}

const mapStateToProps = ({ bluprint }) => {
  return { bluprint }
}

CreateBluprintForm.propTypes = propTypes

export default connect(mapStateToProps)(CreateBluprintForm)
