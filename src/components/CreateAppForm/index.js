import noop from 'lodash.noop'
import React, { PropTypes } from 'react'
import Button from 'zooid-button'
import Input from 'zooid-input'
import BluprintConfigBuilder from 'zooid-ui-bluprint-config-builder'
import _ from 'lodash'
import ShareDevices from '../ShareDevices/'

const propTypes = {
  deviceSchemas: PropTypes.object,
  operationSchemas: PropTypes.object,
  bluprints: PropTypes.array,
  nodes: PropTypes.array,
  sharedDevices: PropTypes.array,
  onBluprintSelect: PropTypes.func,
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
    bluprints,
    operationSchemas,
    deviceSchemas,
    sharedDevices,
    onBluprintSelect,
    onCreate,
    onUpdate,
    onShareDevices,
  } = props

  const renderBluprintOption = ({uuid, name}) => {
    return <option key={uuid} value={uuid}>{name}</option>
  }

  const renderDefaultOption = () => {
    return <option key="new" value="new" default>New</option>
  }

  const renderBluprintOptions = () => {
    return _.union([renderDefaultOption()], _.map(bluprints, renderBluprintOption))
  }

  return (
    <form onSubmit={onCreate}>
      <select onChange={onBluprintSelect}>
        {renderBluprintOptions(bluprints)}
      </select>
      <Input
        name="appName"
        label="Bluprint Name"
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

      <Button type="submit" kind="primary">Create</Button>
    </form>
  )
}

CreateAppForm.propTypes    = propTypes
CreateAppForm.defaultProps = defaultProps

export default CreateAppForm
