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
import Lock from "@material-ui/icons/Lock";
import AccountBox from "@material-ui/icons/AccountBox";

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
      name: "",
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
    const {username, email, password, repeatedPassword, name} = this.state
    if (this.isEmptyString(username) || 
        this.isEmptyString(email) || 
        this.isEmptyString(password) || 
        this.isEmptyString(repeatedPassword) ||
        this.isEmptyString(name)) {
      return false;
    }
    if (password !== repeatedPassword) {
      return false;
    }
    return true;
  }

  handleSubmit = async () => {
    try {
      const {username, password, email, name} = this.state
      await registerAPI(username, password, email, name);
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
              <h2 className={classes.cardTitle}>注册</h2>
              <CardBody>
                <GridContainer justify="center">
                 
                  <GridItem xs={12} sm={8} md={5}>
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
                              <AccountBox className={classes.inputAdornmentIcon} />
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
                               <Lock className={classes.inputAdornmentIcon} />
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
                              <Lock className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                          ),
                          placeholder: "重复密码...",
                          value: this.state.repeatedPassword,
                          onChange: this.handleOnChange,
                          type: "password",
                        }}
                      />
                      <CustomInput
                        id="name"
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
                          placeholder: "真实姓名",
                          value: this.state.name,
                          onChange: this.handleOnChange,
                        }}
                      />
                    </form>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={5}>
                    <InfoArea
                      title="提升"
                      description="分享你的题解、模版，同时提升你的编程水平"
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
                      title="社区"
                      description="在这里，你将认识更多志同道合优秀的编程爱好者"
                      icon={Group}
                      iconColor="info"
                    />
                    <div className={classes.button}>
                        <Button round color="primary" disabled={!this.validateForm()} onClick={this.handleSubmit}>
                          Get started
                        </Button>
                    </div>
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