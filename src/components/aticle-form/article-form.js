/* eslint-disable react/forbid-prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Redirect, useParams, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

import 'antd/dist/antd.css';
import classes from './article-form.module.scss';
import BlogapiService from '../services/blogapi-service';

const ArticleForm = ({ articles }) => {
  const { slug } = useParams();
  const routeMatch = useRouteMatch('/new-article');
  const [redirect, setRedirect] = useState(false);
  const [slugValue, setSlug] = useState(slug);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tagList',
  });

  const blogapiService = new BlogapiService();

  useEffect(() => {
    if (!routeMatch && articles.length > 0) {
      const [articleProps] = articles.filter((article) => article.slug === slugValue);
      const { title, description, body, tagList } = articleProps;
      const tags = tagList.length === 0 ? [''] : tagList;

      setValue('title', title);
      setValue('description', description);
      setValue('body', body);
      setValue(
        'tagList',
        tags.map((tag) => ({ tag }))
      );
    }
  }, [articles]);

  useEffect(() => {
    if (routeMatch) {
      setValue('tagList', [{ tag: '' }]);
    }
  }, []);

  const onSubmit = (data) => {
    const { title, description, body } = data;
    let { tagList } = data;
    tagList = tagList.map((item) => item.tag).filter((item) => item !== '');
    const value =
      tagList.length > 0
        ? {
            ...data,
            tagList,
          }
        : {
            title,
            description,
            body,
            tagList: [],
          };
    if (routeMatch) {
      blogapiService.postArticle(value).then(() => {
        setRedirect(true);
      });
    } else if (!routeMatch) {
      blogapiService.updateArticle(value, slug).then((response) => {
        setSlug(response.article.slug);
        setRedirect(true);
      });
    }
  };

  return (
    <>
      {redirect ? <Redirect push to="/" /> : null}
      {!routeMatch && articles.length === 0 ? (
        <div style={{ marginTop: 36 }}>
          <Spin size="large" />
        </div>
      ) : (
        <div className={classes.container}>
          <div className={classes.header}>{routeMatch ? 'Create new article' : 'Edit article'}</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>
              Title
              <input
                placeholder="Title"
                type="text"
                className={errors.title && classes.red}
                {...register('title', {
                  required: 'Title is required',
                })}
              />
              {errors.title && <p>{errors.title.message}</p>}
            </label>
            <label>
              Short description
              <input
                placeholder="Short description"
                type="text"
                className={errors.description && classes.red}
                {...register('description', {
                  required: 'Short description is required',
                })}
              />
              {errors.description && <p>{errors.description.message}</p>}
            </label>
            <label>
              Text
              <textarea
                placeholder="Text"
                className={errors.body && classes.red}
                {...register('body', {
                  required: 'Text is required',
                })}
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
                  {index !== fields.length - 1 ? (
                    <button className={classes.delete} type="button" onClick={() => remove(index)}>
                      Delete
                    </button>
                  ) : null}
                </div>
              ))}
              <button className={classes.onlyAdd} type="button" onClick={() => append({})}>
                Add tag
              </button>
            </label>
            <input type="submit" value="Send" />
          </form>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  articles: state.articles,
});

ArticleForm.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps, null)(ArticleForm);
