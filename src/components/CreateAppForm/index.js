import noop from 'lodash.noop'
import React, { PropTypes } from 'react'
import { Button, FormField, FormInput } from 'zooid-ui'
import BluprintConfigBuilder from 'zooid-ui-bluprint-config-builder'

const propTypes = {
  onCreate: PropTypes.func,
  flow: PropTypes.object,
  toolsSchema: PropTypes.object,
  onUpdate: PropTypes.func,
}

const defaultProps = {
  onCreate: noop,
  flow: null,
  toolsSchema: null,
}

const CreateAppForm = ({ onCreate, onUpdate, flow, toolsSchema }) => {
  return (
    <form onSubmit={onCreate}>
      <FormField label="IoT App Name" name="appName">
        <FormInput name="appName" placeholder="App Name" autofocus />
      </FormField>
      <BluprintConfigBuilder flow={flow} nodeSchemas={toolsSchema} onUpdate={onUpdate} />
      <Button type="submit" kind="primary">Create IoT App</Button>
    </form>
  )
}

CreateAppForm.propTypes    = propTypes
CreateAppForm.defaultProps = defaultProps

export default CreateAppForm
