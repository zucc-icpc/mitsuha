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
      work: "",
      graduate: "",
      workState: "",
      graduateState: "",
    };
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
    const fields = []
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
      const {graduate, work} = this.state
      const id = this.props.id
      const res = await updateProfileAPI({graduate, work, id})
    }
  }

  isNilOrEmpty = (s) => {
    return isNil(s) || s.length === 0
  }

  componentDidMount = async() => {
    const id = this.props.id
    const data = await profileAPI(id)
    const {graduate, work} = data
    this.setState({
      graduate: this.isNilOrEmpty(graduate) ? "" : graduate,
      graduateState: this.isNilOrEmpty(graduate) ? "" : "success",
      work: this.isNilOrEmpty(work) ? "" : work,
      workState: this.isNilOrEmpty(work) ? "" : "success",
    })
  }


  render() {
    const { classes } = this.props;
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12}>
          <h4 className={classes.infoText}>
            Let's start with the basic information (with validation)
          </h4>
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={10}>
          <CustomInput
            success={this.state.graduateState === "success"}
            error={this.state.graduateState === "error"}
            labelText={
              <span>
                就职于 <small>(选填)</small>
              </span>
            }
            id="work"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: event => this.change(event, 'work', 'option'),
              endAdornment: (
                <InputAdornment
                  position="end"
                  className={classes.inputAdornment}
                >
                  {/* <Email className={classes.inputAdornmentIcon} /> */}
                </InputAdornment>
              ),
              value: this.state.work
            }}
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={10}>
          <CustomInput
            success={this.state.workState === "success"}
            error={this.state.workState === "error"}
            labelText={
              <span>
                就读于 <small>(选填)</small>
              </span>
            }
            id="graduate"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: event => this.change(event, 'graduate', 'option'),
              endAdornment: (
                <InputAdornment
                  position="end"
                  className={classes.inputAdornment}
                >
                  {/* <Email className={classes.inputAdornmentIcon} /> */}
                </InputAdornment>
              ),
              value: this.state.graduate
            }}
          />
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
