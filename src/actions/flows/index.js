import * as actionTypes from '../../constants/action-types'
import { getMeshbluConfig } from '../../services/auth-service'
import MeshbluHttp from 'browser-meshblu-http'

function getFlowsRequest() {
  return {
    type: actionTypes.GET_FLOWS_REQUEST
  }
}

function getFlowsSuccess(flowDevice) {
  return {
    type: actionTypes.GET_FLOWS_SUCCESS,
    payload: flowDevice,
  }
}

function getFlowsFailure(error) {
  return {
    type: actionTypes.GET_FLOWS_FAILURE,
    payload: error,
  }
}

export function getFlows(meshbluConfig = getMeshbluConfig()) {
  return dispatch => {
    dispatch(getFlowsRequest())

    return new Promise((resolve, reject) => {
      const meshblu = new MeshbluHttp(meshbluConfig)
      const query = {owner: meshbluConfig.uuid, type: 'octoblu:flow'}
      const projection = {name: true, uuid: true, type: true}

      meshblu.search({query, projection}, (error, devices) => {
        if (error) {
          return reject(dispatch(getFlowsFailure(new Error('Error getting Flows'))))
        }
        return resolve(dispatch(getFlowsSuccess(devices)))
      })
    })
  }
}
