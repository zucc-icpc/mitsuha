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
import CardAvatar from "components/Card/CardAvatar.jsx";

import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";
import { isNil } from "lodash";

import { templateListAPI, memberListAPI } from "../../utils/api"
class MemberList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentDidMount = async () => {
    const data = await memberListAPI()
    let dic = {}
    for (let i = 0; i < data.length; i ++) {
      const item = data[i];
      if (isNil(item.level)) {
        continue
      }
      if (isNil(dic[item.level])) {
        dic[item.level] = []
      }
      dic[item.level].push(item)
    }
    console.log(dic)
    this.setState({
      data: dic
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

  render() {
    const { classes } = this.props;
    const levels = Object.keys(this.state.data)
    const data = this.state.data
    return (
      <div>
        <Heading
          textAlign="center"
          title="成员"
          category={
            <span>
            </span>
          }
        />
        {
          levels.map((item, key) => {
            return (
              <div>
                <GridContainer justify="flex-start">
                  <GridItem>
                      <Button color="primary" size="sm" onClick={this.handleCreate}>
                        {item}级
                      </Button>
                  </GridItem>
                </GridContainer>
                <Divider></Divider>
                <GridContainer>
                  {
                    data[item].map((item, key) => {
                      return (
                        <GridItem xs={12} sm={12} md={3}>
                          <Card profile>
                            <CardAvatar profile>
                              <a href="#pablo" onClick={e => e.preventDefault()}>
                                <img src={item.avatar} alt="..." />
                              </a>
                            </CardAvatar>
                            <CardBody profile>
                              <div className={classes.center}>
                                <h5>{item.name}</h5>
                                <Button
                                  color="rose"
                                  size="sm"
                                  // onClick={() => this.handleOnClick(item.id, item.type, item.pdf, item.word)}
                                >
                                  查看
                                </Button>
                              </div>
                            </CardBody>
                          </Card>
                        </GridItem>
                      )
                    })
                  }
                </GridContainer>
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default withRouter(withStyles(sweetAlertStyle)(MemberList));
