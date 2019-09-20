import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Heading from "components/Heading/Heading.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";

import { reportDetailAPI, reportDeleteAPI, reportListByUrlAPI } from "../../utils/api";
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
import { updateReports } from "../../store/actions";
import { isNil } from "lodash";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

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

class ReportDetail extends React.Component {

  componentDidMount = async () => {
    const id = parseInt(this.props.match.params.id)
    await this.getReportDetail(id)
  }

  getReportDetail = async (id) => {
    const data = await reportDetailAPI(id);
    this.setState({
      content: data['content'],
      title: data['title'],
      created: data['created'],
      owner: data['owner'],
      id
    //   name: data["name"]
    })
  }

  componentDidUpdate = async (prevProps, prevState, snapshot) => {
    if (prevState.id !== this.state.id) {
      await this.getReportDetail(this.state.id)
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      content: "",
      title: "",
      created: "",
    //   name: "",
      alert: null,
    }
  }

  hideAlert = () => {
    this.setState({
      alert: null
    });
  }

  successDelete = async () => {
    const res = await reportDeleteAPI(this.state.id)
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
    this.props.history.push('/report/');
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

  checkNext = () => {
    const id = this.state.id
    const {results, next} = this.props.reports
    const len = results.length
    if (results[len-1].id === id && isNil(next)) {
      return false
    }
    return true
  }

  checkPrevious = () => {
    const id = this.state.id
    const {results, previous} = this.props.reports
    const len = results.length
    if (results[0].id === id && isNil(previous)) {
      return false
    }
    return true
  }

  findIdFromResults = (id, results) => {
    let pos = -1
    for (let i = 0; i < results.length; i ++) {
      if (results[i].id === id) {
        pos = i
        break
      }
    }
    return pos
  }

  getNext = async () => {
    const id = this.state.id
    const {results, next} = this.props.reports
    const len = results.length
    let pos = this.findIdFromResults(id, results)
    if (pos == -1) {
      console.log("id not found in redux when getNext")
      return
    }
    let nextId
    if (pos === len - 1) {
      const reports = await reportListByUrlAPI(next)
      nextId = reports.results[0].id
      this.props.updateReports(reports)
    } else {
      nextId = results[pos+1].id
    }
    this.props.history.push(`/report/${nextId}`)
    this.setState({
      id: nextId
    })
  }

  getPrevious = async() => {
    const id = this.state.id
    const {results, previous} = this.props.reports
    const len = results.length
    let pos = this.findIdFromResults(id, results)
    if (pos == -1) {
      console.log("id not found in redux when getPrevious")
      return
    }
    let previousId
    if (pos === 0) {
      const reports = await reportListByUrlAPI(previous)
      previousId = reports.results[reports.results.length-1].id
      this.props.updateReports(reports)
    } else {
      previousId = results[pos-1].id
    }
    this.props.history.push(`/report/${previousId}`)
    this.setState({
      id: previousId
    })
  }

  render() {
    const { classes } = this.props
    const devMode = process.env.NODE_ENV === 'development'
    const disqusShortname = devMode ? 'example' : 'zuccicpc';
    const disqusConfig = {
        url: `/report/${this.state.id}`,
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
          category={`创建时间：${this.state.created}`}
        />
        {
          this.props.username === this.state.owner ? (
            <div>
              {/* <Button 
                color="primary"
                onClick={() => {
                  this.props.history.push(`/edit-report/${this.state.id}/`)
                }}
                >
                编辑
              </Button> */}
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
        <GridContainer justify="center">
          <GridItem>
            <Button color="primary" onClick={this.getPrevious} disabled={!this.checkPrevious()}>
              上一个
            </Button>
          </GridItem>
          <GridItem>
            <Button color="primary" onClick={this.getNext} disabled={!this.checkNext()}>
              下一个
            </Button>
          </GridItem>
        </GridContainer>
         
        {/* <Disqus.DiscussionEmbed shortname={disqusShortname} config={disqusConfig} /> */}
      </div>
    );
  }
}

ReportDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  username: get(state, 'user.username'),
  reports: get(state, 'reports'),
})

const mapDispatchToProps = dispatch => ({
  updateReports: (payload) => dispatch(updateReports(payload)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(ReportDetail)));
