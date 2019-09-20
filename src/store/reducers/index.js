import { combineReducers } from 'redux'
import user from './user'
import reports from './reports'

export default combineReducers({
  user,
  reports,
})