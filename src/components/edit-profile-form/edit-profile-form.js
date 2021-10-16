import React from 'react';
import { useForm } from 'react-hook-form';

import classes from './edit-profile-form.module.scss';

const EditProfileForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <div className={classes.container}>
      <div className={classes.header}>Edit Profile</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Username
          <input
            placeholder="Username"
            type="text"
            className={errors.username && classes.red}
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
            className={errors.email && classes.red}
            {...register('email', {
              required: 'Email is required',
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </label>
        <label>
          New password
          <input
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
          <input placeholder="Avatar image" type="url" {...register('avatar')} />
        </label>
        <input type="submit" value="Save" />
      </form>
    </div>
  );
};

export default EditProfileForm;
