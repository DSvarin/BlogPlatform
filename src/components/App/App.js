/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Redirect, useLocation } from 'react-router-dom';
// import { Spin } from 'antd';
import BlogapiService from '../services/blogapi-service';

import { setArticleList, setAuthentication, setUser } from '../../store/actions';

import Header from '../header';
import ArticleList from '../article-list';
import 'antd/dist/antd.css';
import ArticleFull from '../article-full';
import SignInForm from '../sign-in-form';
import SignUpForm from '../sign-up-form';
import EditProfileForm from '../edit-profile-form';
import ArticleForm from '../aticle-form';

const App = ({ setSignedIn, setUserData, setArticles, user, authentication, page }) => {
  const myStorage = window.localStorage;
  const blogapiService = new BlogapiService();

  useEffect(() => {
    console.log('app');
    if (myStorage.getItem('user')) {
      setSignedIn(true);
      setUserData(JSON.parse(myStorage.getItem('user')));
    }
    blogapiService.getArticles((page - 1) * 20).then((data) => {
      setArticles(data);
    });
  }, []);

  return (
    <>
      <Router>
        <Header />
        <Route exact path={['/', '/articles']} component={ArticleList} />
        <Route exact path="/articles/:slug" component={ArticleFull} />
        <Route path="/sign-in">{authentication ? <Redirect to="/" /> : <SignInForm />}</Route>
        <Route path="/sign-up">{user.email ? <Redirect to="/sign-in" /> : <SignUpForm />}</Route>
        <Route path="/profile" component={EditProfileForm} />
        <Route path="/articles/:slug/edit" component={ArticleForm} />
        <Route path="/new-article" component={ArticleForm} />
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
  setSignedIn: (data) => dispatch(setAuthentication(data)),
  setUserData: (data) => dispatch(setUser(data)),
  setArticles: (data) => dispatch(setArticleList(data)),
});

App.propTypes = {
  setSignedIn: PropTypes.func.isRequired,
  setUserData: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.string).isRequired,
  authentication: PropTypes.bool.isRequired,
  setArticles: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
