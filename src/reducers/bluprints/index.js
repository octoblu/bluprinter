import _ from 'lodash'
import * as actionTypes from '../../constants/action-types'
import {BLUPRINTER_URL} from 'config'

const initialState = {
  devices: null,
  error: null,
  fetching: false,  
}

export default function types(state = initialState, action) {
  switch (action.type) {

    case actionTypes.GET_BLUPRINTS_REQUEST:
      return { ...state, fetching: true }

    case actionTypes.GET_BLUPRINTS_SUCCESS:
      return { ...state, devices: action.payload, fetching: false }

    case actionTypes.GET_BLUPRINTS_FAILURE:
      return { ...state, error: action.payload, fetching: false }

    default:
      return state
  }
}
