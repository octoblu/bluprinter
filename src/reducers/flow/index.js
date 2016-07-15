import * as actionTypes from '../../constants/action-types'

const initialState = {
  error: null,
  fetching: false,
  flowDevice: null,
}

export default function types(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_FLOW_REQUEST:
      return { ...initialState, fetching: true }

    case actionTypes.GET_FLOW_SUCCESS:
      return { ...initialState, flowDevice: action.payload }

    case actionTypes.GET_FLOW_FAILURE:
      return { ...initialState, error: action.payload }

    default:
      return state
  }
}
