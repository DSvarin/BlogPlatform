import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import { Pagination } from 'antd';
import { Link } from 'react-router-dom';

import 'antd/dist/antd.css';
import classes from './article-list.module.scss';
import { setCurrentPage } from '../../store/actions';
import ArticlePreview from '../article-preview';

const ArticleList = ({ articles, page, setPage }) => {
  console.log('gf');

  return (
    <>
      <ul className={classes.list}>
        {articles.map((article) => {
          const { slug } = article;
          return (
            <li className={classes.container} key={slug}>
              <Link to={`/articles/${slug}`}>
                <ArticlePreview {...article} />
              </Link>
            </li>
          );
        })}
      </ul>
      <Pagination current={page} size="small" total={50} onChange={(nextPage) => setPage(nextPage)} />
    </>
  );
};

const mapStateToProps = (state) => ({
  articles: state.articles,
  page: state.page,
});

const mapDispatchToProps = (dispatch) => ({
  setPage: (data) => dispatch(setCurrentPage(data)),
});

ArticleList.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);
