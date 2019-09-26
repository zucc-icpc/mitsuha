import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Heading from "components/Heading/Heading.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";

import { honorDetailAPI, honorDeleteAPI } from "../../utils/api";
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
import { isNil } from "lodash";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import { updateHonors } from "../../store/actions";

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

class HonorDetail extends React.Component {

  componentDidMount = async () => {
    const id = parseInt(this.props.match.params.id)
    await this.getHonorDetail(id)
  }

  getHonorDetail = async (id) => {
    const data = await honorDetailAPI(id);
    this.setState({
      detail: data['detail'],
      time: data['time'],
      intro: data['intro'],
      id
    })
  }

  componentDidUpdate = async (prevProps, prevState, snapshot) => {
    if (prevState.id !== this.state.id) {
      await this.getHonorDetail(this.state.id)
    }
  }

  constructor(props) {
    super(props);
    this.state = {
    detail: "",
      created: "",
      time: "",
      intro: "",
      alert: null,
    }
  }

  hideAlert = () => {
    this.setState({
      alert: null
    });
  }

  successDelete = async () => {
    const res = await honorDeleteAPI(this.state.id)
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
        </SweetAlert>
      )
    });
    this.props.history.push('/honor/');
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
    console.log(this.props)
    const id = this.state.id
    const results = this.props.honors.results
    const len = results.length
    console.log(results)
    console.log(len)
    console.log(results[len-1])
    if (results[len-1].id === id) {
      return false
    }
    return true
  }

  checkPrevious = () => {
    const id = this.state.id
    const results = this.props.honors.results
    if (results[0].id === id) {
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
    const results = this.props.honors.results
   
    let pos = this.findIdFromResults(id, results)
    if (pos == -1) {
      console.log("id not found in redux when getNext")
      return
    }
    const nextId = results[pos+1].id
    this.props.history.push(`/honor/${nextId}`)
    this.setState({
      id: nextId
    })
  }

  getPrevious = async() => {
    const id = this.state.id
    const results = this.props.honors.results
    let pos = this.findIdFromResults(id, results)
    if (pos == -1) {
      console.log("id not found in redux when getPrevious")
      return
    }
    const previousId = results[pos-1].id
    this.props.history.push(`/honor/${previousId}`)
    this.setState({
      id: previousId
    })
  }

  render() {
    const { classes } = this.props
    const latex = (a) => String.raw(a).replace("\\`","`")
    const newProps = {
      source: this.state.detail,
      escapeHtml: false,
      plugins: [
        RemarkMathPlugin,
      ],
      renderers: {
        math: (props) => <BlockMath>{props.value}</BlockMath>,
        inlineMath: (props) => <InlineMath>{props.value}</InlineMath>,
        image: ({src, ...props}) => <img src={src} width="100%" {...props}/>
      }
    };
    return (
      <div>
        <Heading
          textAlign="center"
          title={this.state.intro}
          category={`时间：${this.state.time}`}
        />
        {
          this.props.user.type === '教练' ||  this.props.user.isStaff === 'True' ? (
            <div>
              <Button 
                color="primary"
                onClick={() => {
                  this.props.history.push(`/edit-honor/${this.state.id}/`)
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

HonorDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: get(state, 'user'),
  honors: get(state, 'honors'),
})

const mapDispatchToProps = dispatch => ({
  updateHonors: (payload) => dispatch(updateHonors(payload)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(HonorDetail)));
