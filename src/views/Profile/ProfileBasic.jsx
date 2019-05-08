import React from "react";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import RecordVoiceOver from "@material-ui/icons/RecordVoiceOver";
import Email from "@material-ui/icons/Email";
import AssignmentInd from "@material-ui/icons/AssignmentInd";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import PictureUpload from "components/CustomUpload/PictureUpload.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
// import defaultImage from "assets/img/default-avatar.png";
import defaultImage from "assets/img/placeholder.jpg";
import { updateProfileAPI, profileAPI } from "../../utils/api";
import { isNil, get } from 'lodash';
import AvatarEditor from 'react-avatar-editor'
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'

import Stackedit from 'stackedit-js';

const style = theme => ({
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  inputAdornment: {
    position: "relative"
  },
  textAlignCenter: {
    textAlign: "center"
  },
});

class ProfileBasic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      name: "",
      type: "",
      sid: "",
      biography: "",
      level: "",
      nameState: "",
      sidState: "",
      biographyState: "",
      levelState: "",
      stackedit: new Stackedit(),
    };
  }

  handleOpenMarkdown = () => {
    this.state.stackedit.openFile({
      name: 'Filename', // with an optional filename
      content: {
        text: this.state.biography // and the Markdown content.
      }
    });
  }

  sendState() {
    return this.state;
  }
  // function that returns true if value is email, false otherwise
  verifyEmail(value) {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  }
  // function that verifies if a string has a given length or not
  verifyLength(value, length) {
    if (value.length >= length) {
      return true;
    }
    return false;
  }
  change(event, stateName, type, stateNameEqualTo) {
    switch (type) {
      case "email":
        if (this.verifyEmail(event.target.value)) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
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
  isValidated() {
    const fields = ['name', 'sid', 'level']
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
  
  handleSubmit = async (e) => {
    if (this.isValidated()) {
      const {name, type, sid, biography, level} = this.state
      const id = this.props.id
      const res = await updateProfileAPI({name, type, sid, biography, level, id})
    }
  }

  isNilOrEmpty = (s) => {
    return isNil(s) || s.length === 0
  }

  componentDidMount = async() => {
    const id = this.props.id
    const data = await profileAPI(id)
    const {username, type, sid, level, biography, name} = data
    this.setState({
      username: this.isNilOrEmpty(username) ? "" : username,
      type: this.isNilOrEmpty(type) ? "" : type,
      name: this.isNilOrEmpty(name) ? "" : name,
      nameState: this.isNilOrEmpty(name) ? "" : "success",
      sid: this.isNilOrEmpty(sid) ? "" : sid,
      sidState: this.isNilOrEmpty(sid) ? "" : "success",
      level: this.isNilOrEmpty(level) ? "" : level,
      levelState: this.isNilOrEmpty(level) ? "" : "success",
      biography: this.isNilOrEmpty(biography) ? "" : biography,
      biographyState: this.isNilOrEmpty(biography) ? "" : "success",
    })
  }

  handleFileChange = (file) => {
    this.setState({
      biography: file.content.text,
      biographyState: !isNil(file.content.text) && file.content.text.length > 0 ? 'success' : ''
    })
  }

  render() {
    const { classes } = this.props;
    this.state.stackedit.on('fileChange', (file) => this.handleFileChange(file));
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12}>
          <h4 className={classes.infoText}>
            填写你的基本信息
          </h4>
        </GridItem>
        <GridItem xs={12} sm={4}>
          <div className="picture-container">
          <div className="picture">
            <img
              src={isNil(this.props.avatar) ? defaultImage : this.props.avatar}
              className="picture-src"
              alt="..."
            />
          </div>
          </div>
        </GridItem>
        <GridItem xs={12} sm={6}>
          <CustomInput
            labelText={
              <span>
                用户名
              </span>
            }
            id="username"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              disabled: true,
              endAdornment: (
                <InputAdornment
                  position="end"
                  className={classes.inputAdornment}
                >
                  <AssignmentInd className={classes.inputAdornmentIcon} />
                </InputAdornment>
              ),
              value: this.state.username
            }}
          />
          <CustomInput
            labelText={
              <span>
                用户类型
              </span>
            }
            id="type"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              disabled: true,
              endAdornment: (
                <InputAdornment
                  position="end"
                  className={classes.inputAdornment}
                >
                  <AssignmentInd className={classes.inputAdornmentIcon} />
                </InputAdornment>
              ),
              value: this.state.type
            }}
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={10}>
          <CustomInput
            success={this.state.nameState === "success"}
            error={this.state.nameState === "error"}
            labelText={
              <span>
                真实姓名 <small>(必填)</small>
              </span>
            }
            id="name"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: event => this.change(event, 'name', 'length', 2),
              endAdornment: (
                <InputAdornment
                  position="end"
                  className={classes.inputAdornment}
                >
                  {/* <Email className={classes.inputAdornmentIcon} /> */}
                </InputAdornment>
              ),
              value: this.state.name
            }}
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={10}>
          <CustomInput
            success={this.state.sidState === "success"}
            error={this.state.sidState === "error"}
            labelText={
              <span>
                学号 <small>(必填)</small>
              </span>
            }
            id="sid"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: event => this.change(event, 'sid', 'length', 3),
              endAdornment: (
                <InputAdornment
                  position="end"
                  className={classes.inputAdornment}
                >
                  {/* <Email className={classes.inputAdornmentIcon} /> */}
                </InputAdornment>
              ),
              value: this.state.sid
            }}
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={10}>
          <CustomInput
            success={this.state.levelState === "success"}
            error={this.state.levelState === "error"}
            labelText={
              <span>
                入学年份 <small>(必填，如2015)</small>
              </span>
            }
            id="level"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: event => this.change(event, 'level', 'length', 4),
              endAdornment: (
                <InputAdornment
                  position="end"
                  className={classes.inputAdornment}
                >
                  {/* <Email className={classes.inputAdornmentIcon} /> */}
                </InputAdornment>
              ),
              value: this.state.level
            }}
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={10}>
          <CustomInput
            success={this.state.biographyState === "success"}
            error={this.state.biographyState === "error"}
            labelText={
              <span>
                个人简介 <small>(选填)</small>
              </span>
            }
            id="biography"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: event => this.change(event, 'biography', 'option'),
              // endAdornment: (
              //   <InputAdornment
              //     position="end"
              //     className={classes.inputAdornment}
              //   >
              //     {/* <Email className={classes.inputAdornmentIcon} /> */}
              //   </InputAdornment>
              // ),
              value: this.state.biography,
              multiline: true,
              rows: 5,
            }}
          />
          <Button
            color="info"
            onClick={this.handleOpenMarkdown}
          >
            使用Markdown编辑器
          </Button>
        </GridItem>
        
        <GridItem xs={10} sm={4} md={4} lg={3} className={classes.textAlignCenter}>
          <Button color="primary" onClick={this.handleSubmit}>更新</Button>
        </GridItem>
      </GridContainer>
    );
  }
}

const mapStateToProps = state => ({
  id: get(state, 'user.id'),
  avatar: get(state, 'user.avatar'),
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(ProfileBasic));
