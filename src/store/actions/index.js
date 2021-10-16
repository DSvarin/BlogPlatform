// Action Creators
export function setArticleList(articles) {
  return { type: 'SET_ARTICLE_LIST', articles };
}

export function setCurrentPage(page) {
  return { type: 'SET_CURRENT_PAGE', page };
}

export function setUser(user) {
  return { type: 'SET_USER', user };
}

export function setUserEmail(useremail) {
  return { type: 'SET_USER_EMAIL', useremail };
}

export function setAuthentication(bool) {
  return { type: 'SET_AUTHENTICATION', bool };
}
