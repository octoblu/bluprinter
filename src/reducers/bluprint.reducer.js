import * as actionTypes from '../constants/action-types'

const initialState = {
  creating: false,
  device: null,
  deviceSchemas: null,
  error: null,
  flowDevice: null,
  manifest: null,
  operationSchemas: null,
}

export default function types(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CREATE_BLUPRINT_REQUEST:
      return { ...initialState, creating: true }

    case actionTypes.CREATE_BLUPRINT_SUCCESS:
      return { ...initialState, device: action.payload }

    case actionTypes.CREATE_BLUPRINT_FAILURE:
      return { ...initialState, error: action.payload }

    default:
      return state
  }
}
