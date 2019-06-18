/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { Component } from "react";
import {
  Route,
  Redirect,
} from "react-router-dom";
import { isNil, get } from "lodash"
import { connect } from 'react-redux'
import Progress from "../Progress/Progress";
import { verifyUser } from "../../utils/business";
import { withRouter } from "react-router-dom";


class PrivateRoute extends React.Component {

  componentDidMount = async() => {
    await verifyUser()
  }

  render() {
    const { component: Component, ...rest } = this.props
    const isLogin = this.props.isLogin
    return (
      <Route
        {...rest}
        render={props =>
          isLogin ? (
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
  
}

const mapStateToProps = state => ({
  isLogin: get(state, 'user.isLogin')
})

const mapDispatchToProps = dispatch => ({
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateRoute))