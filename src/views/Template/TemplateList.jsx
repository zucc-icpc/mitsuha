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

import { templateListAPI } from "../../utils/api"
class TemplateList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount = async () => {
    const id = localStorage.getItem('id')
    const data = await templateListAPI(id)
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
        <GridContainer justify="flex-start">
            <GridItem>
                <Button color="primary" size="sm" onClick={this.handleCreate}>
                  添加模版
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

export default withRouter(withStyles(sweetAlertStyle)(TemplateList));
