/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import PropType from 'prop-types';

import { setUser, setAuthentication } from '../../store/actions';

import classes from './header.module.scss';
import logo from './Rectangle.png';

const Header = ({ signedIn, user, setUserData, setSignedIn }) => {
  const myStorage = window.localStorage;
  const [redirect, setRedirect] = useState(false);

  return (
    <div className={classes.header}>
      {redirect ? <Redirect push to="/" /> : null}
      <Link to="/">
        <h6>Realworld Blog</h6>
      </Link>
      {signedIn ? (
        <div className={classes.signedBlock}>
          <Link to="/new-article">
            <button type="button" className={classes.createArticle}>
              Create article
            </button>
          </Link>
          <Link to="/profile">
            <button type="button" className={classes.profile}>
              <h6>{user.username}</h6>
              <img alt="Account Icon" src={user.image || logo} />
            </button>
          </Link>
          <button
            type="button"
            className={classes.logOut}
            onClick={() => {
              myStorage.clear();
              setUserData({});
              setSignedIn(false);
              setRedirect(true);
            }}
          >
            <Link to="/">
              <h6>Log Out</h6>
            </Link>
          </button>
        </div>
      ) : (
        <div>
          <button type="button" className={classes.singIn}>
            <Link to="/sign-in">
              <h6>Sign In</h6>
            </Link>
          </button>
          <button type="button" className={classes.singUp}>
            <Link to="/sign-up">
              <h6>Sign Up</h6>
            </Link>
          </button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  signedIn: state.authentication,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  setUserData: (data) => dispatch(setUser(data)),
  setSignedIn: (data) => dispatch(setAuthentication(data)),
});

Header.propTypes = {
  signedIn: PropType.bool.isRequired,
  setUserData: PropType.func.isRequired,
  setSignedIn: PropType.func.isRequired,
  user: PropType.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
