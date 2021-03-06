/* eslint-disable react/forbid-prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import PropType from 'prop-types';

import { setUser, setAuthentication } from '../../store/actions';
import BlogapiService from '../services/blogapi-service';

import classes from './sign-in-form.module.scss';

const SignInForm = ({ setUserData, setSignedIn }) => {
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const blogapiService = new BlogapiService();

  const onSubmit = (data) => {
    blogapiService.signIn(data).then((response) => {
      if (response.errors) {
        setError(`Email or password ${response.errors['email or password']}`);
      } else {
        setUserData(response.user);
        setSignedIn(true);
        window.localStorage.setItem('user', JSON.stringify(response.user));
      }
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>Sign In</div>
      {error ? <div className={classes.error}>{error}</div> : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Email address
          <input
            placeholder="Email address"
            type="email"
            className={errors.email || (error && classes.red)}
            autoComplete="email-address"
            {...register('email', {
              required: 'Email is required',
            })}
            onFocus={() => setError('')}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </label>
        <label>
          Password
          <input
            placeholder="Password"
            type="password"
            className={errors.password || (error && classes.red)}
            autoComplete="current-password"
            {...register('password', {
              required: 'Password is required',
            })}
            onFocus={() => setError('')}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </label>
        <input type="submit" value="Login" />
      </form>
      <div className={classes.linkSingIn}>
        Don???t have an account? <Link to="/sign-up">Sign Up.</Link>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setUserData: (data) => dispatch(setUser(data)),
  setSignedIn: (data) => dispatch(setAuthentication(data)),
});

SignInForm.propTypes = {
  setUserData: PropType.func.isRequired,
  setSignedIn: PropType.func.isRequired,
};

export default connect(null, mapDispatchToProps)(SignInForm);
