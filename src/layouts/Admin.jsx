import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import routes from "routes.js";
import appStyle from "assets/jss/material-dashboard-pro-react/layouts/adminStyle.jsx";
import asyncComponent from "../components/AsyncComponent/AsyncComponent";
import logo from "assets/img/icpc_logo.png";
import { get } from "lodash";
import { connect } from 'react-redux'

const AsyncSolution = asyncComponent(() => import("../views/Solution/Solution.jsx"))
const AsyncSolutionDetail = asyncComponent(() => import("../views/Solution/SolutionDetail"))
const AsyncSolutionCreate = asyncComponent(() => import("../views/Solution/SolutionCreate"))
const AsyncTemplateCreate = asyncComponent(() => import("../views/Template/TemplateCreate"))
const AsyncTemplateDetailPDF = asyncComponent(() => import("../views/Template/TemplateDetailPDF"))
const AsyncProfile = asyncComponent(() => import("../views/Profile/Profile"))
const AsyncProfileDisplay = asyncComponent(() => import("../views/Profile/ProfileDisplay"))
const AsyncSolutionEdit = asyncComponent(() => import("../views/Solution/SolutionEdit"))
const AsyncReportList = asyncComponent(() => import("../views/Report/ReportList"))
const AsyncReportDetail = asyncComponent(() => import("../views/Report/ReportDetail"))
const AsyncReportCreate = asyncComponent(() => import("../views/Report/ReportCreate"))
const AsyncHonorDetail = asyncComponent(() => import("../views/Honor/HonorDetail"))
const AsyncHonorCreate = asyncComponent(() => import("../views/Honor/HonorCreate"))
const AsyncHonorEdit = asyncComponent(() => import("../views/Honor/HonorEdit"))

var ps;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      miniActive: false,
      // image: image,
      color: "white",
      bgColor: "black",
      hasImage: false,
      fixedClasses: "dropdown"
    };
    this.resizeFunction = this.resizeFunction.bind(this);
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.mainPanel, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", this.resizeFunction);
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
    window.removeEventListener("resize", this.resizeFunction);
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }
  handleImageClick = image => {
    this.setState({ image: image });
  };
  handleColorClick = color => {
    this.setState({ color: color });
  };
  handleBgColorClick = bgColor => {
    this.setState({ bgColor: bgColor });
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({ fixedClasses: "dropdown show" });
    } else {
      this.setState({ fixedClasses: "dropdown" });
    }
  };
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  getRoute() {
    return this.props.location.pathname !== "/admin/full-screen-maps";
  }
  getActiveRoute = routes => {
    let activeRoute = "";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].name === "周报" && this.props.userType === "普通用户") {
        continue
      }
      if (routes[i].collapse) {
        let collapseActiveRoute = this.getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.name === "周报" && this.props.userType === "普通用户") {
        return null;
      }
      if (prop.layout === "") {
        return (
          <Route
            exact
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  sidebarMinimize() {
    this.setState({ miniActive: !this.state.miniActive });
  }
  resizeFunction() {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }
  render() {
    const { classes, ...rest } = this.props;
    const mainPanel =
      classes.mainPanel +
      " " +
      cx({
        [classes.mainPanelSidebarMini]: this.state.miniActive,
        [classes.mainPanelWithPerfectScrollbar]:
          navigator.platform.indexOf("Win") > -1
      });
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={routes}
          logoText={"ACM实验室"}
          logo={logo}
          image={this.state.image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color={this.state.color}
          bgColor={this.state.bgColor}
          miniActive={this.state.miniActive}
          {...rest}
        />
        <div className={mainPanel} ref="mainPanel">
          <AdminNavbar
            sidebarMinimize={this.sidebarMinimize.bind(this)}
            miniActive={this.state.miniActive}
            brandText={this.getActiveRoute(routes)}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          {/* On the /maps/full-screen-maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          {this.getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>
                <Switch>{this.getRoutes(routes)}</Switch>
                <Route exact path="/" component={AsyncSolution}></Route>
                <Route exact path="/solution/:id/" component={AsyncSolutionDetail}></Route>
                <Route exact path="/create-solution/" component={AsyncSolutionCreate}></Route>
                <Route exact path="/edit-solution/:id/" component={AsyncSolutionEdit}></Route>
                <Route exact path="/template/:id/pdf/" component={AsyncTemplateDetailPDF}></Route>
                <Route exact path="/create-template/" component={AsyncTemplateCreate}></Route>
                <Route exact path="/profile/" component={AsyncProfile}></Route>
                <Route exact path="/member/:id/" component={AsyncProfileDisplay}></Route>
                <Route exact path="/report/" component={AsyncReportList}></Route>
                <Route exact path="/report/:id/" component={AsyncReportDetail}></Route>
                <Route exact path="/create-report/" component={AsyncReportCreate}></Route>
                <Route exact path="/honor/:id/" component={AsyncHonorDetail}></Route>
                <Route exact path="/create-honor/" component={AsyncHonorCreate}></Route>
                <Route exact path="/edit-honor/:id/" component={AsyncHonorEdit}></Route>
              </div>
            </div>
          ) : (
            <div className={classes.map}>
              <Switch>{this.getRoutes(routes)}</Switch>
            </div>
          )}
          
          {this.getRoute() ? <Footer fluid /> : null}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  userType: get(state, 'user.type')
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(appStyle)(Dashboard));
