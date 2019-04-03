/* eslint-disable react/jsx-key */
import React from "react";
// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Heading from "components/Heading/Heading.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";

import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

import { templateListAPI } from "../../utils/api"
class Template extends React.Component {
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
  
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Heading
          textAlign="center"
          title="代码仓库"
          category={
            <span>
            </span>
          }
        />
        <GridContainer>
          {
            this.state.data.map((item, key) => {
              return (
                <GridItem xs={12} sm={12} md={3}>
                  <Card>
                    <CardBody>
                      <div className={classes.center}>
                        <h5>{item.title}</h5>
                        <Button color="rose" size="sm">
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

export default withStyles(sweetAlertStyle)(Template);
