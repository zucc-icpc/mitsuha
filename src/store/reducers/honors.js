const honors = (state = {}, action) => {
    switch (action.type) {
      case 'UPDATE_HONORS':
        return {
          ...state,
          results: action.payload,
        }
      default:
        return state
    }
  }
  
  export default honors