/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { Popconfirm, Spin } from 'antd';
import { useParams } from 'react-router';
import { connect } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import BlogapiService from '../services/blogapi-service';

import ArticlePreview from '../article-preview';

import 'antd/dist/antd.css';
import classes from './article-full.module.scss';

const ArticleFull = ({ articles, user, signedIn }) => {
  const { slug } = useParams();
  const history = useHistory();
  const { pathname } = useLocation();

  const blogapiService = new BlogapiService();

  if (articles.length === 0) {
    return (
      <div style={{ marginTop: 26 }}>
        <Spin size="large" />
      </div>
    );
  }

  const [articleProps] = articles.filter((article) => article.slug === slug);
  const { body, username } = articleProps;

  return (
    <div className={classes.container}>
      <ArticlePreview {...articleProps} />
      {signedIn && user.username === username ? (
        <div className={classes.buttons}>
          <Popconfirm
            placement="rightTop"
            title="Are you sure to delete this article?"
            onConfirm={() => {
              blogapiService.deleteArticle(slug);
            }}
            okText="Yes"
            cancelText="No"
          >
            <button className={classes.delete} type="button">
              {' '}
              Delete{' '}
            </button>
          </Popconfirm>
          <button className={classes.edit} type="button" onClick={() => history.push(`${pathname}/edit`)}>
            Edit
          </button>
        </div>
      ) : null}

      <div className={classes.text}>{body} </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  articles: state.articles,
  user: state.user,
  signedIn: state.authentication,
});

ArticleFull.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.object.isRequired,
  signedIn: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, null)(ArticleFull);
