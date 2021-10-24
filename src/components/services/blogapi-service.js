/* eslint-disable no-underscore-dangle */

class BlogapiService {
  _apiBase = 'https://api.realworld.io/api/';

  getToken() {
    const myStorage = window.localStorage;
    if (myStorage.getItem('user')) {
      const { token } = JSON.parse(myStorage.getItem('user'));
      return token;
    }
    return '';
  }

  getUser() {
    const myStorage = window.localStorage;
    if (myStorage.getItem('user')) {
      const { username } = JSON.parse(myStorage.getItem('user'));
      return username;
    }
    return '';
  }

  async getResource(path, options) {
    const response = await fetch(`${this._apiBase}${path}`, options);
    const jsonresp = await response.json();
    return jsonresp;
  }

  async getArticles(offset) {
    const res = await this.getResource(`articles?offset=${offset}&author=${this.getUser()}`, {
      headers: {
        Authorization: `Token ${this.getToken()}`,
      },
    });
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

  async editProfile(value) {
    const res = await this.getResource(`user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Token ${this.getToken()}`,
      },
      body: JSON.stringify({ user: value }),
    });
    return res;
  }

  async postArticle(value) {
    const res = await this.getResource('articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Token ${this.getToken()}`,
      },
      body: JSON.stringify({ article: value }),
    });
    return res;
  }

  async getArticle(slug) {
    const res = await this.getResource(`articles/${slug}`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Token ${this.getToken()}`,
      },
    });
    return res;
  }

  async updateArticle(value, slug) {
    const res = await this.getResource(`articles/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Token ${this.getToken()}`,
      },
      body: JSON.stringify({ article: value }),
    });
    return res;
  }

  async deleteArticle(slug) {
    await fetch(`${this._apiBase}articles/${slug}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${this.getToken()}`,
      },
    });
  }

  async postFavoriteArticle(slug) {
    const res = await this.getResource(`articles/${slug}/favorite`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${this.getToken()}`,
      },
    });
    return res;
  }

  async deleteFavoriteArticle(slug) {
    const res = await this.getResource(`articles/${slug}/favorite`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${this.getToken()}`,
      },
    });
    return res;
  }
}

export default BlogapiService;
