/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import BlogapiService from '../services/blogapi-service';

import classes from './article-preview.module.scss';

import likeGrey from './like.svg';
import likeRed from './like-red.svg';
import logo from './Rectangle.png';

const ArticlePreview = ({ title, author, description, createdAt, tagList, favorited, favoritesCount, slug }) => {
  const [count, setCount] = useState(favoritesCount);
  const [isLiked, setLike] = useState(favorited);
  const [redirect, setRedirect] = useState(false);
  const [isMounting, setMounting] = useState(true);

  const { username, image } = author;
  const date = format(new Date(createdAt), 'MMMM d, y');
  const blogapiService = new BlogapiService();

  useEffect(() => {
    if (isMounting) {
      setMounting(false);
    } else if (!isMounting) {
      if (!isLiked) {
        blogapiService.deleteFavoriteArticle(slug).then((resp) => setCount(resp.article.favoritesCount));
      } else if (isLiked) {
        blogapiService.postFavoriteArticle(slug).then((resp) => setCount(resp.article.favoritesCount));
      }
    }
    return () => setCount(0);
  }, [isLiked]);

  return (
    <div className={classes.container} onClick={() => setRedirect(true)} role="presentation">
      {redirect ? <Redirect push to={`/articles/${slug}`} /> : null}
      <header className={classes.header}>
        <div className={classes.searchInfo}>
          <h5 className={classes.title}>{title}</h5>
          <div className={classes.like}>
            <img
              src={isLiked ? likeRed : likeGrey}
              alt="Like"
              onClick={(event) => {
                event.stopPropagation();
                setLike(!isLiked);
              }}
              role="presentation"
            />
            {count}
          </div>
          <ul className={classes.tagsList}>
            {tagList.length === 0 ? (
              <li className={classes.noTags}>No tags</li>
            ) : (
              tagList.map((tag) => (
                <li key={tag} className={classes.tag}>
                  {tag}
                </li>
              ))
            )}
          </ul>
        </div>
        <div className={classes.creationInfo}>
          <h6 className={classes.name}>{username}</h6>
          <span className={classes.date}>{date}</span>
          <img alt="Account Icon" src={image || logo} className={classes.img} />
        </div>
      </header>
      <div className={classes.description}>{description}</div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

ArticlePreview.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  tagList: PropTypes.arrayOf(PropTypes.string).isRequired,
  favoritesCount: PropTypes.number.isRequired,
  favorited: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, null)(ArticlePreview);
