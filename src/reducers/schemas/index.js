import * as actionTypes from '../../constants/action-types'

const initialState = {
  deviceSchemas: null,
  operationSchemas: null,
  fetchingOperationSchemas: false,
  fetchingDeviceSchemas: false,
}

export default function types(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_OPERATION_SCHEMAS_REQUEST:
      return {
        ...state,
        fetchingOperationSchemas: true,
      }

    case actionTypes.GET_OPERATION_SCHEMAS_SUCCESS:
      return {
        ...state,
        operationSchemas: action.payload,
        fetchingOperationSchemas: false,
      }

    case actionTypes.GET_OPERATION_SCHEMAS_FAILURE:
      return {
        ...state,
        error: action.payload,
        fetchingOperationSchemas: false,
      }

    case actionTypes.GET_DEVICE_SCHEMAS_REQUEST:
      return {
        ...state,
        fetchingDeviceSchemas: true,
      }

    case actionTypes.GET_DEVICE_SCHEMAS_SUCCESS:
      return {
        ...state,
        deviceSchemas: action.payload,
        fetchingDeviceSchemas: false,
      }

    case actionTypes.GET_DEVICE_SCHEMAS_FAILURE:
      return {
        ...state,
        error: action.payload,
        fetchingDeviceSchemas: false,
      }

    default:
      return state
  }
}
