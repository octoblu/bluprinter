import React from 'react';
import { Page } from 'zooid-ui';
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js';
import url from 'url';

import CreateAppForm from '../components/CreateAppForm';
import { getMeshbluConfig } from '../services/auth-service';
import { OCTOBLU_URL } from 'config';

class CreateBluprint extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      loading: false,
      errror: null,
    };

    this.handleCreate = this.handleCreate.bind(this);
  }

  setErrorState(error) {
    this.setState({
      error,
      loading: false,
    });
  }

  handleCreate(event) {
    event.preventDefault();
    this.setState({ loading: true });

    const { appName } = event.target;

    const meshblu = new MeshbluHttp(getMeshbluConfig());

    meshblu.register(this.deviceDefaults({ name: appName.value }), (error, device) => {
      if (error) {
        this.setErrorState(error);
        return;
      }

      const { uuid } = device;
      const update = this.linksProperties({ uuid });

      meshblu.update(uuid, update, (updateError) => {
        if (updateError) {
          this.setErrorState(updateError);
          return;
        }

        window.location = `${OCTOBLU_URL}/device/${device.uuid}`;
      });
    });
  }

  deviceDefaults({ name }) {
    const USER_UUID = getMeshbluConfig().uuid;
    return {
      name,
      owner: USER_UUID,
      online: true,
      type: 'octoblu:bluprint',
      bluprint: {
        version: '1.0.0',
      },
      meshblu: {
        version: '2.0.0',
        whitelists: {
          configure: {
            update: [{ uuid: USER_UUID }],
          },
          discover: {
            view: [{ uuid: USER_UUID }],
          },
        },
      },
    };
  }

  linksProperties({ uuid }) {
    const { protocol, hostname, port } = window.location;

    return {
      octoblu: {
        links: [{
          title: 'Import Bluprint',
          url: url.format({ protocol, hostname, port, pathname: `/bluprints/${uuid}/import` }),
        }],
      },
    };
  }

  render() {
    const { error, loading } = this.state;

    return (
      <main>
        <Page width="small">
          <CreateAppForm
            onCreate={this.handleCreate}
            loading={loading}
            error={error}
          />
        </Page>
      </main>
    );
  }
}

export default CreateBluprint;
