import React from 'react';
import {Button, Page} from 'zooid-ui';
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'

import {getMeshbluConfig} from '../services/auth-service'
import {OCTOBLU_CLIENT_URL} from 'config'

class ImportBluprint extends React.Component {

  importBluprint = () => {
    console.log('imported bluprint');
  }

  deviceDefaults = () => {
    const USER_UUID = getMeshbluConfig().uuid

    return {
      owner: USER_UUID,
      online: true,
      meshblu: {
        version: '2.0.0',
        whitelists: {
          configure: {
            update: [{uuid: USER_UUID}]
          },
          discover: {
            view: [{uuid: USER_UUID}]
          }
        }
      }
    }
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
