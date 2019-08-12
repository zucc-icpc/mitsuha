import React from "react";
import PropTypes from "prop-types";
import { Redirect, withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Lock from "@material-ui/icons/Lock";
// import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import loginPageStyle from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";

import { login } from "../../utils/business";
import { connect } from 'react-redux'
import { isNil, get } from "lodash"

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      username: "",
      password: "",
    };
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }

  
  handleOnChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = async () => {
    try {
      await login(this.state.username, this.state.password)
      this.setState({
        isLogin: 'true'
      })
    } catch(err) {
      console.log(err.message)
    }
  }
  render() {
    const { classes, isLogin } = this.props;
    if (isLogin === true) {
      this.props.history.push("/")
    }
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={6} md={4}>
            <form>
              <Card login className={classes[this.state.cardAnimaton]}>
                <CardHeader
                  className={`${classes.cardHeader} ${classes.textCenter}`}
                  color="rose"
                >
                  <h4 className={classes.cardTitle}>登录</h4>
                  <div className={classes.socialLine}>
                    {/* {[
                      "fab fa-facebook-square",
                      "fab fa-twitter",
                      "fab fa-google-plus"
                    ].map((prop, key) => {
                      return (
                        <Button
                          color="transparent"
                          justIcon
                          key={key}
                          className={classes.customButtonClass}
                        >
                          <i className={prop} />
                        </Button>
                      );
                    })} */}
                  </div>
                </CardHeader>
                <CardBody>
                  <CustomInput
                    labelText="用户名.."
                    id="username"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Face className={classes.inputAdornmentIcon} />
                        </InputAdornment>
                      ),
                      value: this.state.username,
                      onChange: this.handleOnChange,
                    }}
                  />
                  {/* <CustomInput
                    labelText="Email..."
                    id="email"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Email className={classes.inputAdornmentIcon} />
                        </InputAdornment>
                      )
                    }}
                  /> */}
                  <CustomInput
                    labelText="密码.."
                    id="password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Lock className={classes.inputAdornmentIcon} />
                        </InputAdornment>
                      ),
                      value: this.state.password,
                      onChange: this.handleOnChange,
                      type: "password",
                    }}
                  />
                </CardBody>
                <CardFooter className={classes.justifyContentCenter}>
                  <Button 
                    color="rose"
                    simple size="lg"
                    block
                    onClick={this.handleSubmit}
                  >
                    {`Let's Go`}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  // enqueueSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isLogin: get(state, 'user.isLogin')
})

const mapDispatchToProps = dispatch => ({
})

const componentWithStyle = withStyles(loginPageStyle)(LoginPage)
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(componentWithStyle));