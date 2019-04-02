import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Quote from "components/Typography/Quote.jsx";
import Muted from "components/Typography/Muted.jsx";
import Primary from "components/Typography/Primary.jsx";
import Info from "components/Typography/Info.jsx";
import Success from "components/Typography/Success.jsx";
import Warning from "components/Typography/Warning.jsx";
import Danger from "components/Typography/Danger.jsx";
import Heading from "components/Heading/Heading.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";

import { solutionDetailAPI } from "../../utils/api";
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
  }
};

class SolutionDetail extends React.Component {

  componentDidMount = async () => {
    const data = await solutionDetailAPI(this.props.match.params.id);
    this.setState({
      content: data["content"],
      title: data["title"],
      owner: data["owner"]
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      content: "",
      title: "",
      owner: "",
    }
  }
  render() {
    const { classes } = this.props
    return (
      <div>
        <Heading
          textAlign="center"
          title={this.state.title}
          category={`作者：${this.state.owner}`}
        />
        <Card>
          <CardBody>
          <div className={classes.typo}>
            {/* <div className={props.classes.note}>Paragraph</div> */}
            {/* <p>
              {this.state.content}
            </p> */}
            <ReactMarkdown 
              source={this.state.content}
              escapeHtml={false}
            />
          </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

SolutionDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default withStyles(style)(SolutionDetail);
