/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Spin } from 'antd';

import { setArticleList, setAuthentication, setUser } from '../../store/actions';

import BlogapiService from '../services/blogapi-service';

import Header from '../header';
import ArticleList from '../article-list';
import 'antd/dist/antd.css';
import ArticleFull from '../article-full';
import SignInForm from '../sign-in-form';
import SignUpForm from '../sign-up-form';
import EditProfileForm from '../edit-profile-form';
import ArticleForm from '../aticle-form';

const App = ({ setArticles, setSignedIn, setUserData, page, user, authentication }) => {
  const [loading, setLoading] = useState(true);

  const blogapiService = new BlogapiService();
  const myStorage = window.localStorage;

  useEffect(() => {
    if (myStorage.getItem('user')) {
      setSignedIn(true);
      setUserData(JSON.parse(myStorage.getItem('user')));
    }

    blogapiService.getArticles((page - 1) * 20).then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, [page]);

  return (
    <>
      <Router>
        <Header />
        <Route
          exact
          path={['/', '/articles']}
          component={() =>
            loading ? (
              <div style={{ marginTop: 26 }}>
                <Spin size="large" />
              </div>
            ) : (
              <ArticleList />
            )
          }
        />
        <Route exact path="/articles/:slug" component={ArticleFull} />
        <Route exact path="/sign-in">
          {authentication ? <Redirect to="/" /> : <SignInForm />}
        </Route>
        <Route exact path="/sign-up">
          {user.email ? <Redirect to="/sign-in" /> : <SignUpForm />}
        </Route>
        <Route exact path="/profile" component={EditProfileForm} />
        <Route exact path="/articles/:slug/edit" component={ArticleForm} />
        <Route exact path="/new-article" component={ArticleForm} />
      </Router>
    </>
  );
};

const mapStateToProps = (state) => ({
  page: state.page,
  user: state.user,
  authentication: state.authentication,
});

const mapDispatchToProps = (dispatch) => ({
  setArticles: (data) => dispatch(setArticleList(data)),
  setSignedIn: (data) => dispatch(setAuthentication(data)),
  setUserData: (data) => dispatch(setUser(data)),
});

App.propTypes = {
  setArticles: PropTypes.func.isRequired,
  setSignedIn: PropTypes.func.isRequired,
  setUserData: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  user: PropTypes.objectOf(PropTypes.string).isRequired,
  authentication: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
