import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from '@material-ui/core/Radio';

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";

import { isNil } from "lodash";
import Dropzone from 'react-dropzone'
import {useDropzone} from 'react-dropzone';
import styled from 'styled-components';
import { Card } from "@material-ui/core";

const style = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  choiche: {
    textAlign: "center",
    cursor: "pointer",
    marginTop: "20px"
  },
  fileUpload: {
    marginTop: "20px",
    height: "100px",
  },
  fileUploadText: {
    lineHeight: "100px",
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
};

class Step2 extends React.Component {
  constructor(props) {
    super(props);
    this.onDrop = (files) => {
      this.setState({files})
    };
    this.state = {
      selected: "",
      text: "",
      pdf: null,
      word: null,
      files: [],
      // simpleSelect: "",
      // pdf: false,
      // code: false,
    };
  }
  sendState() {
    return this.state;
  }
  handleSimple = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  handleSelect = (name) => () => {
    this.setState({
      selected: name
    })
  }
  isValidated() {
    // return !isNil(this.state.selected)
    return true;
  }

  handlePdfFile = (acceptedFiles) => {
    const {name, size} = acceptedFiles[0]
    this.set({
      text: `${name} - ${size} bytes`,
      // pdf: 
    })
    
  }
  
  fileUploader = () => {
    const getColor = (props) => {
      if (props.isDragAccept) {
          return '#00e676';
      }
      if (props.isDragReject) {
          return '#ff1744';
      }
      if (props.isDragActive) {
          return '#2196f3';
      }
      return '#eeeeee';
    }
    
    const Container = styled.div`
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      border-width: 2px;
      border-radius: 2px;
      border-color: ${props => getColor(props)};
      border-style: dashed;
      background-color: #fafafa;
      color: #bdbdbd;
      outline: none;
      transition: border .24s ease-in-out;
    `;
    const { selected } = this.state
    const { classes } = this.props
    if (selected === 'pdf') {
      return (
        <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
          {({getRootProps, getInputProps}) => (
            <Card>
              <div className={classes.fileUpload} {...getRootProps()}>
                <input {...getInputProps()} />
                <p className={classes.fileUploadText}></p>
              </div>
            </Card>
          )}
        </Dropzone>
      )
    } else if (selected === 'word') {
      const files = this.state.files.map(file => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ));
  
      return (
        <Dropzone onDrop={this.onDrop}>
          {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject}) => (
            <Container>
              <div {...getRootProps({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject})}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
              <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
              </aside>
            </Container>
          )}
        </Dropzone>
      )
    } else {
      return null
    }
  }

  render() {
    const { classes } = this.props;
   
    return (
      <div>
        <h4 className={classes.infoText}>选择上传本地PDF或在线编辑（不可修改）</h4>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} lg={10}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={4}>
                <div className={classes.choiche}>
                  <Radio
                    checked={this.state.selected === 'pdf'}
                    tabIndex={-1}
                    onClick={this.handleSelect("pdf")}
                    checkedIcon={
                      <i
                        className={
                          "far fa-file-pdf " + classes.iconCheckboxIcon
                        }
                      />
                    }
                    icon={
                      <i
                        className={
                          "far fa-file-pdf " + classes.iconCheckboxIcon
                        }
                      />
                    }
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox
                    }}
                  />
                  <h6>本地PDF</h6>
                </div>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <div className={classes.choiche}>
                  <Radio
                    checked={this.state.selected === 'word'}
                    tabIndex={-1}
                    onClick={this.handleSelect("word")}
                    checkedIcon={
                      <i
                        className={
                          "fas fa-terminal " + classes.iconCheckboxIcon
                        }
                      />
                    }
                    icon={
                      <i
                        className={
                          "fas fa-terminal " + classes.iconCheckboxIcon
                        }
                      />
                    }
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox
                    }}
                  />
                  <h6>WORD</h6>
                </div>
              </GridItem>
              <GridItem xs={12} sm={12}>
                {this.fileUploader()}
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(style)(Step2);
