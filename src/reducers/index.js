import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import toast from './toast.reducer'
import bluprint from './bluprint'
import bluprints from './bluprints'
import flow from './flow'
import flows from './flows'
import schemas from './schemas'
import breadcrumbs from '../modules/Breadcrumbs'
import sharedDevices from '../modules/SharedDevices'

const rootReducer = combineReducers({
  bluprint,
  bluprints,
  breadcrumbs,
  flow,
  flows,
  toast,
  schemas,
  sharedDevices,
  routing: routerReducer,
})

export default rootReducer
