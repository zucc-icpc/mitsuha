import React from "react";
import { Redirect, withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Radio from "@material-ui/core/Radio";
import Checkbox from "@material-ui/core/Checkbox";

// @material-ui/icons
import MailOutline from "@material-ui/icons/MailOutline";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Contacts from "@material-ui/icons/Contacts";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardText from "components/Card/CardText.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";

import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import { solutionCreateAPI } from "../../utils/api"

import Stackedit from 'stackedit-js';
import { isNil } from 'lodash';

class SolutionCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: [24, 22],
      selectedValue: null,
      selectedEnabled: "b",
      content: "",
      title: "",
      pid: "",
      oj: "",
      stackedit: new Stackedit(),
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeEnabled = this.handleChangeEnabled.bind(this);
  }
  handleChange(event) {
    this.setState({ selectedValue: event.target.value });
  }
  handleChangeEnabled(event) {
    this.setState({ selectedEnabled: event.target.value });
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

  handleOpenMarkdown = () => {
    this.state.stackedit.openFile({
      name: 'Filename', // with an optional filename
      content: {
        text: this.state.content // and the Markdown content.
      }
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
    const {title, oj, pid, content} = this.state
    if (this.isEmptyString(title) || 
        this.isEmptyString(oj) || 
        this.isEmptyString(pid) || 
        this.isEmptyString(content)) {
      return false;
    }
    return true;
  }

  handleFileChange = (file) => {
    this.setState({
      content: file.content.text
    })
  }

  handleSubmit = async () => {
    const { title, oj, pid, content } = this.state
    await solutionCreateAPI(title, oj, pid, content);
    this.props.history.push('/admin/solution/');
  }

  render() {
    const { classes } = this.props;
    this.state.stackedit.on('fileChange', (file) => this.handleFileChange(file));
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary" text>
              <CardText color="primary">
                <h4 className={classes.cardTitle}>新建题解</h4>
              </CardText>
            </CardHeader>
            <CardBody>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    id="title"
                    labelText="标题"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.title,
                      onChange: this.handleOnChange,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    id="oj"
                    labelText="OJ"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.oj,
                      onChange: this.handleOnChange,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    id="pid"
                    labelText="题目ID"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.pid,
                      onChange: this.handleOnChange,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="内容"
                    id="content"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 5,
                      value: this.state.content,
                      onChange: this.handleOnChange,
                    }}
                  />
                  <Button
                    color="info"
                    onClick={this.handleOpenMarkdown}
                  >
                    使用Markdown编辑器
                  </Button>
                </GridItem>
                <GridItem>
                  <Button
                    color="primary"
                    disabled={!this.validateForm()}
                    onClick={this.handleSubmit}
                  >
                    提交
                  </Button>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default withRouter(withStyles(regularFormsStyle)(SolutionCreate));
