import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardHeader from "components/Card/CardHeader.jsx";

import { dataTable } from "variables/general.jsx";

import { cardTitle } from "assets/jss/material-dashboard-pro-react.jsx";

import { solutionListAPI } from "../../utils/api"

import { Route, Switch, Redirect, Link, withRouter } from "react-router-dom";

import SolutionDetail from "./SolutionDetail";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  }
};

class Solution extends React.Component {

  componentDidMount = async () => {
    const data = await solutionListAPI();
    this.setState({
      data: data.map((prop, key) => {
        return {
          id: prop["id"],
          title: prop["title"],
          oj: prop["oj"],
          pid: prop["pid"],
          owner: prop["owner"],
          created: prop["created"],
          actions: (
            // we've added some custom button actions
            <div className="actions-right">
              {/* use this button to add a like kind of action */}
              <Button
                justIcon
                round
                simple
                onClick={() => {

                }}
                color="info"
                className="like"
              >
                <Favorite />
              </Button>{" "}
            </div>
          )
        }
      })
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      data: dataTable.dataRows.map((prop, key) => {
        return {
          id: key,
          title: prop[0],
          oj: prop[1],
          pid: prop[2],
          owner: prop[3],
          created: prop[3],
          
        };
      })
    };
  }
  render() {
    const { classes } = this.props;
    return (
      <GridContainer justify="center">
        <GridItem xs={12}>
          <Card>
            <CardHeader color="primary" icon>
              <CardIcon color="primary">
                <Assignment />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>题解列表</h4>
            </CardHeader>
            <CardBody>
              <ReactTable
                data={this.state.data}
                filterable
                getTrProps={(state, rowInfo, column, instance) => ({
                  onClick: e => {
                    // history.push
                    console.log(state, rowInfo, column, instance)
                    this.props.history.push(`/admin/solution/${rowInfo.original.id}/`)
                  }
                })}
                columns={[
                  {
                    Header: "标题",
                    accessor: "title",
                  },
                  {
                    Header: "OJ",
                    accessor: "oj"
                  },
                  {
                    Header: "题号",
                    accessor: "pid"
                  },
                  {
                    Header: "作者",
                    accessor: "owner"
                  },
                  {
                    Header: "发布时间",
                    accessor: "created"
                  },
                  // {
                  //   Header: "Actions",
                  //   accessor: "actions",
                  //   sortable: false,
                  //   filterable: false
                  // }
                ]}
                defaultPageSize={10}
                showPaginationTop
                showPaginationBottom={false}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Button 
            color="primary"
            onClick={() => {
              this.props.history.push('/admin/create-solution/')
            }}
          >
            新建题解
          </Button>
        </GridItem>
      </GridContainer>
    );
  }
}

export default withRouter(withStyles(styles)(Solution));
