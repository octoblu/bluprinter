import noop from 'lodash.noop'
import React, { PropTypes } from 'react'
import Button from 'zooid-button'
import Input from 'zooid-input'
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
  flow: null,
  nodeSchemaMap: null,
}

const CreateAppForm = ({ flow, nodeSchemaMap, onCreate, onUpdate }) => {
  return (
    <form onSubmit={onCreate}>
      <Input
        name="appName"
        label="IoT App Name"
        placeholder="App Name"
        autofocus
        required
      />

      <BluprintConfigBuilder
        flow={flow}
        nodeSchemaMap={nodeSchemaMap}
        onUpdate={onUpdate}
      />

      <Button type="submit" kind="primary">Create IoT App</Button>
    </form>
  )
}

CreateAppForm.propTypes    = propTypes
CreateAppForm.defaultProps = defaultProps

export default CreateAppForm
