const page = (state = 1, action) => {
  switch (action.type) {
    case 'SET_CURRENT_PAGE':
      return action.page;
    default:
      return state;
  }
};

export default page;
