import noop from 'lodash.noop'
import React, { PropTypes } from 'react'
import Button from 'zooid-button'
import Input from 'zooid-input'
import BluprintConfigBuilder from 'zooid-ui-bluprint-config-builder'

import ShareDevices from '../ShareDevices/'

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

const CreateAppForm = ({ nodes, operationSchemas, deviceSchemas, sharedDevices, onCreate, onUpdate, onShareDevices }) => {
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

      <ShareDevices sharedDevices={sharedDevices} onShareDevices={onShareDevices} />
      <Button type="submit" kind="primary">Create IoT App</Button>
    </form>
  )
}

CreateAppForm.propTypes    = propTypes
CreateAppForm.defaultProps = defaultProps

export default CreateAppForm
