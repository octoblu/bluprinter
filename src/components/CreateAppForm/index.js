import noop from 'lodash.noop';
import React, { PropTypes } from 'react';
import { Button, FormField, FormInput } from 'zooid-ui';

const propTypes = {
  onCreate: PropTypes.func,
};

const defaultProps = {
  onCreate: noop,
};

const CreateAppForm = ({ onCreate }) => {
  return (
    <form onSubmit={onCreate}>
      <FormField name="appName">
        <FormInput name="appName" placeholder="App Name" autofocus />
      </FormField>

      <Button type="submit" kind="primary">Create IoT App</Button>
    </form>
  );
};

CreateAppForm.propTypes    = propTypes;
CreateAppForm.defaultProps = defaultProps;

export default CreateAppForm;
