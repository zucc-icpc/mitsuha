import React from "react";
import PropTypes from "prop-types";
import { Redirect, withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Timeline from "@material-ui/icons/Timeline";
import Code from "@material-ui/icons/Code";
import Group from "@material-ui/icons/Group";
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";
import Check from "@material-ui/icons/Check";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import InfoArea from "components/InfoArea/InfoArea.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";

import registerPageStyle from "assets/jss/material-dashboard-pro-react/views/registerPageStyle";

import { isNil } from "lodash";
import { registerAPI, loginAPI } from "../../utils/api";
import { logger } from "handlebars";
import { login } from "../../utils/business";

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: [],
      username: "",
      password: "",
      repeatedPassword: "",
      email: "",
      isRegisterSuccess: false,
    };
    this.handleToggle = this.handleToggle.bind(this);
  }
  handleToggle(value) {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  }

  handleOnChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  isEmptyString = (str) => {
    return isNil(str) || str.length === 0
  }

  validateForm = () => {
    const {username, email, password, repeatedPassword} = this.state
    if (this.isEmptyString(username) || 
        this.isEmptyString(email) || 
        this.isEmptyString(password) || 
        this.isEmptyString(repeatedPassword)) {
      return false;
    }
    if (password !== repeatedPassword) {
      return false;
    }
    return true;
  }

  handleSubmit = async () => {
    try {
      const {username, password, email} = this.state
      await registerAPI(username, password, email);
      await login(this.state.username, this.state.password)
      this.setState({
        isRegisterSuccess: true
      })
    } catch (err) {
      logger.log(err.msg)
    }
  }

  render() {
    const { classes } = this.props;
    const isRegisterSuccess = this.state.isRegisterSuccess;
    if (isRegisterSuccess) {
      this.props.history.replace("/admin/dashboard")
    }
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={10}>
            <Card className={classes.cardSignup}>
              <h2 className={classes.cardTitle}>Register</h2>
              <CardBody>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={5}>
                    <InfoArea
                      title="Marketing"
                      description="We've created the marketing campaign of the website. It was a very interesting collaboration."
                      icon={Timeline}
                      iconColor="rose"
                    />
                    {/* <InfoArea
                      title="Fully Coded in HTML5"
                      description="We've developed the website with HTML5 and CSS3. The client has access to the code using GitHub."
                      icon={Code}
                      iconColor="primary"
                    /> */}
                    <InfoArea
                      title="Built Audience"
                      description="There is also a Fully Customizable CMS Admin Dashboard for this product."
                      icon={Group}
                      iconColor="info"
                    />
                  </GridItem>
                  <GridItem xs={12} sm={8} md={5}>
                    {/* <div className={classes.center}>
                      <Button justIcon round color="twitter">
                        <i className="fab fa-twitter" />
                      </Button>
                      {` `}
                      <Button justIcon round color="dribbble">
                        <i className="fab fa-dribbble" />
                      </Button>
                      {` `}
                      <Button justIcon round color="facebook">
                        <i className="fab fa-facebook-f" />
                      </Button>
                      {` `}
                      <h4 className={classes.socialTitle}>or be classical</h4>
                    </div> */}
                    <form className={classes.form}>
                      <CustomInput
                        id="username"
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses
                        }}
                        inputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              className={classes.inputAdornment}
                            >
                              <Face className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                          ),
                          placeholder: "用户名...",
                          value: this.state.username,
                          onChange: this.handleOnChange,
                        }}
                      />
                      <CustomInput
                        id="email"
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses
                        }}
                        inputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              className={classes.inputAdornment}
                            >
                              <Email className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                          ),
                          placeholder: "邮箱...",
                          value: this.state.email,
                          onChange: this.handleOnChange,
                        }}
                      />
                      <CustomInput
                        id="password"
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses
                        }}
                        inputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              className={classes.inputAdornment}
                            >
                              <Icon className={classes.inputAdornmentIcon}>
                                lock_outline
                              </Icon>
                            </InputAdornment>
                          ),
                          placeholder: "密码...",
                          value: this.state.password,
                          onChange: this.handleOnChange,
                          type: "password",
                        }}
                      />
                      <CustomInput
                        id="repeatedPassword"
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses
                        }}
                        inputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              className={classes.inputAdornment}
                            >
                              <Icon className={classes.inputAdornmentIcon}>
                                lock_outline
                              </Icon>
                            </InputAdornment>
                          ),
                          placeholder: "重复密码...",
                          value: this.state.repeatedPassword,
                          onChange: this.handleOnChange,
                          type: "password",
                        }}
                      />
                      <FormControlLabel
                        classes={{
                          root: classes.checkboxLabelControl,
                          label: classes.checkboxLabel
                        }}
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => this.handleToggle(1)}
                            checkedIcon={
                              <Check className={classes.checkedIcon} />
                            }
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked,
                              root: classes.checkRoot
                            }}
                          />
                        }
                        label={
                          <span>
                            I agree to the{" "}
                            <a href="#pablo">terms and conditions</a>.
                          </span>
                        }
                      />
                      <div className={classes.center}>
                        <Button round color="primary" disabled={!this.validateForm()} onClick={this.handleSubmit}>
                          Get started
                        </Button>
                      </div>
                    </form>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

RegisterPage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(withStyles(registerPageStyle)(RegisterPage));