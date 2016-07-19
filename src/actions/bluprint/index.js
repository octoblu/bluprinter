import MeshbluHttp from 'browser-meshblu-http'
import { push } from 'react-router-redux'

import * as actionTypes from '../../constants/action-types'
import { getMeshbluConfig } from '../../services/auth-service'


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
        dispatch(push(`/bluprints/${uuid}`))
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
