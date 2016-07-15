import MeshbluHttp from 'browser-meshblu-http'

import * as actionTypes from '../constants/action-types'
import { getMeshbluConfig } from '../services/auth-service'


function getVisibilityPermission({ visibility, userUuid }) {
  let uuid = userUuid
  if (visibility === 'public') uuid = '*'

  return { view: [{ uuid }] }
}

function deviceDefaults({ description, flowId, name, version, visibility }) {
  const USER_UUID = getMeshbluConfig().uuid
  return {
    name,
    description,
    owner: USER_UUID,
    online: true,
    type: 'bluprint',
    logo: 'https://s3-us-west-2.amazonaws.com/octoblu-icons/device/bluprint.svg',
    schemas: {
      version: '2.0.0',
      configure: {
        default: {
          type: 'object',
          properties: {
            description: {
              type: 'string'
            },
          },
        },
      },
    },
    bluprint: {
      version: '1.0.0',
      flowId,
      latest: version,
      schemas: {
        version: '2.0.0',
        configure: {
          bluprint: {},
        },
        message: {
          bluprint: {},
        }
      },
      versions: [
        {
          manifest: {},
          version,
          sharedDevices: {},
          schemas: {
            configure: {
              bluprint: {},
            },
            message: {
              bluprint: {},
            }
          },
        },
      ],
    },
    meshblu: {
      version: '2.0.0',
      whitelists: {
        configure: {
          update: [{ uuid: USER_UUID }],
        },
        discover: getVisibilityPermission({ visibility, userUuid: USER_UUID}),
      },
    },
  }
}

function createBluprintRequest() {
  return {
    type: actionTypes.CREATE_BLUPRINT_REQUEST,
  }
}

function createBluprintSuccess(device) {
  return {
    type: actionTypes.CREATE_BLUPRINT_SUCCESS,
    payload: device,
  }
}

function createBluprintFailure(error) {
  return {
    type: actionTypes.CREATE_BLUPRINT_FAILURE,
    payload: error,
  }
}

export function createBluprint(deviceOptions) {
  return dispatch => {
    dispatch(createBluprintRequest())

    const meshbluConfig  = getMeshbluConfig()
    const meshblu        = new MeshbluHttp(meshbluConfig)
    const bluprintConfig = deviceDefaults(deviceOptions)

    meshblu.register(bluprintConfig, (error, device) => {
      if (error) {
        return dispatch(createBluprintFailure(new Error('Could not create Bluprint device')))
      }

      return dispatch(createBluprintSuccess(device))
    })
  }
}
