import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import toast from './toast.reducer'

const rootReducer = combineReducers({
  toast,
  routing: routerReducer,
})

export default rootReducer
