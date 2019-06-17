import asyncComponent from "./components/AsyncComponent/AsyncComponent";
import DashboardIcon from "@material-ui/icons/Dashboard";
import GridOn from "@material-ui/icons/GridOn";
import People from '@material-ui/icons/People';
import Book from '@material-ui/icons/Book';

const AsyncSolution = asyncComponent(() => import("./views/Solution/Solution.jsx"))
const AsyncTemplateList = asyncComponent(() => import("./views/Template/TemplateList.jsx"))
const AsyncMemberList = asyncComponent(() => import("./views/Member/MemberList.jsx"))
const AsyncHonor = asyncComponent(() => import("./views/Honor/Honor.jsx"))
// import Solution from "./views/Solution/Solution.jsx";
// import TemplateList from "./views/Template/TemplateList.jsx";
// import MemberList from "./views/Member/MemberList.jsx";
// import Honor from "./views/Honor/Honor.jsx";

var dashRoutes = [
  {
    path: "/solution/",
    name: "题解",
    rtlName: "题解",
    icon: DashboardIcon,
    component: AsyncSolution,
    layout: ""
  },
  {
    path: "/template/",
    name: "模版",
    rtlName: "模版",
    icon: GridOn,
    component: AsyncTemplateList,
    layout: ""
  },
  {
    path: "/member/",
    name: "成员",
    rtlName: "成员",
    icon: People,
    component: AsyncMemberList,
    layout: ""
  },
  {
    path: "/honor/",
    name: "故事",
    rtlName: "故事",
    icon: Book,
    component: AsyncHonor,
    layout: ""
  },
];
export default dashRoutes;
