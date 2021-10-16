/* eslint-disable no-underscore-dangle */
class BlogapiService {
  _apiBase = 'https://conduit-api-realworld.herokuapp.com/api/';

  async getResource(path, options) {
    const response = await fetch(`${this._apiBase}${path}`, options);

    if (!response.ok) {
      if (response.status !== 422 && response.status !== 401) {
        throw new Error(`Could not fetch url, received ${response.status}`);
      }
    }

    const jsonresp = await response.json();
    return jsonresp;
  }

  async getArticles(offset) {
    const res = await this.getResource(`articles?offset=${offset}`);
    return res.articles;
  }

  async signUp(value) {
    const res = await this.getResource(`users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ user: value }),
    });
    return res;
  }

  async signIn(value) {
    const res = await this.getResource(`users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ user: value }),
    });
    return res;
  }

  async deleteArticle(slug) {
    this.getResource(`articles/${slug}`, {
      method: 'DELETE',
    });
  }
}

export default BlogapiService;
