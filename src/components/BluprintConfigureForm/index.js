import React, { PropTypes } from 'react'
import Form from 'react-jsonschema-form'

const propTypes = {
  schema: PropTypes.object
}

const defaultProps = {}

const BluprintConfigureForm = ({ schema }) => {
  if (!schema) return null
  return (<Form schema={schema} />)
}

BluprintConfigureForm.propTypes    = propTypes
BluprintConfigureForm.defaultProps = defaultProps

export default BluprintConfigureForm
