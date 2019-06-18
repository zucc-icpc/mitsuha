import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Heading from "components/Heading/Heading.jsx";
import Card from "components/Card/Card.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import { profileAPI } from "../../utils/api";
import { isNil } from "lodash"
import defaultImage from "assets/img/placeholder.jpg";

// const ReactMarkdown = require('react-markdown')
import ReactMarkdown from "react-markdown";
const style = {
  typo: {
    // paddingLeft: "25%",
    marginBottom: "40px",
    position: "relative"
  },
  note: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    bottom: "10px",
    color: "#c0c1c2",
    display: "block",
    fontWeight: "400",
    fontSize: "13px",
    lineHeight: "13px",
    left: "0",
    marginLeft: "20px",
    position: "absolute",
    width: "260px"
  },
  title: {
    marginBottom: "80px"
  }
};

class ProfileDisplay extends React.Component {

  componentDidMount = async () => {
    const id = this.props.match.params.id
    const data = await profileAPI(id)
    this.setState({
      ...data
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      name: "",
      biography: "",
      level: "",
      work: "",
      graduate: "",
    }
  }

  isNilOrEmpty = (s) => {
    return isNil(s) || s.length === 0
  }

  render() {
    const { classes } = this.props
    const { level, biography, work, graduate, avatar_thumb} = this.state
    let intro = `${level}级`
    if (!this.isNilOrEmpty(work)) {
      intro += ` 就职于${work}`
    }
    if (!this.isNilOrEmpty(graduate)) {
      intro += ` 就读于${graduate}`
    }
    return (
      <div>
        <Heading
          textAlign="center"
          title={this.state.name}
          category={intro}
          className={classes.title}
        />
        <Card>
          
          <CardBody>
            <div className={classes.typo}>
              <ReactMarkdown 
                source={biography}
                escapeHtml={false}
              />
            </div>
          </CardBody>
          <CardFooter testimonial>
            <CardAvatar testimonial testimonialFooter>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={this.isNilOrEmpty(avatar_thumb) ? defaultImage : avatar_thumb} alt="..." />
              </a>
            </CardAvatar>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

ProfileDisplay.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withStyles(style)(ProfileDisplay);
