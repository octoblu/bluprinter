import noop from 'lodash.noop'
import React, { PropTypes } from 'react'
import { Button, FormField, FormInput } from 'zooid-ui'
import BluprintConfigBuilder from 'zooid-ui-bluprint-config-builder'

const propTypes = {
  flow: PropTypes.object,
  nodeSchemaMap: PropTypes.array,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
}

const defaultProps = {
  onCreate: noop,
  onUpdate: noop,
  onShareDevice: noop,
  flow: null,
  nodeSchemaMap: null,
}

const CreateAppForm = ({ flow, nodeSchemaMap, onCreate, onUpdate, onShareDevice }) => {
  return (
    <form onSubmit={onCreate}>
      <FormField label="IoT App Name" name="appName">
        <FormInput name="appName" placeholder="App Name" autofocus />
      </FormField>

      <BluprintConfigBuilder
        flow={flow}
        nodeSchemaMap={nodeSchemaMap}
        onUpdate={onUpdate}
        onShareDevice={onShareDevice}
      />

      <Button type="submit" kind="primary">Create IoT App</Button>
    </form>
  )
}

CreateAppForm.propTypes    = propTypes
CreateAppForm.defaultProps = defaultProps

export default CreateAppForm
