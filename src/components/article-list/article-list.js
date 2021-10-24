/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
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

  useEffect(() => {
    blogapiService.getArticles((page - 1) * 20).then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, [signedIn, page]);

  return (
    <>
      {loading ? <Spin size="large" style={{ marginTop: 26 }} /> : null}
      {articles.length === 0 && !signedIn && !loading ? (
        <Alert style={{ marginTop: 26 }} message="Please sign in to your account" type="info" showIcon />
      ) : null}
      {articles.length === 0 && signedIn && !loading ? (
        <Alert style={{ marginTop: 26 }} message="Please create an article" type="info" showIcon />
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
          <Pagination current={page} size="small" total={articles.length} onChange={(nextPage) => setPage(nextPage)} />
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
