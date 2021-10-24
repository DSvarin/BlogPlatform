/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from 'react';
import { Redirect, useParams, useLocation, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { Popconfirm, Spin } from 'antd';
import BlogapiService from '../services/blogapi-service';

import ArticlePreview from '../article-preview';

import 'antd/dist/antd.css';
import classes from './article-full.module.scss';

// eslint-disable-next-line no-unused-vars
const ArticleFull = ({ user, signedIn }) => {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const [redirect, setRedirect] = useState(false);
  const [article, setArticle] = useState({});

  const blogapiService = new BlogapiService();

  useEffect(() => {
    blogapiService.getArticle(slug).then((response) => {
      setArticle(response.article);
    });
  }, []);

  if (Object.keys(article).length === 0) {
    return (
      <div style={{ marginTop: 26 }}>
        <Spin size="large" />
      </div>
    );
  }

  const {
    body,
    author: { username },
  } = article;

  return (
    <div className={classes.container}>
      {redirect ? <Redirect push to="/" /> : null}
      <ArticlePreview {...article} />
      {signedIn && user.username === username ? (
        <div className={classes.buttons}>
          <Popconfirm
            placement="rightTop"
            title="Are you sure to delete this article?"
            onConfirm={() => {
              blogapiService.deleteArticle(slug);
              setRedirect(true);
            }}
            okText="Yes"
            cancelText="No"
          >
            <button className={classes.delete} type="button">
              Delete
            </button>
          </Popconfirm>
          <button className={classes.edit} type="button">
            <Link to={`${pathname}/edit`}> Edit </Link>
          </button>
        </div>
      ) : null}

      <div className={classes.text}>
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  signedIn: state.authentication,
});

ArticleFull.propTypes = {
  user: PropTypes.object.isRequired,
  signedIn: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, null)(ArticleFull);
