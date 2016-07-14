import _ from 'lodash'
import * as actionTypes from '../constants/action-types'
// import { BASE_DEVICE_PROPS } from '../constants/devices'

const initialState = {
  configSchema: null,
  description: '',
  flowId: null,
  manifest: null,
  messageSchema: null,
  name: '',
  sharedDevices: null,
  version: '1.0.0',
}

export default function types(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CREATE_BLUPRINT:
      return { ...state, name: 'John Doe', description: 'lorem...', flowId: '007' }

    default:
      return state
  }
}
