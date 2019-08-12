import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Heading from "components/Heading/Heading.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";

import { solutionDetailAPI, solutionDeleteAPI } from "../../utils/api";
import ReactMarkdown from "react-markdown";
import Button from "components/CustomButtons/Button.jsx";
import { connect } from 'react-redux';
import { get } from 'lodash';
import buttonStyle from "assets/jss/material-dashboard-pro-react/components/buttonStyle.jsx";
import Disqus from 'disqus-react';
import { withRouter } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert/lib/dist/SweetAlert";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
const RemarkMathPlugin = require("remark-math");

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
  ...buttonStyle
};

class SolutionDetail extends React.Component {

  componentDidMount = async () => {
    const data = await solutionDetailAPI(this.props.match.params.id);
    this.setState({
      content: data["content"],
      title: data["title"],
      name: data["name"]
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      content: "",
      title: "",
      name: "",
      alert: null,
      id: this.props.match.params.id
    }
  }

  hideAlert = () => {
    this.setState({
      alert: null
    });
  }

  successDelete = async () => {
    const res = await solutionDeleteAPI(this.state.id)
    console.log('delete', res)
    this.setState({
      alert: (
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="删除成功"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
        >
          {/* 题解已删除 */}
        </SweetAlert>
      )
    });
    this.props.history.push('/solution/');
  }


  warningWithConfirmMessage = () => {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="确定删除"
          onConfirm={() => this.successDelete()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
          cancelBtnCssClass={
            this.props.classes.button + " " + this.props.classes.danger
          }
          confirmBtnText="确定"
          cancelBtnText="取消"
          showCancel
        >
          删除之后不可恢复
        </SweetAlert>
      )
    });
  }

  render() {
    const { classes } = this.props
    const devMode = process.env.NODE_ENV === 'development'
    const disqusShortname = devMode ? 'example' : 'zuccicpc';
    const disqusConfig = {
        url: `/solution/${this.state.id}`,
        identifier: this.state.id,
        title: this.state.title,
    };
    const latex = (a) => String.raw(a).replace("\\`","`")
    const newProps = {
      source: this.state.content,
      escapeHtml: false,
      plugins: [
        RemarkMathPlugin,
      ],
      renderers: {
        math: (props) => <BlockMath>{props.value}</BlockMath>,
        inlineMath: (props) => <InlineMath>{props.value}</InlineMath>,
      }
    };
    return (
      <div>
        <Heading
          textAlign="center"
          title={this.state.title}
          category={`作者：${this.state.name}`}
        />
        {
          this.props.username === this.state.name ? (
            <div>
              <Button 
                color="primary"
                onClick={() => {
                  this.props.history.push(`/edit-solution/${this.state.id}/`)
                }}
                >
                编辑
              </Button>
              <Button 
                color="primary"
                onClick={this.warningWithConfirmMessage}
              >
                删除
              </Button>
            </div>
          
          ) : null
        }
        {this.state.alert}
        <Card>
          <CardBody>
            <div className={classes.typo}>
              <ReactMarkdown {...newProps} />
            </div>
          </CardBody>
        </Card>
        <Disqus.DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
      </div>
    );
  }
}

SolutionDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  username: get(state, 'user.username'),
})

const mapDispatchToProps = dispatch => ({
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(SolutionDetail)));
