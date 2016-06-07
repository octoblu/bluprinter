import React from 'react';
import url from 'url';
import {Button, Page, FormField, FormInput} from 'zooid-ui';
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js'

import {getMeshbluConfig} from '../services/auth-service'
import {OCTOBLU_URL} from 'config'

class CreateBluprint extends React.Component {
  state = {}

  create = () => {
    const meshblu = new MeshbluHttp(getMeshbluConfig())
    meshblu.register(this.deviceDefaults(), (error, device) => {
      if (error) throw error

      const {uuid} = device
      const update = this.linksProperties({uuid})

      meshblu.update(uuid, update, (error) => {
        if (error) throw error

        window.location = `${OCTOBLU_URL}/device/${device.uuid}`
      })
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
      },
    }
  }

  linksProperties = ({uuid}) => {
    const {protocol, hostname, port} = window.location

    return {
      octoblu: {
        links: [{
          title: "Import Bluprint",
          url: url.format({protocol, hostname, port, pathname: `/bluprints/${uuid}/import`})
        }]
      }
    }
  }

  render = () => {
    return (
      <main>
        <Page>
          <FormField label="App Name" name="app-name">
            <FormInput name="app-name" value={this.state.name} />
          </FormField>
          <Button onClick={this.create} size="large" kind="primary">Create IoT App</Button>
        </Page>
      </main>
    )
  }
};

CreateBluprint.propTypes = {}

export default CreateBluprint;
