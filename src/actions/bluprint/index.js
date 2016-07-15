import MeshbluHttp from 'browser-meshblu-http'
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

export function getBluprint(bluprintUuid, meshbluConfig = getMeshbluConfig()) {
  return dispatch => {
    dispatch(getBluprintRequest())

    return new Promise((resolve, reject) => {
      const meshblu = new MeshbluHttp(meshbluConfig)
      meshblu.device(bluprintUuid, (error, device) => {
        if (error) {
          return reject(dispatch(getBluprintFailure(new Error('Error getting Bluprint device'))))
        }

        return resolve(dispatch(getBluprintSuccess(device)))
      })
    })
  }
}
