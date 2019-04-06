const user = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return {
        ...state,
        ...action.payload,
      }
    case 'UPDATE_AVATAR':
      return {
        ...state,
        avatar: action.payload.avatar
      }
    default:
      return state
  }
}

export default user