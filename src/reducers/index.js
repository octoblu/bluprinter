import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import toast from './toast.reducer'
import bluprint from './bluprint'
import flow from './flow'
import schemas from './schemas'

const rootReducer = combineReducers({
  bluprint,
  flow,
  toast,
  schemas, 
  routing: routerReducer,
})

export default rootReducer
