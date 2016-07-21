import Promise from 'bluebird'
import { getMeshbluConfig } from '../services/auth-service'
import MeshbluHttp from 'browser-meshblu-http'
import FlowService from '../services/flow-service'

export const GET_SHARED_DEVICES         = 'GET_SHARED_DEVICES'
export const GET_SHARED_DEVICES_REQUEST = 'GET_SHARED_DEVICES_REQUEST'
export const GET_SHARED_DEVICES_FAILURE = 'GET_SHARED_DEVICES_FAILURE'
export const GET_SHARED_DEVICES_SUCCESS = 'GET_SHARED_DEVICES_SUCCESS'

export const UPDATE_SHARED_DEVICES_PERMISSIONS         = 'UPDATE_SHARED_DEVICES_PERMISSIONS'
export const UPDATE_SHARED_DEVICES_PERMISSIONS_REQUEST = 'UPDATE_SHARED_DEVICES_PERMISSIONS_REQUEST'
export const UPDATE_SHARED_DEVICES_PERMISSIONS_FAILURE = 'UPDATE_SHARED_DEVICES_PERMISSIONS_FAILURE'
export const UPDATE_SHARED_DEVICES_PERMISSIONS_SUCCESS = 'UPDATE_SHARED_DEVICES_SUCCESS'

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

function updateSharedDevicesPermissionsRequest() {
  return {
    type: UPDATE_SHARED_DEVICES_PERMISSIONS_REQUEST
  }
}

function updateSharedDevicesPermissionsSuccess() {
  return {
    type: UPDATE_SHARED_DEVICES_PERMISSIONS_SUCCESS
  }
}

function updateSharedDevicesPermissionsFailure(error) {
  return {
    type: UPDATE_SHARED_DEVICES_PERMISSIONS_FAILURE,
    payload: error,
  }
}

export function updateSharedDevicesPermissions(sharedDeviceUuids, meshbluConfig = getMeshbluConfig()) {
  return dispatch => {
    dispatch(updateSharedDevicesPermissionsRequest())

    return new Promise((resolve, reject) => {
      const flowService = new FlowService(meshbluConfig)

      flowService.addGlobalMessageReceivePermissions(sharedDeviceUuids, (error) => {
        if (error) {
          reject(dispatch(updateSharedDevicesPermissionsFailure(
            new Error('Could not set global message permissions on devices')
          )))
        }
        return resolve(dispatch(updateSharedDevicesPermissionsSuccess()))
      })
    })
  }
}
