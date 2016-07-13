import noop from 'lodash.noop'
import React, { PropTypes } from 'react'
import Button from 'zooid-button'
import Input from 'zooid-input'
import FormField from 'zooid-form-field'
import FormLabel from 'zooid-form-label'
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
  onCreate: noop,
  onUpdate: noop,
  onShareDevices: noop,
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
    <form onSubmit={onCreate}>
      <fieldset className={styles.fieldset}>
        <Input
          name="appName"
          label="Bluprint Name"
          description="Great Bluprint names are descriptive"
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
          <FormLabel>
            <input type="radio" name="visibility" value="Public" /> Public
          </FormLabel>
          <div>Shared in our App Store</div>
        </FormField>

        <FormField>
          <FormLabel>
            <input type="radio" name="visibility" value="Private" /> Private
          </FormLabel>
          <div>You choose who has permission.</div>
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
  )
}

CreateAppForm.propTypes    = propTypes
CreateAppForm.defaultProps = defaultProps

export default CreateAppForm
