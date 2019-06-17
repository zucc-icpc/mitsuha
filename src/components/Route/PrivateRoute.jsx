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
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true, 
      isAuthed: false  
    }
  }

  checkAuth = async () => {
    let isAuthed = false
    const { isLogin } = this.props
    this.setState(state => ({
      ...state,
      isLoading: true
    }))
    verifyUser()
      .then(data => {
        if (data.isLogin) {
          isAuthed = true
        }
        this.setState(state => ({
          ...state,
          isAuthed,
          isLoading: false,
        }))
      })
      .catch(error => {
        this.setState(state => ({
          ...state,
          isAuthed: false,
          isLoading: false,
        }))
        console.log(error)
      })
  }

  UNSAFE_componentWillMount = async () => {
    await this.checkAuth()
  }


  UNSAFE_componentWillReceiveProps = async (nextProps) => {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      await this.checkAuth()
    }
  }
  

  render() {
    const { component: Component, ...rest } = this.props
    const { isLoading, isAuthed } = this.state
    return (
      isLoading === true
        ? <Progress></Progress>
        : <Route
            {...rest}
            render={props =>
              isAuthed ? (
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