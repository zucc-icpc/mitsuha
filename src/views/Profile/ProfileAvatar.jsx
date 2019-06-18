import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import defaultImage from "assets/img/placeholder.jpg";
import {  updateAvaterAPI } from "../../utils/api";
import { isNil, get } from 'lodash';
import AvatarEditor from 'react-avatar-editor'
import Slider from '@material-ui/lab/Slider';

import { connect } from 'react-redux'
import { updateUser } from "../../store/actions";

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
  slider: {
    padding: '22px 0px',
  },
  hideInput: {
    display: "none",
  }
});

class ProfileAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: null,
      imagePreviewUrl: defaultImage,
      scale: 1
    };
  }

  
  handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (isNil(file)) {
      return
    }
    reader.onloadend = () => {
      this.setState({
        avatar: file,
        imagePreviewUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  }

  handleSubmit = async (e) => {
    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = this.editor.getImage()

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      const canvasScaled = this.editor.getImageScaledToCanvas()
      const id = this.props.id
      canvas.toBlob(async (avatar) => {
        const file = new File([avatar], `avatar-${id}-${new Date().getTime()}.png`)
        console.log(file)
        const data = await updateAvaterAPI(id, file)
        this.props.updataAvatar(data.avatar, data.avatar_thumb)
      })
    }
  }

  setEditorRef = (editor) => this.editor = editor

  isNilOrEmpty = (s) => {
    return isNil(s) || s.length === 0
  }

  componentDidMount = async() => {

  }

  handleChange = (event, value) => {
    this.setState({
      scale: value
    })
  }

  handleUpload = () => {
    this.refs.fileInput.click();
  }

  render() {
    const { classes } = this.props;
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12}>
          <h4 className={classes.infoText}>
            上传并剪裁你的头像
          </h4>
        </GridItem>
        <GridItem className={classes.textAlignCenter}>
          <AvatarEditor
            ref={this.setEditorRef}
            image={this.state.imagePreviewUrl}
            width={250}
            height={250}
            border={50}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={this.state.scale}
            borderRadius={250}
            rotate={0}
          />
        </GridItem>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={6} lg={4} className={classes.textAlignCenter}>
            <Slider
              classes={{ container: classes.slider }}
              value={this.state.scale}
              aria-labelledby="label"
              onChange={this.handleChange}
              min={1}
              max={2}
            />
          </GridItem>
        </GridContainer>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={6} lg={4} className={classes.textAlignCenter}>
            <Button onClick={this.handleUpload}>上传</Button>
            <Button onClick={this.handleSubmit}>保存</Button>
            <input className={classes.hideInput} type="file" onChange={this.handleImageChange} ref="fileInput" />
          </GridItem>
        </GridContainer>
      </GridContainer>
    );
  }
}

const mapStateToProps = state => ({
  id: get(state, 'user.id')
})

const mapDispatchToProps = dispatch => ({
  updataAvatar: (avatar, avatar_thumb) => dispatch(updateUser({avatar, avatar_thumb}))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(ProfileAvatar));
