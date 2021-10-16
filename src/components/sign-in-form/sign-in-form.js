/* eslint-disable react/forbid-prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import PropType from 'prop-types';

import { setUser, setAuthentication } from '../../store/actions';
import BlogapiService from '../services/blogapi-service';

import classes from './sign-in-form.module.scss';

const SignInForm = ({ user, setUserData, setSignedIn }) => {
  useEffect(() => {
    setUserData({});
  }, []);

  const [error, setError] = useState('');
  const [emailValue, setEmailValue] = useState(user.email);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const blogapiService = new BlogapiService();
  const myStorage = window.localStorage;

  const onSubmit = (data) => {
    blogapiService.signIn(data).then((response) => {
      if (response.errors) {
        setError(response.errors.body[1]);
      }
      if (response.user) {
        setUserData(response.user);
        setSignedIn(true);
        myStorage.setItem('user', JSON.stringify(response.user));
      }
    });
  };
  const errorText = error ? <div className={classes.error}>{error}</div> : null;

  return (
    <div className={classes.container}>
      <div className={classes.header}>Sign In</div>
      {errorText}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Email address
          <input
            value={emailValue || ''}
            placeholder="Email address"
            type="email"
            className={errors.email && classes.red}
            {...register('email', {
              required: 'Email is required',
            })}
            onChange={(event) => setEmailValue(event.target.value)}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </label>
        <label>
          Password
          <input
            placeholder="Password"
            type="password"
            className={errors.password && classes.red}
            {...register('password', {
              required: 'Password is required',
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </label>
        <input type="submit" value="Login" />
      </form>
      <div className={classes.linkSingIn}>
        Don’t have an account? <Link to="/sign-up">Sign Up.</Link>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  setUserData: (data) => dispatch(setUser(data)),
  setSignedIn: (data) => dispatch(setAuthentication(data)),
});

SignInForm.propTypes = {
  user: PropType.object.isRequired,
  setUserData: PropType.func.isRequired,
  setSignedIn: PropType.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);
