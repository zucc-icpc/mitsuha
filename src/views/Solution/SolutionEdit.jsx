import React from "react";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardText from "components/Card/CardText.jsx";
import CardBody from "components/Card/CardBody.jsx";

import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import { solutionDetailAPI, solutionUpdateAPI } from "../../utils/api"

import Stackedit from 'stackedit-js';
import { isNil } from 'lodash';

class SolutionCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      contentState: "success",
      title: "",
      pid: "",
      oj: "",
      stackedit: new Stackedit(),
    };
  }

  componentDidMount = async () => {
    const data = await solutionDetailAPI(this.props.match.params.id);
    this.setState({
      content: data["content"],
      title: data["title"],
      pid: data["pid"],
      oj: data["oj"],
    })
  }

  handleOpenMarkdown = () => {
    this.state.stackedit.openFile({
      name: 'Filename', // with an optional filename
      content: {
        text: this.state.content // and the Markdown content.
      }
    });
  }

  verifyLength(value, length) {
    if (value.length >= length) {
      return true;
    }
    return false;
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
      default:
        break;
    }
    this.setState({ [stateName]: event.target.value });
  }
  isValidated() {
    const fields = ['content']
    let successCount = 0;
    fields.forEach(item => {
      const itemState = item + 'State'
      if (this.state[itemState] === 'success') {
        successCount ++;
      }
    })
    if (successCount === fields.length) {
      return true;
    } else {
      fields.forEach(item => {
        const itemState = item + 'State'
        if (this.state[itemState] !== 'success') {
          this.setState({ [itemState]: "error" });
        }
      })
    }
    return false;
  }
  

  handleFileChange = (file) => {
    this.setState({
      content: file.content.text,
      contentState: !isNil(file.content.text) && file.content.text.length > 0 ? 'success' : 'error'
    })
  }

  handleSubmit = async () => {
    if (this.isValidated()) {
      const { content } = this.state
      await solutionUpdateAPI(this.props.match.params.id, content);
      this.props.history.push(`/admin/solution/${this.props.match.params.id}`);
    }
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
                <h4 className={classes.cardTitle}>编辑题解</h4>
              </CardText>
            </CardHeader>
            <CardBody>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    id="title"
                    labelText={
                      <span>
                        标题 
                      </span>
                    }
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled: true,
                      value: this.state.title,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    id="oj"
                    labelText={
                      <span>
                        OJ 
                      </span>
                    }
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled: true,
                      value: this.state.oj,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    id="pid"
                    labelText={
                      <span>
                        题目ID
                      </span>
                    }
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled: true,
                      value: this.state.pid,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText={
                      <span>
                        内容 <small>(必填)</small>
                      </span>
                    }
                    id="content"
                    success={this.state.contentState === "success"}
                    error={this.state.contentState === "error"}
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 10,
                      value: this.state.content,
                      onChange: event => this.change(event, "content", "length", 1),
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
                    onClick={this.handleSubmit}
                  >
                    更新
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
