import React from 'react';
import {Button, Page, FormField, FormInput} from 'zooid-ui';
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'

import {getMeshbluConfig} from '../services/auth-service'
import {OCTOBLU_URL} from 'config'
import superagent from 'superagent'

class ImportBluprint extends React.Component {

  componentWillMount = () => {
    this.bluprintId = this.props.params.uuid
    this.meshblu = new MeshbluHttp(getMeshbluConfig())
    this.meshblu.device(this.bluprintId, (error, bluprint) => {
      this.setState({bluprint})
    })
  }

  importBluprint = () => {
    const {uuid, token} = getMeshbluConfig();
    superagent
      .post(`${OCTOBLU_URL}/api/flows`)
      .auth(uuid, token)
      .send({})
      .end((error, response) => window.location = `${OCTOBLU_URL}/design/115e0bef-2787-483e-a054-14d8acb50469`);
  }

  render = () => {
    return (
      <main>
        <Page>
          <Button onClick={this.importBluprint} size="large" kind="primary">Import IoT App</Button>
        </Page>
      </main>
    )
  }
};

ImportBluprint.propTypes = {}

export default ImportBluprint;
