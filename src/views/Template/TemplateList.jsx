/* eslint-disable react/jsx-key */
import React from "react";
import { withRouter } from "react-router-dom";

// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Divider from '@material-ui/core/Divider';

// core components
import Heading from "components/Heading/Heading.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";


import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

import { templateListAPI, templateListByUserIdAPI, templateDeleteAPI } from "../../utils/api"
import { connect } from 'react-redux'
import { isNil, get } from "lodash"
import buttonStyle from "assets/jss/material-dashboard-pro-react/components/buttonStyle.jsx";

class TemplateList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      alert: null,
      mode: 'all',
    };
  }

  componentDidMount = async () => {
    const data = await templateListAPI()
    this.setState({
      data
    })
  }

  handleOnClick = (id, type, pdf, word) => {
    if (type === 'pdf') {
      window.open(pdf)
      // window.open(`http://view.officeapps.live.com/op/view.aspx?src=${pdf}`)
    } else if (type === 'word') {
      window.open(word)
      // window.open(`http://view.officeapps.live.com/op/view.aspx?src=${pdf}`)
    } else {
      this.props.history.push(`/admin/template/${id}/code/`)
    }
  }
  
  handleCreate = () => {
    this.props.history.push("/admin/create-template/")
  }

  getMyTemplates = async () => {
    const id = this.props.id
    const data = await templateListByUserIdAPI(id)
    this.setState({
      data,
      mode: 'my',
    })
  }

  getAllTemplates = async () => {
    const data = await templateListAPI()
    this.setState({
      data,
      mode: 'all',
    })
  }

  hideAlert = () => {
    this.setState({
      alert: null
    });
  }

  successDelete = async (id) => {
    const res = await templateDeleteAPI(id)
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
        </SweetAlert>
      )
    });
    if (this.state.mode === 'my') {
      this.getMyTemplates()
    } else {
      this.getAllTemplates()
    }
  }


  warningWithConfirmMessage = (id) => {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="确定删除"
          onConfirm={() => this.successDelete(id)}
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
    const { classes } = this.props;
    return (
      <div>
        <Heading
          textAlign="center"
          title="模版"
          category={
            <span>
            </span>
          }
        />
        {this.state.alert}
        <GridContainer justify="flex-start">
            <GridItem>
                <Button color="primary" size="sm" onClick={this.handleCreate}>
                  添加模版
                </Button>
                <Button color="primary" size="sm" onClick={this.getMyTemplates}>
                  我的模版
                </Button>
                <Button color="primary" size="sm" onClick={this.getAllTemplates}>
                  所有模版
                </Button>
            </GridItem>
        </GridContainer>
        <Divider></Divider>
        <GridContainer>
          {
            this.state.data.map((item, key) => {
              return (
                <GridItem xs={12} sm={12} md={3}>
                  <Card>
                    <CardBody>
                      <div className={classes.center}>
                        <h5>{item.title}</h5>
                        <Button
                          color="rose"
                          size="sm"
                          onClick={() => this.handleOnClick(item.id, item.type, item.pdf, item.word)}
                        >
                          查看
                        </Button>
                        {this.props.username === item.owner ? (
                          <Button
                          color="rose"
                          size="sm"
                          onClick={() => this.warningWithConfirmMessage(item.id)}
                        >
                          删除
                        </Button>
                        ) : null}
                      </div>
                    </CardBody>
                  </Card>
                </GridItem>
              )
            })
          }
        </GridContainer>
         
      </div>
    );
  }
}

const mapStateToProps = state => ({
  id: get(state, 'user.id'),
  username: get(state, 'user.username')
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(sweetAlertStyle)(TemplateList)));
