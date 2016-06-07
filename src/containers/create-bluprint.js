import React from 'react';
import {Button, Page} from 'zooid-ui';
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'

import {getMeshbluConfig} from '../services/auth-service'
import {OCTOBLU_URL} from 'config'

class CreateBluprint extends React.Component {
  create = () => {
    const meshblu = new MeshbluHttp(getMeshbluConfig())
    meshblu.register(this.deviceDefaults(), (error, device) => {
      if (error) throw error

      window.location = `${OCTOBLU_URL}/device/${device.uuid}`
    })
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
          <Button onClick={this.create} size="large" kind="primary">Create IoT App</Button>
        </Page>
      </main>
    )
  }
};

CreateBluprint.propTypes = {}

export default CreateBluprint;
