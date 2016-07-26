import * as actionTypes from '../../constants/action-types'

const initialState = {
  devices: null,
  error: null,
  selected: null,
  fetching: false,
}

export default function types(state = initialState, action) {
  switch (action.type) {

    case actionTypes.GET_FLOWS_REQUEST:
      return { ...state, fetching: true }

    case actionTypes.GET_FLOWS_SUCCESS:
      return { ...state, devices: action.payload, fetching: false }

    case actionTypes.GET_FLOWS_FAILURE:
      return { ...state, error: action.payload, fetching: false }

    default:
      return state
  }
}
