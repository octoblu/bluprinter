import MeshbluHttp from 'browser-meshblu-http'
import { FLOW_DEPLOY_URL } from 'config'
import * as actionTypes from '../../constants/action-types'
import { getMeshbluConfig } from '../../services/auth-service'
import NodeService from '../../services/node-service'
import superagent from 'superagent'

function getBluprintRequest() {
  return {
    type: actionTypes.GET_BLUPRINT_REQUEST
  }
}

function getBluprintSuccess(device) {
  return {
    type: actionTypes.GET_BLUPRINT_SUCCESS,
    payload: device,
  }
}

function getBluprintFailure(error) {
  return {
    type: actionTypes.GET_BLUPRINT_FAILURE,
    payload: error,
  }
}
export function deployBluprintRequest() {
  return {
    type: actionTypes.DEPLOY_BLUPRINT_REQUEST,
  }
}
export function deployBluprintSuccess() {
  return {
    type: actionTypes.DEPLOY_BLUPRINT_SUCCESS
  }
}
export function deployBluprintFailure(error) {
  return {
    type: actionTypes.DEPLOY_BLUPRINT_FAILURE,
    payload: error,
  }
}

export function deployBluprint({uuid, version, flowId}, flowDeployUrl = FLOW_DEPLOY_URL, meshbluConfig = getMeshbluConfig()) {
  return dispatch => {
    dispatch(deployBluprintRequest())
    return new Promise((resolve, reject) => {
      superagent
        .post(`${FLOW_DEPLOY_URL}/bluprint/${uuid}/${version}`)
        .auth(meshbluConfig.uuid, meshbluConfig.token)
        .send({flowId})
        .end((error) => {
          if (error) {
            return reject(dispatch(deployBluprintFailure(new Error('Could not deploy Bluprint'))))
          }
          return resolve(dispatch(deployBluprintSuccess()))
        })
    })
  }
}

function setBluprintManifestRequest() {
  return {
    type: actionTypes.SET_BLUPRINT_MANIFEST_REQUEST
  }
}

function setBluprintManifestFailure(error) {
  return {
    type: actionTypes.SET_BLUPRINT_MANIFEST_FAILURE,
    payload: error,
  }
}

function setBluprintManifestSuccess(manifest) {
  return {
    type: actionTypes.SET_BLUPRINT_MANIFEST_SUCCESS,
    payload: manifest,
  }
}

export function setBluprintManifest(nodes, meshbluConfig = getMeshbluConfig()) {
  return dispatch => {

    dispatch(setBluprintManifestRequest())
    const nodeService = new NodeService(meshbluConfig)
    nodeService.createManifest(nodes)
    .then((manifest) => {
      return dispatch(setBluprintManifestSuccess(manifest))
    })
    .catch((error) => {
      console.log("SET_BLUPRINT_MANIFEST", error)
      return dispatch(setBluprintManifestFailure(new Error('Could not create manifest')))
    })

  }
}

export function setOctobluLinks(bluprintUuid) {
  return {
    type: actionTypes.SET_OCTOBLU_LINKS,
    payload: bluprintUuid,
  }
}

export function getBluprint(bluprintUuid, meshbluConfig = getMeshbluConfig()) {
  return dispatch => {
    dispatch(getBluprintRequest())

    return new Promise((resolve, reject) => {
      const meshblu = new MeshbluHttp(meshbluConfig)
      meshblu.device(bluprintUuid, (error, device) => {
        if (error) {
          return reject(dispatch(getBluprintFailure(new Error('Error getting Bluprint device'))))
        }

        dispatch(setOctobluLinks(bluprintUuid))
        return resolve(dispatch(getBluprintSuccess(device)))
      })
    })
  }
}

function updateBluprintRequest() {
  return {
    type: actionTypes.UPDATE_BLUPRINT_REQUEST
  }
}

function updateBluprintSuccess() {
  return {
    type: actionTypes.UPDATE_BLUPRINT_SUCCESS,
  }
}

function updateBluprintFailure(error) {
  return {
    type: actionTypes.UPDATE_BLUPRINT_FAILURE,
    payload: error,
  }
}

export function updateBluprint(bluprint, meshbluConfig = getMeshbluConfig()) {
  const { device, configureSchema, messageSchema, sharedDevices, octobluLinks, manifest } = bluprint

  return dispatch => {
    dispatch(updateBluprintRequest())
    const {uuid} = device
    const updateQuery = {
      $set: {
        version: 1,
        'bluprint.sharedDevices': sharedDevices,
        'bluprint.schemas.configure': {
          default: configureSchema
        },
        'bluprint.schemas.message': {
          default: messageSchema
        },
        'bluprint.versions': [{
          version: 1,
          manifest,
          sharedDevices,
          schemas: {
            configure: {
              default: configureSchema
            },
            message: {
              default: messageSchema
            }
          }
        }],
        octoblu: octobluLinks,
      }
    }

    return new Promise((resolve, reject) => {
      const meshblu = new MeshbluHttp(meshbluConfig)
      meshblu.updateDangerously(uuid, updateQuery, (error) => {
        if (error) {
          return reject(
            dispatch(
              updateBluprintFailure(new Error('Error updating Bluprint'))
            )
          )
        }
        dispatch(deployBluprint({
          uuid,
          flowId: device.bluprint.flowId,
          version: device.bluprint.latest}))
        return resolve(dispatch(updateBluprintSuccess()))
      })
    })
  }
}

export function setBluprintConfigSchema(bluprintConfigSchema) {
  return {
    type: actionTypes.SET_BLUPRINT_CONFIG_SCHEMA,
    payload: bluprintConfigSchema,
  }
}

export function setBluprintSharedDevices(sharedDevices) {
  return {
    type: actionTypes.SET_BLUPRINT_SHARED_DEVICES,
    payload: sharedDevices,
  }
}

function makeFlowDiscoverableRequest() {
  return {
    type: actionTypes.MAKE_FLOW_DISCOVERABLE_REQUEST,
  }
}

function makeFlowDiscoverableSuccess() {
  return {
    type: actionTypes.MAKE_FLOW_DISCOVERABLE_SUCCESS,
  }
}

function makeFlowDiscoverableFailure(error) {
  return {
    type: actionTypes.MAKE_FLOW_DISCOVERABLE_FAILURE,
    payload: error,
  }
}
export function makeFlowDiscoverable({flowUuid, bluprintUuid}, meshbluConfig = getMeshbluConfig()) {
  return dispatch => {
    dispatch(makeFlowDiscoverableRequest())
    return new Promise((resolve, reject) => {
      const meshblu = new MeshbluHttp(meshbluConfig)
      meshblu.updateDangerously(flowUuid, {
        $addToSet: {
          discoverWhitelist: bluprintUuid
        }
      },
      (error) => {
        if (error) {
          return reject(
            dispatch(
              makeFlowDiscoverableFailure(
                new Error('Could not update flow discover permissions')
              )
            )
          )
        }
        return resolve(dispatch(makeFlowDiscoverableSuccess()))
      })
    })
  }
}


function getVisibilityPermission({ visibility, userUuid }) {
  let uuid = userUuid
  if (visibility === 'public') uuid = '*'

  return { view: [{ uuid }] }
}

function deviceDefaults({ description, flowId, name, visibility, manifest }) {
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
      latest: 1,
      schemas: {
        version: '2.0.0',
        configure: {
          default: {},
        },
        message: {
          default: {},
        }
      },
      versions: [
        {
          manifest,
          version: 1,
          sharedDevices: {},
          schemas: {
            configure: {
              default: {},
            },
            message: {
              default: {},
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
  const {flowId} = deviceOptions
  return dispatch => {
    dispatch(createBluprintRequest())

    const meshbluConfig  = getMeshbluConfig()
    const meshblu        = new MeshbluHttp(meshbluConfig)
    const bluprintConfig = deviceDefaults(deviceOptions)

    meshblu.register(bluprintConfig, (error, device) => {
      if (error) {
        return dispatch(createBluprintFailure(new Error('Could not create Bluprint device')))
      }
      dispatch(makeFlowDiscoverable({flowUuid: flowId, bluprintUuid: device.uuid}))
      return dispatch(createBluprintSuccess(device))
    })
  }
}
