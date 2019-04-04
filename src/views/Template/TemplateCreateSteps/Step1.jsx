import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

// core components
import CustomInput from "components/CustomInput/CustomInput.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import { isNil } from "lodash";

const style = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  ...customSelectStyle
};

class Step1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      titleState: "",
      intro: "",
      introState: "",
    };
  }

  sendState() {
    return this.state;
  }
  handleSimple = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  verifyLength(value, length) {
    if (value.length >= length) {
      return true;
    }
    return false;
  }
  isValidated() {

    // if (
    //   this.state.titleState === "success" &&
    //   (this.state.introState === "success" || this.state.introState === "")
    // ) {
    //   return true;
    // } else {
    //   if (this.state.titleState !== "success") {
    //     this.setState({ titleState: "error" });
    //   }
    //   if (this.state.introState !== "success") {
    //     this.setState({ introState: "" });
    //   }
    // }
    // return false;
    return true;
  }
  change(event, stateName, type, stateNameEqualTo) {
    switch (type) {
      case "length":
        if (this.verifyLength(event.target.value, stateNameEqualTo)) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
      case "option":
        if (!isNil(event.target.value) && event.target.value.length > 0) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "" });
        }
        break; 
      default:
        break;
    }
    this.setState({ [stateName]: event.target.value });
  }

  render() {
    const { classes } = this.props;
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12}>
          <h4 className={classes.infoText}>填写模版的基本信息</h4>
        </GridItem>
        <GridItem xs={12} sm={12}>
          <CustomInput
            labelText={
              <span>
                标题 <small>(必填)</small>
              </span>
            }
            id="title"
            success={this.state.titleState === "success"}
            error={this.state.titleState === "error"}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: event => this.change(event, "title", "length", 3),
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12}>
          <CustomInput
            labelText={
              <span>
                介绍 <small>(选填)</small>
              </span>
            }
            id="intro"
            success={this.state.introState === "success"}
            error={this.state.introState === "error"}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: event => this.change(event, "intro", "option"),
            }}
          />
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(style)(Step1);
