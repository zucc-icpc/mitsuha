import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import asyncComponent from "./components/AsyncComponent/AsyncComponent";

// import AuthLayout from "layouts/Auth.jsx";
// import AdminLayout from "layouts/Admin.jsx";
const AsyncAuthLayout = asyncComponent(() => import("layouts/Auth.jsx"))
const AsyncAdminLayout = asyncComponent(() => import("layouts/Admin.jsx"))
import "assets/scss/material-dashboard-pro-react.scss?v=1.5.0";
import PrivateRoute from "./components/Route/PrivateRoute";
import history from './history'

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './store/reducers'


export const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route path="/auth" component={AsyncAuthLayout} />
        <PrivateRoute path="/admin" component={AsyncAdminLayout} />
        <Redirect from="/" to="/admin/solution/" />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);
