import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import toast from './toast.reducer'
import bluprint from './bluprint'
import flow from './flow'

const rootReducer = combineReducers({
  bluprint,
  flow,
  toast,
  routing: routerReducer,
})

export default rootReducer
