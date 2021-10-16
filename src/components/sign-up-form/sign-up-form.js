import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import PropType from 'prop-types';
import BlogapiService from '../services/blogapi-service';

import { setUser } from '../../store/actions';

import classes from './sign-up-form.module.scss';

const SignUpForm = ({ setUserData }) => {
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const blogapiService = new BlogapiService();

  const onSubmit = (data) => {
    const { username, email, password } = data;
    const request = { username, email, password };
    blogapiService.signUp(request).then((response) => {
      if (response.errors) {
        setError(response.errors.body[1]);
      }
      if (response.user) {
        setUserData(response.user);
      }
    });
  };

  const errorText = error ? <div className={classes.error}>{error}</div> : null;

  const password = watch('password');

  return (
    <div className={classes.container}>
      <div className={classes.header}>Create new account</div>
      {errorText}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Username
          <input
            placeholder="Username"
            type="text"
            className={errors.username || error ? classes.red : undefined}
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
          />
          {errors.username && <p>{errors.username.message}</p>}
        </label>
        <label>
          Email address
          <input
            placeholder="Email address"
            type="email"
            className={errors.email || error ? classes.red : undefined}
            {...register('email', {
              required: 'Email is required',
            })}
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
          Repeat Password
          <input
            placeholder="Password"
            type="password"
            className={errors.repeatPassword && classes.red}
            {...register('repeatPassword', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Your password needs to be at least 6 characters.',
              },
              maxLength: {
                value: 40,
                message: 'Your password needs to be no more than 40 characters.',
              },
              validate: (value) => value === password,
            })}
          />
          {errors.repeatPassword?.type === 'validate' && <p>Passwords must match</p>}
          {errors.repeatPassword && <p>{errors.repeatPassword.message}</p>}
        </label>
        <label className={classes.agreement}>
          <input
            type="checkbox"
            className={errors.agreement && classes.red}
            checked
            {...register('agreement', { required: 'This agreement is required' })}
          />
          I agree to the processing of my personal information
          {errors.agreement && <p>{errors.agreement.message}</p>}
        </label>
        <input type="submit" value="Create" />
      </form>
      <div className={classes.linkSingIn}>
        Already have an account? <Link to="/sign-in">Sign In.</Link>
      </div>
    </div>
  );
};

SignUpForm.propTypes = {
  setUserData: PropType.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  setUserData: (data) => dispatch(setUser(data)),
});

export default connect(null, mapDispatchToProps)(SignUpForm);
