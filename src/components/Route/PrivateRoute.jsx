/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { Component } from "react";
import {
  Route,
  Redirect,
} from "react-router-dom";
import { isNil } from "lodash"

function isLogin() {
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')
  const id = localStorage.getItem('id')
  const name = localStorage.getItem('name')
  const isStaff = localStorage.getItem('isStaff')
  if (isNil(token) || isNil(username) || isNil(name) || isNil(id) || isNil(isStaff)) {
    return false
  }
  return true
}

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        isLogin() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/auth/login-page",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;