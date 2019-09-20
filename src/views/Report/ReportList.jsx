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
import { reportListAPI, reportListByUserIdAPI } from "../../utils/api"
import { withRouter } from "react-router-dom";
import { isNil, get } from "lodash"
import { connect } from 'react-redux'
import { updateReports } from "../../store/actions";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  }
};

class ReportList extends React.Component {

  fetchData = async (state, instance) => {
    this.setState({ loading: true })
    let res
    const page = state.page + 1
    console.log("page", page)
    if (this.props.userType === '教练') {
      res = await reportListAPI(page, state.filtered, state.sorted)
    } else {
      res = await reportListByUserIdAPI(page, state.filtered, state.sorted, this.props.userId)
    }
    this.props.updateReports(res)
    const data = res.results
    const pages = Math.ceil(res.count / state.pageSize)
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
              <h4 className={classes.cardIconTitle}>{this.props.userType === "教练" ? '周报列表' : '我的周报'}</h4>
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
                    this.props.history.push(`/report/${rowInfo.original.id}/`)
                  }
                })}
                // onPageChange={page => {
                //   this.props.updateReportsPage(page)
                //   console.log("page chagne to", this.props.page)
                // }}
                columns={[
                  {
                    Header: "标题",
                    accessor: "title",
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
              this.props.history.push('/create-report/')
            }}
          >
            新建周报
          </Button>
        </GridItem>
      </GridContainer>
    );
  }
}

const mapStateToProps = state => ({
  userType: get(state, 'user.type'),
  userId: get(state, 'user.id'),
})

const mapDispatchToProps = dispatch => ({
  updateReports: (payload) => dispatch(updateReports(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(ReportList)));
