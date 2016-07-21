import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import toast from './toast.reducer'
import bluprint from './bluprint'
import flow from './flow'
import schemas from './schemas'
import sharedDevices from '../modules/SharedDevices'

const rootReducer = combineReducers({
  bluprint,
  flow,
  toast,
  schemas,
  sharedDevices,
  routing: routerReducer,
})

export default rootReducer
