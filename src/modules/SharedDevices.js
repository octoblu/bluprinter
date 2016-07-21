import Promise from 'bluebird'
import { getMeshbluConfig } from '../services/auth-service'
import MeshbluHttp from 'browser-meshblu-http'

export const GET_SHARED_DEVICES = 'GET_SHARED_DEVICES'
export const GET_SHARED_DEVICES_REQUEST = 'GET_SHARED_DEVICES_REQUEST'
export const GET_SHARED_DEVICES_FAILURE = 'GET_SHARED_DEVICES_FAILURE'
export const GET_SHARED_DEVICES_SUCCESS = 'GET_SHARED_DEVICES_SUCCESS'

const initialState = {
  devices: null,
  fetching: false,
  error: null,
}

export default function types(state = initialState, action) {
  switch (action.type) {
    case GET_SHARED_DEVICES_REQUEST:
      return { ...state, fetching: true }

    case GET_SHARED_DEVICES_FAILURE:
      return { ...state, fetching: false, error: action.payload }

    case GET_SHARED_DEVICES_SUCCESS:
      return { ...state, devices: action.payload, fetching: false }

    default:
      return state
  }
}

function getSharedDevicesRequest() {
  return {
    type: GET_SHARED_DEVICES_REQUEST
  }
}

function getSharedDevicesSuccess(devices) {
  return {
    type: GET_SHARED_DEVICES_SUCCESS,
    payload: devices,
  }
}

function getSharedDevicesFailure(error) {
  return {
    type: GET_SHARED_DEVICES_SUCCESS,
    payload: error,
  }
}

export function getSharedDevices(sharedDeviceUuids, meshbluConfig = getMeshbluConfig()) {
  return dispatch => {
    dispatch(getSharedDevicesRequest())
    return new Promise((resolve, reject) => {
      const searchQuery = {
        query: {
          uuid: {
            $in: sharedDeviceUuids
          },
        },
        projection: {
          name: true,
          uuid: true,
          type: true,
        }
      }
      const meshblu = new MeshbluHttp(meshbluConfig)
      meshblu.search(searchQuery, (error, devices) => {
        if (error) {
          console.log('Failed to search', error)
          return reject(
            dispatch(
              getSharedDevicesFailure(
                new Error('Could not get shared devices')
              )
            )
          )
        }
        return resolve(dispatch(getSharedDevicesSuccess(devices)))
      })
    })
  }
}
