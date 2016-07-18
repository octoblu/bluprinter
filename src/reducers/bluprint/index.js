import * as actionTypes from '../../constants/action-types'

const initialState = {
  configSchema: null,
  sharedDevices: null,
  creating: false,
  device: null,
  deviceSchemas: null,
  error: null,
  fetching: false,
  flowDevice: null,
  manifest: null,
  operationSchemas: null,
}

export default function types(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CREATE_BLUPRINT_REQUEST:
      return { ...state, creating: true }

    case actionTypes.CREATE_BLUPRINT_SUCCESS:
      return { ...state, device: action.payload, creating: false }

    case actionTypes.CREATE_BLUPRINT_FAILURE:
      return { ...state, error: action.payload, creating: false }

    case actionTypes.GET_BLUPRINT_REQUEST:
      return { ...state, fetching: true }

    case actionTypes.GET_BLUPRINT_SUCCESS:
      return { ...state, device: action.payload, fetching: false }

    case actionTypes.GET_BLUPRINT_FAILURE:
      return { ...state, error: action.payload, fetching: false }

    case actionTypes.SET_BLUPRINT_CONFIG_SCHEMA:
      return { ...state, configSchema: action.payload }

    case actionTypes.SET_BLUPRINT_SHARED_DEVICES:
      return { ...state, sharedDevices: action.payload }

    default:
      return state
  }
}
