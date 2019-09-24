import React, { useState } from "react";
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
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import zhLocale from "date-fns/locale/zh-CN";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import { honorCreateAPI, honorDetailAPI, honorUpdateAPI } from "../../utils/api"

import Stackedit from 'stackedit-js';
import { isNil } from 'lodash';
import { connect } from 'react-redux';
import { get } from 'lodash';

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
  
    return [this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join('-');
};

class HonorEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: "",
      detailState: "success",
      intro: "",
      introState: "success",
      time: new Date().yyyymmdd(),
      type: "ICPC",
      selectedDate: new Date(),
      stackedit: new Stackedit(),
    };
    this.state.stackedit.on('fileChange', (file) => this.handleFileChange(file));
  }

  componentDidMount = async () => {
    const data = await honorDetailAPI(this.props.match.params.id);
    const year= parseInt(data["time"].substr(0, 4)) 
    const month = parseInt(data['time'].substr(5, 2)) - 1;
    const day = parseInt(data['time'].substr(8, 2));
    this.setState({
      detail: data["detail"],
      intro: data["intro"],
      type: data["type"],
      time: data["time"],
      selectedDate: new Date(year, month, day)
    })
  }

  handleOpenMarkdown = () => {
    this.state.stackedit.openFile({
      name: 'honor', // with an optional filename
      content: {
        text: this.state.detail // and the Markdown content.
      }
    });
    // window.open('https://stackedit.io/app#')
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
    const fields = ['detail', 'intro']
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
      detail: file.content.text,
      detailState: !isNil(file.content.text) && file.content.text.length > 0 ? 'success' : 'error'
    })
  }

  handleSubmit = async () => {
    if (this.isValidated()) {
      const { intro, detail, time, type } = this.state
      await honorUpdateAPI(this.props.match.params.id, { intro, detail, time, type });
      this.props.history.push('/honor/');
    }
  }


  handleDateChange = date => {
    const time = date.yyyymmdd();
    console.log('date', date)
    console.log('time', time)
    this.setState({
        selectedDate: date,
        time
    })
  };

  handleTypeChange = e => {
    console.log(e)
    console.log('type', e.target.value)
    this.setState({
        type: e.target.value
    })
  };

  render() {
    
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary" text>
              <CardText color="primary">
                <h4 className={classes.cardTitle}>更新故事</h4>
              </CardText>
            </CardHeader>
            <CardBody>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                    <InputLabel htmlFor="honor-type">故事时间</InputLabel>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={zhLocale}>
                        <DatePicker value={this.state.selectedDate} onChange={this.handleDateChange} />
                    </MuiPickersUtilsProvider>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="honor-type">类别</InputLabel>
                        <Select
                            value={this.state.type}
                            onChange={this.handleTypeChange}
                            inputProps={{
                                name: 'type',
                                id: 'honor-type',
                            }}
                        >
                            <MenuItem value='ICPC'>ICPC</MenuItem>
                            <MenuItem value='CCPC'>CCPC</MenuItem>
                            <MenuItem value='天梯赛'>天梯赛</MenuItem>
                            <MenuItem value='浙大赛'>浙大赛</MenuItem>
                            <MenuItem value='浙江省赛'>浙江省赛</MenuItem>
                            <MenuItem value='大事件'>大事件</MenuItem>
                            <MenuItem value='其他'>其他</MenuItem>
                        </Select>
                    </FormControl>
                </GridItem>
                
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    id="intro"
                    labelText={
                      <span>
                        简介 <small>(必填)</small>
                      </span>
                    }
                    success={this.state.introState === "success"}
                    error={this.state.introState === "error"}
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.intro,
                      onChange: event => this.change(event, "intro", "length", 1),
                    }}
                  />
                </GridItem>
                
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText={
                      <span>
                        详情 <small>(必填)</small>
                      </span>
                    }
                    id="detail"
                    success={this.state.detailState === "success"}
                    error={this.state.detailState === "error"}
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 10,
                      value: this.state.detail,
                      onChange: event => this.change(event, "detail", "length", 1),
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

const mapStateToProps = state => ({
  name: get(state, 'user.name'),
})

const mapDispatchToProps = dispatch => ({
})
  
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(regularFormsStyle)(HonorEdit)));
  
