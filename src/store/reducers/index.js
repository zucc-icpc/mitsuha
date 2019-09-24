import { combineReducers } from 'redux'
import user from './user'
import reports from './reports'
import honors from './honors'

export default combineReducers({
  user,
  reports,
  honors,
})