import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouteMatch } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { nanoid } from 'nanoid';
import classes from './article-form.module.scss';

const ArticleForm = ({ articles }) => {
  const { slug } = useParams();
  const routeMatch = useRouteMatch('/new-article');

  let form;
  let header;

  if (routeMatch) {
    header = 'Create new article';
    form = <Form />;
  } else {
    header = 'Edit article';
    const [articleProps] = articles.filter((article) => article.slug === slug);
    form = <Form {...articleProps} />;
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>{header}</div>
      {form}
    </div>
  );
};

const mapStateToProps = (state) => ({
  articles: state.articles,
});

ArticleForm.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps, null)(ArticleForm);

const Form = ({ title, description, body, tagList }) => {
  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  const [titleValue, setTitle] = useState(title);
  const [descripValue, setDescrip] = useState(description);
  const [bodyValue, setBody] = useState(body);
  const [tags, setTags] = useState(tagList.map((item) => ({ [nanoid(3)]: item })));

  const Tags = () => {
    // const tagsArrOfObj = tagList.map((item) =>( {[nanoid(3)]: item}))

    // const [tags, setTags] = useState(tagsArrOfObj)
    console.log(tags);

    const tagItem = tags.map((tag, index) => {
      const key = Object.keys(tag)[0];
      console.log(tag, index, key);
      return (
        <div>
          <input
            value={tag[index]}
            className={classes.tag}
            placeholder="Tag"
            type="text"
            {...register(`tag ${key}`)}
            onChange={(event) =>
              setTags([...tags.slice(0, index), { [key]: event.target.value }, ...tags.slice(index + 1)])
            }
          />
          <button
            className={classes.delete}
            type="button"
            value={key}
            onClick={() => {
              console.log(key);
              unregister(`tag ${key}`);
              setTags([...tags.slice(0, index), ...tags.slice(index + 1)]);
            }}
          >
            {' '}
            Delete{' '}
          </button>
          <button className={classes.add} type="button" onClick={() => setTags([...tags, { [nanoid(3)]: '' }])}>
            {' '}
            Add tag{' '}
          </button>
        </div>
      );
    });

    // unregister(`tag ${event.target.value}`)

    return (
      <label>
        Tags
        {tagItem}
      </label>
    );
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Title
        <input
          value={titleValue}
          placeholder="Title"
          type="text"
          className={errors.title && classes.red}
          {...register('title', {
            required: 'Title is required',
          })}
          onChange={(event) => setTitle(event.target.value)}
        />
        {errors.title && <p>{errors.title.message}</p>}
      </label>
      <label>
        Short description
        <input
          value={descripValue}
          placeholder="Short description"
          type="text"
          className={errors.shortDescription && classes.red}
          {...register('shortDescription', {
            required: 'Short description is required',
          })}
          onChange={(event) => setDescrip(event.target.value)}
        />
        {errors.shortDescription && <p>{errors.shortDescription.message}</p>}
      </label>
      <label>
        Text
        <textarea
          value={bodyValue}
          placeholder="Text"
          className={errors.text && classes.red}
          {...register('text', {
            required: 'Text is required',
          })}
          onChange={(event) => setBody(event.target.value)}
        />
        {errors.text && <p>{errors.text.message}</p>}
      </label>
      <Tags />
      <input type="submit" value="Send" />
    </form>
  );
};

Form.defaultProps = {
  title: '',
  description: '',
  body: '',
  tagList: [''],
};

Form.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  body: PropTypes.string,
  tagList: PropTypes.arrayOf(PropTypes.string),
};
