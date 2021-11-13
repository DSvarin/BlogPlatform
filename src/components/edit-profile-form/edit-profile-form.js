/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { setUser } from '../../store/actions';

import BlogapiService from '../services/blogapi-service';

import 'antd/dist/antd.css';
import classes from './edit-profile-form.module.scss';

const EditProfileForm = ({ user, setUserInfo }) => {
  const blogapiService = new BlogapiService();

  const [redirect, setRedirect] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const { username, email, image } = user;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue('username', username);
    setValue('email', email);
    setValue('password', '');
    setValue('image', image);
  }, [user]);

  const onSubmit = (data) => {
    const { password, ...values } = data;
    const value = password ? data : { ...values };
    blogapiService.editProfile(value).then((response) => {
      if (response.user) {
        setUserInfo(response.user);
        window.localStorage.setItem('user', JSON.stringify(response.user));
        setRedirect(true);
      } else {
        if (response.match(/username/)) {
          setNameError('should be unique');
        }
        if (response.match(/email/)) {
          setEmailError('should be unique');
        }
      }
    });
  };

  if (!user.username) {
    return (
      <div style={{ marginTop: 46 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={classes.container}>
      {redirect ? <Redirect push to="/" /> : null}
      <div className={classes.header}>Edit Profile</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className={nameError ? classes.error : undefined}>
          Username {nameError ? `${nameError}` : ''}
          <input
            type="text"
            className={errors.username || nameError ? classes.red : undefined}
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Your username needs to be at least 3 characters.',
              },
              maxLength: {
                value: 20,
                message: 'Your username needs to be no more than 20 characters.',
              },
            })}
            onFocus={() => setNameError('')}
          />
          {errors.username && <p>{errors.username.message}</p>}
        </label>
        <label className={emailError ? classes.error : undefined}>
          Email address {emailError ? `${emailError}` : ''}
          <input
            type="email"
            className={errors.email || emailError ? classes.red : undefined}
            {...register('email', {
              required: 'Email is required',
            })}
            onFocus={() => setEmailError('')}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </label>
        <label>
          New password
          <input
            autoComplete="off"
            placeholder="New password"
            type="password"
            className={errors.password && classes.red}
            {...register('password', {
              minLength: {
                value: 6,
                message: 'Your password needs to be at least 6 characters.',
              },
              maxLength: {
                value: 40,
                message: 'Your password needs to be no more than 40 characters.',
              },
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </label>
        <label>
          Avatar image (url)
          <input placeholder="Avatar image" type="url" {...register('image')} />
        </label>
        <input type="submit" value="Save" />
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  setUserInfo: (data) => dispatch(setUser(data)),
});

EditProfileForm.propTypes = {
  user: PropTypes.object.isRequired,
  setUserInfo: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileForm);
