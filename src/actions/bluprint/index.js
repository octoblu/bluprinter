import MeshbluHttp from 'browser-meshblu-http'
import { FLOW_DEPLOY_URL } from 'config'
import * as actionTypes from '../../constants/action-types'
import { getMeshbluConfig } from '../../services/auth-service'
import superagent from 'superagent'
import Promise from 'bluebird'

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

    console.log('{uuid, version, flowId}', {uuid, version, flowId})

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
  const { device, configureSchema, messageSchema, sharedDevices, octobluLinks } = bluprint

  return dispatch => {
    dispatch(updateBluprintRequest())
    const {uuid} = device
    const updateQuery = {
      $set: {
        'bluprint.sharedDevices': sharedDevices,
        'bluprint.schemas.configure': {
          default: configureSchema
        },
        'bluprint.schemas.message': {
          default: messageSchema
        },
        'bluprint.versions': [{
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
          version: device.bluprint.version}))
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
