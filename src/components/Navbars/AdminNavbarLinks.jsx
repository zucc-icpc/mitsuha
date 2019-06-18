import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
// import { Manager, Target, Popper } from "react-popper";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import Hidden from "@material-ui/core/Hidden";
import Popper from "@material-ui/core/Popper";

// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";

// core components
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import adminNavbarLinksStyle from "assets/jss/material-dashboard-pro-react/components/adminNavbarLinksStyle.jsx";
import { clearCookieAPI } from "../../utils/api";

import { withRouter } from "react-router-dom";
import { logout } from "../../utils/business";

class HeaderLinks extends React.Component {
  state = {
    open: false,
    isLogout: false,
  };
  handleClick = () => {
    this.setState({ open: !this.state.open });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  handleLogout = async () => {
    logout()
    this.props.history.push('/auth/login-page/');
  }
  
  render() {
    const { classes, rtlActive } = this.props;
    const { open, isLogout } = this.state;
    if (isLogout) {
      return (<Redirect from="/admin/dashboard" to="/auth/login-page" />)
    }
    const searchButton =
      classes.top +
      " " +
      classes.searchButton +
      " " +
      classNames({
        [classes.searchRTL]: rtlActive
      });
    const dropdownItem = classNames(
      classes.dropdownItem,
      classes.primaryHover,
      { [classes.dropdownItemRTL]: rtlActive }
    );
    const wrapper = classNames({
      [classes.wrapperRTL]: rtlActive
    });
    const managerClasses = classNames({
      [classes.managerClasses]: true
    });
    return (
      <div className={wrapper}>
       
        <Button
          // color="transparent"
          size="sm"
          aria-label="Person"
          // justIcon
          className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
          muiClasses={{
            label: rtlActive ? classes.labelRTL : ""
          }}
          onClick={this.handleLogout}
        >
          登出
        </Button>
      </div>
    );
  }
}

HeaderLinks.propTypes = {
  classes: PropTypes.object.isRequired,
  rtlActive: PropTypes.bool
};


export default withRouter(withStyles(adminNavbarLinksStyle)(HeaderLinks));
