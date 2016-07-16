import * as actionTypes from '../../constants/action-types'

const initialState = {
  operationSchemas: null,
}

export default function types(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_OPERATION_SCHEMAS_REQUEST:
      return { ...initialState, fetching: true }

    case actionTypes.GET_OPERATION_SCHEMAS_SUCCESS:
      return { ...initialState, operationSchemas: action.payload }

    case actionTypes.GET_OPERATION_SCHEMAS_FAILURE:
      return { ...initialState, error: action.payload }

    default:
      return state
  }
}
