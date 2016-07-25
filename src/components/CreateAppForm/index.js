import _ from 'lodash'
import React, { PropTypes } from 'react'
import Button from 'zooid-button'
import Heading from 'zooid-heading'
import Input from 'zooid-input'
import FormField from 'zooid-form-field'
import BluprintConfigBuilder from 'zooid-ui-bluprint-config-builder'

import ShareDevices from '../ShareDevices/'
import styles from './styles.css'

const propTypes = {
  deviceSchemas: PropTypes.object,
  operationSchemas: PropTypes.object,
  nodes: PropTypes.array,
  sharedDevices: PropTypes.array,
  onShareDevices: PropTypes.func,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
}

const defaultProps = {
  deviceSchemas: null,
  nodes: null,
  operationSchemas: null,
  sharedDevices: null,
  onCreate: _.noop,
  onUpdate: _.noop,
  onShareDevices: _.noop,
}

const CreateAppForm = (props) => {
  const {
    nodes,
    operationSchemas,
    deviceSchemas,
    sharedDevices,
    onCreate,
    onUpdate,
    onShareDevices,
  } = props

  return (
    <div className={styles.root}>
      <Heading level={4}>Choose a name</Heading>
      <form onSubmit={onCreate}>
        <fieldset className={styles.fieldset}>
          <Input
            name="appName"
            label="Bluprint Name"
            description="Pick a name to help you identify this Bluprint."
            autoFocus
            required
          />

          <Input
            name="appDescription"
            label="Description"
          />
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Visibility</legend>

          <FormField>
            <label className={styles.radioLabel}>
              <input type="radio" name="visibility" value="Public" />
              <div className={styles.radioBody}>
                Public
                <div className={styles.radioDescription}>
                  Shared in our App Store.
                </div>
              </div>
            </label>
          </FormField>

          <FormField>
            <label className={styles.radioLabel}>
              <input type="radio" name="visibility" value="Private" />
              <div className={styles.radioBody}>
                Private
                <div className={styles.radioDescription}>
                  You choose who has permission.
                </div>
              </div>
            </label>
          </FormField>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Configuration</legend>

          <BluprintConfigBuilder
            nodes={nodes}
            operationSchemas={operationSchemas}
            deviceSchemas={deviceSchemas}
            onUpdate={onUpdate}
          />

          <ShareDevices sharedDevices={sharedDevices} onShareDevices={onShareDevices} />
        </fieldset>

        <Button type="submit" kind="primary">Create IoT App Bluprint</Button>
      </form>
    </div>
  )
}

CreateAppForm.propTypes    = propTypes
CreateAppForm.defaultProps = defaultProps

export default CreateAppForm
