/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useParams, useRouteMatch } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import { nanoid } from 'nanoid';
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
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tagList',
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  useEffect(() => {
    if (tagList.length === 0) {
      append({ tag: '' });
    } else {
      tagList.forEach((tag) => append({ tag }));
    }
  }, []);

  const [titleValue, setTitle] = useState(title);
  const [descripValue, setDescrip] = useState(description);
  const [bodyValue, setBody] = useState(body);

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
          className={errors.description && classes.red}
          {...register('description', {
            required: 'Short description is required',
          })}
          onChange={(event) => setDescrip(event.target.value)}
        />
        {errors.description && <p>{errors.description.message}</p>}
      </label>
      <label>
        Text
        <textarea
          value={bodyValue}
          placeholder="Text"
          className={errors.body && classes.red}
          {...register('body', {
            required: 'Text is required',
          })}
          onChange={(event) => setBody(event.target.value)}
        />
        {errors.body && <p>{errors.body.message}</p>}
      </label>
      <label>
        Tags
        {fields.map((item, index) => (
          <div className={classes.tags} key={item.id}>
            <input
              {...register(`tagList[${index}].tag`)}
              defaultValue={item.tag}
              className={classes.tag}
              placeholder="Tag"
              type="text"
            />
            {fields.length !== 1 ? (
              <button className={classes.delete} type="button" onClick={() => remove(index)}>
                Delete
              </button>
            ) : null}
          </div>
        ))}
        <button
          className={fields.length !== 1 ? classes.add : classes.onlyAdd}
          type="button"
          onClick={() => append({})}
        >
          Add tag
        </button>
      </label>
      <input type="submit" value="Send" />
    </form>
  );
};

Form.defaultProps = {
  title: '',
  description: '',
  body: '',
  tagList: [],
};

Form.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  body: PropTypes.string,
  tagList: PropTypes.arrayOf(PropTypes.string),
};
