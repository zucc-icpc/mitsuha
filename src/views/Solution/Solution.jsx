import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.jsx";
import { solutionListAPI } from "../../utils/api"
import { withRouter } from "react-router-dom";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  }
};

class Solution extends React.Component {

  fetchData = async (state, instance) => {
    this.setState({ loading: true })
    const res = await solutionListAPI(state.page + 1, state.filtered, state.sorted)
    const data = res.results
    const pages = Math.ceil(res.count / state.pageSize)
    console.log(data, pages)
    console.log(res)
    console.log(state.filtered)
    console.log(state.sorted)
    this.setState({
      data,
      pages,
      loading: false
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pages: null,
      loading: true,
      pageSize: 10,
    };
  }

  render() {
    const { classes } = this.props;
    const {pages, loading, data, pageSize} = this.state
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
                manual
                data={data}
                pages={pages} // Display the total number of pages
                loading={loading} // Display the loading overlay when we need it
                onFetchData={this.fetchData} // Request new data when things change
                showPageSizeOptions={false}
                filterable
                sortable={true}
                getTrProps={(state, rowInfo, column, instance) => ({
                  onClick: e => {
                    // history.push
                    console.log(state, rowInfo, column, instance)
                    this.props.history.push(`/solution/${rowInfo.original.id}/`)
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
                    accessor: "created",
                    filterable: false,
                  },
                ]}
                pageSize={pageSize}
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
              this.props.history.push('/create-solution/')
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
