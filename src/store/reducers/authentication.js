const authentication = (state = false, action) => {
  switch (action.type) {
    case 'SET_AUTHENTICATION':
      return action.bool;
    default:
      return state;
  }
};

export default authentication;
