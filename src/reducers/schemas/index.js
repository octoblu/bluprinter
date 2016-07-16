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
      return { ...initialState, fetchingOperationSchemas: true }

    case actionTypes.GET_OPERATION_SCHEMAS_SUCCESS:
      return { ...initialState, operationSchemas: action.payload }

    case actionTypes.GET_OPERATION_SCHEMAS_FAILURE:
      return { ...initialState, error: action.payload }

    case actionTypes.GET_DEVICE_SCHEMAS_REQUEST:
      return { ...initialState, fetchingDeviceSchemas: true }

    case actionTypes.GET_DEVICE_SCHEMAS_SUCCESS:
      return { ...initialState, deviceSchemas: action.payload }

    case actionTypes.GET_DEVICE_SCHEMAS_FAILURE:
      return { ...initialState, error: action.payload }

    default:
      return state
  }
}
