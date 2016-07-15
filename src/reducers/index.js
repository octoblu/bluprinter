import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import toast from './toast.reducer'
import bluprint from './bluprint.reducer'

const rootReducer = combineReducers({
  bluprint,
  toast,
  routing: routerReducer,
})

export default rootReducer
