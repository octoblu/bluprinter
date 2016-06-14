import React, { PropTypes } from 'react';
import { Page } from 'zooid-ui';
import MeshbluHttp from 'browser-meshblu-http/dist/meshblu-http.js';
import url from 'url';

import CreateAppForm from '../components/CreateAppForm';
import { getMeshbluConfig } from '../services/auth-service';
import { OCTOBLU_URL, TOOLS_SCHEMA_REGISTRY_URL } from 'config';
import superagent from 'superagent';
import _ from 'lodash';

class CreateBluprint extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      loading: false,
      errror: null,
      flowDevice: null,
      toolsSchema: null,
    };

    this.handleCreate = this.handleCreate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  setErrorState(error) {
    this.setState({
      error,
      loading: false,
      flowDevice: null,
      toolsSchema: null,
    });
  }

  componentWillMount() {
    const { uuid } = this.props.routeParams;
    const meshblu = new MeshbluHttp(getMeshbluConfig());
    meshblu.device(uuid, (error, flowDevice) => {
      if (error) {
        return this.setState({ error: error.message });
      }
      this.setState({
        flowDevice,
        loading: false,
      });
    });
    superagent
      .get(`${TOOLS_SCHEMA_REGISTRY_URL}`)
      .end((error, response) => {
        const { body } = response;
        if (error) return;
        this.setState({ toolsSchema: body, loading: false });
      });
  }

  handleUpdate(mappings) {
    this.configSchema = this.mappingToConfig({ mappings });
  }

  mappingToConfig({ mappings }) {
    const config = {
      type: 'object',
      properties: {},
    };

    _.each(mappings, function (mapping) {
      let property = config.properties[mapping.configureProperty];
      property = property || { type: mapping.type };
      property['x-node-map'] = property['x-node-map'] || [];
      property['x-node-map'].push({ id: mapping.nodeId, property: mapping.nodeProperty });
      config.properties[mapping.configureProperty] = property;
    });

    return config;
  }

  handleCreate(event) {
    event.preventDefault();
    this.setState({ loading: true });

    const { appName } = event.target;
    const { uuid } = this.props.routeParams;
    const meshblu = new MeshbluHttp(getMeshbluConfig());

    const flowDevice = this.deviceDefaults({ name: appName.value, flowId: uuid, configSchema: this.configSchema })

    meshblu.register(flowDevice, (error, device) => {
      if (error) {
        console.log('Error', error);
        this.setErrorState(error);
        return;
      }
      console.log('device', device);

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

  deviceDefaults({ flowId, name, configSchema }) {
    const USER_UUID = getMeshbluConfig().uuid;
    return {
      name,
      owner: USER_UUID,
      online: true,
      type: 'octoblu:bluprint',
      bluprint: {
        flowId,
        latest: '1-0-0',
        versions: {
          '1-0-0': {
            schemas: {
              configure: {
                bluprint: configSchema,
              },
            },
          },
        },
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
    const { error, loading, flowDevice, toolsSchema } = this.state;
    if (!flowDevice || !toolsSchema) return null;

    return (
      <main>
        <Page width="small">
          <CreateAppForm
            onCreate={this.handleCreate}
            loading={loading}
            error={error}
            flow={flowDevice.flow}
            toolsSchema={toolsSchema}
            onUpdate={this.handleUpdate}
          />
        </Page>
      </main>
    );
  }
}

export default CreateBluprint;
