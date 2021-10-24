const articles = (state = [], action) => {
  switch (action.type) {
    case 'SET_ARTICLE_LIST':
      return action.articles;
    default:
      return state;
  }
};

export default articles;
