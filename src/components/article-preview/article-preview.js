import React from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import classes from './article-preview.module.scss';

import likeGrey from './like.svg';
import logo from './Rectangle.png';
// eslint-disable-next-line no-unused-vars
import { likeRed } from './like-red.svg';

const ArticlePreview = ({ title, author, description, createdAt, tagList }) => {
  const { username, image } = author;
  const date = format(new Date(createdAt), 'MMMM d, y');

  return (
    <>
      <header className={classes.header}>
        <div className={classes.searchInfo}>
          <h5 className={classes.title}>{title}</h5>
          <img src={likeGrey} alt="Like" className={classes.like} />
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
    </>
  );
};

ArticlePreview.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.objectOf(PropTypes.string).isRequired,
  description: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  tagList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ArticlePreview;
