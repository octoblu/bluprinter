import noop from 'lodash.noop'
import React, { PropTypes } from 'react'
import Button from 'zooid-button'
import Input from 'zooid-input'
import BluprintConfigBuilder from 'zooid-ui-bluprint-config-builder'

const propTypes = {
  nodes: PropTypes.array,
  operationSchemas: PropTypes.object,
  deviceSchemas: PropTypes.object,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
}

const defaultProps = {
  onCreate: noop,
  onUpdate: noop,
  nodes: null,
  operationSchemas: null,
  deviceSchemas: null
}

const CreateAppForm = ({ nodes, operationSchemas, deviceSchemas, onCreate, onUpdate }) => {
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
        nodes={nodes}
        operationSchemas={operationSchemas}
        deviceSchemas={deviceSchemas}
        onUpdate={onUpdate}
      />

      <Button type="submit" kind="primary">Create IoT App</Button>
    </form>
  )
}

CreateAppForm.propTypes    = propTypes
CreateAppForm.defaultProps = defaultProps

export default CreateAppForm
