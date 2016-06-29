import React, { PropTypes } from 'react'
import {SchemaContainer} from 'zooid-meshblu-device-editor'

const propTypes = {
  schema: PropTypes.object,
  selectableDevices: PropTypes.array
}

const defaultProps = {
  selectableDevices: []
}

const BluprintConfigureForm = ({ schema, selectableDevices }) => {
  if (!schema) return null
  return (<SchemaContainer schema={schema} selectableDevices={selectableDevices} />)
}

BluprintConfigureForm.propTypes    = propTypes
BluprintConfigureForm.defaultProps = defaultProps

export default BluprintConfigureForm
