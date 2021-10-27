/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Pagination, Alert, Spin } from 'antd';

import BlogapiService from '../services/blogapi-service';

import 'antd/dist/antd.css';
import classes from './article-list.module.scss';
import { setCurrentPage, setArticleList } from '../../store/actions';
import ArticlePreview from '../article-preview';

const ArticleList = ({ articles, page, setPage, signedIn, setArticles }) => {
  const [loading, setLoading] = useState(true);
  const blogapiService = new BlogapiService();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    blogapiService.getArticles((page - 1) * 10).then((data) => {
      setArticles(data.articles);
      setTotal(data.articlesCount);
      setLoading(false);
    });
  }, [signedIn, page]);

  const signIn = <Link to="/sign-in">Sign In</Link>;
  const signUp = <Link to="/sign-up">Sign Up</Link>;

  const homeAlert = (
    <>
      Please <Link to="/sign-in">sign in</Link> to your accaunt or <Link to="/sign-up">create new.</Link>
    </>
  );
  const listAlert = (
    <>
      You don&apos;t have any published articles yet. Please <Link to="/new-article">create an article.</Link>
    </>
  );

  return (
    <>
      {loading ? <Spin size="large" style={{ marginTop: 26 }} /> : null}
      {articles.length === 0 && !signedIn && !loading ? (
        <Alert style={{ marginTop: 26, fontSize: 18 }} message={homeAlert} type="info" showIcon />
      ) : null}
      {articles.length === 0 && signedIn && !loading ? (
        <Alert style={{ marginTop: 26, fontSize: 18 }} message={listAlert} type="info" showIcon />
      ) : null}
      {articles.length !== 0 && !loading ? (
        <>
          <ul className={classes.list}>
            {articles.map((article) => {
              const { slug } = article;
              return (
                <li className={classes.container} key={slug}>
                  <ArticlePreview {...article} />
                </li>
              );
            })}
          </ul>
          <Pagination current={page} size="small" total={total} onChange={(nextPage) => setPage(nextPage)} />
        </>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  articles: state.articles,
  page: state.page,
  signedIn: state.authentication,
});

const mapDispatchToProps = (dispatch) => ({
  setPage: (data) => dispatch(setCurrentPage(data)),
  setArticles: (data) => dispatch(setArticleList(data)),
});

ArticleList.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  setArticles: PropTypes.func.isRequired,
  signedIn: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);
