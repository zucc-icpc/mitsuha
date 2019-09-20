const initState = {
    page: 0
}

const reports = (state = initState, action) => {
    switch (action.type) {
      case 'UPDATE_REPORTS_PAGE':
        return {
          ...state,
          ...action.payload,
        }
      case 'UPDATE_REPORTS':
        return {
          ...state,
          ...action.payload,
        }
      default:
        return state
    }
  }
  
  export default reports