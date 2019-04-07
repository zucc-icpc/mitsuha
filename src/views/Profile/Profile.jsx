import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Schedule from "@material-ui/icons/Schedule";
import Info from "@material-ui/icons/Info";
import LocationOn from "@material-ui/icons/LocationOn";
import Gavel from "@material-ui/icons/Gavel";
import HelpOutline from "@material-ui/icons/HelpOutline";
import AssignmentInd from "@material-ui/icons/AssignmentInd";
import School from "@material-ui/icons/School";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import NavPills from "components/NavPills/NavPills.jsx";
import Accordion from "components/Accordion/Accordion.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

import { cardTitle } from "assets/jss/material-dashboard-pro-react.jsx";
import ProfileBasic from "./ProfileBasic";
import ProfileAvatar from "./ProfileAvatar";
import ProfileGraduate from "./ProfileGraduate";

const styles = {
  cardTitle,
  pageSubcategoriesTitle: {
    color: "#3C4858",
    textDecoration: "none",
    textAlign: "center"
  },
  cardCategory: {
    margin: "0",
    color: "#999999"
  }
};

class Panels extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={10}>
            {/* <h3 className={classes.pageSubcategoriesTitle}>
              个人信息
            </h3>
            <br /> */}
            <NavPills
              color="warning"
              alignCenter
              tabs={[
                {
                  tabButton: "基本设置",
                  tabIcon: AssignmentInd,
                  tabContent: (
                    <Card>
                      <ProfileBasic></ProfileBasic>
                    </Card> 
                  )
                },
                {
                  tabButton: "头像设置",
                  tabIcon: Gavel,
                  tabContent: (
                    <Card>
                      <ProfileAvatar></ProfileAvatar>
                    </Card>
                  )
                },
                {
                  tabButton: "毕业去向",
                  tabIcon: School,
                  tabContent: (
                    <Card>
                      <ProfileGraduate></ProfileGraduate>
                    </Card>
                  )
                },
              ]}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(Panels);
