import * as actionTypes from '../../constants/action-types'
import { getMeshbluConfig } from '../../services/auth-service'
import MeshbluHttp from 'browser-meshblu-http'

function getBluprintsRequest() {
  return {
    type: actionTypes.GET_BLUPRINTS_REQUEST
  }
}

function getBluprintsSuccess(flowDevice) {
  return {
    type: actionTypes.GET_BLUPRINTS_SUCCESS,
    payload: flowDevice,
  }
}

function getBluprintsFailure(error) {
  return {
    type: actionTypes.GET_BLUPRINTS_FAILURE,
    payload: error,
  }
}

export function getBluprints(meshbluConfig = getMeshbluConfig()) {
  return dispatch => {
    dispatch(getBluprintsRequest())

    return new Promise((resolve, reject) => {
      const meshblu = new MeshbluHttp(meshbluConfig)
      const query = {owner: meshbluConfig.uuid, type: 'bluprint'}
      const projection = {name: true, uuid: true, description: true}
      meshblu.search({query, projection}, (error, devices) => {
        if (error) {
          return reject(dispatch(getBluprintsFailure(new Error('Error getting Bluprints'))))
        }
        return resolve(dispatch(getBluprintsSuccess(devices)))
      })
    })
  }
}
