/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import DashboardAdmin from "layouts/dashboardAdmin";
import Posts from "layouts/posts";
import PostsAdmin from "layouts/postsAdmin";
import TablesAdmin from "layouts/tablesAdmin";
import TablesPropertyowner from "layouts/tablesProertyowner";
import TablesHandyman from "layouts/tablesHandyman";
import TablesUser from "layouts/tablesUser";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import ProfileAdmin from "layouts/profileAdmin";
import Plumbers from "layouts/plumbers";
import Gardners from "layouts/gardners";
import HouseKeepers from "layouts/houseKeepers";
import RefrigerationTechnicians from "layouts/refrigerationTechnicians";
import HomeApplianceTechnicians from "layouts/homeApplianceTechnicians";
import Painters from "layouts/painters";
import BabySitters from "layouts/babySitters";
import Carpenters from "layouts/carpenters";
import Masons from "layouts/masons";
import Welders from "layouts/welders";
import Electricians from "layouts/electricians";
import SosDriver from "layouts/sosDriver";
import Houses from "layouts/houses";
import HousesAdmin from "layouts/housesAdmin";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import ResetPassword from "layouts/authentication/reset-password/cover";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "DashboardAdmin",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/DashboardAdmin",
    component: <DashboardAdmin />,
    roles: ["ROLE_ADMIN"],
  },
  {
    type: "",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard/",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Admins",
    key: "TablesAdmin",
    icon: <Icon fontSize="small">admin_panel_settings</Icon>,
    route: "/TablesAdmin",
    component: <TablesAdmin />,
    roles: ["ROLE_ADMIN"],
  },
  {
    type: "collapse",
    name: "Users",
    key: "TablesUser",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/TablesUser",
    component: <TablesUser />,
    roles: ["ROLE_ADMIN"],
  },
  {
    type: "collapse",
    name: "Handymans",
    key: "TablesHandyman",
    icon: <Icon fontSize="small">handyman</Icon>,
    route: "/TablesHandyman",
    component: <TablesHandyman />,
    roles: ["ROLE_ADMIN"],
  },
  {
    type: "collapse",
    name: "Propretyowners",
    key: "TablesPropertyowner",
    icon: <Icon fontSize="small">house</Icon>,
    route: "/TablesPropertyowner",
    component: <TablesPropertyowner />,
    roles: ["ROLE_ADMIN"],
  },
  {
    type: "collapse",
    name: "Houses",
    key: "HousesAdmin",
    icon: <Icon fontSize="small">apartment</Icon>,
    route: "/HousesAdmin",
    component: <HousesAdmin />,
    roles: ["ROLE_ADMIN"],
  },
  {
    type: "",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "",
    name: "RTL",
    key: "rtl",
    icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    route: "/rtl",
    component: <RTL />,
  },
  {
    type: "",
    name: "Payment",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "ProfileAdmin",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/ProfileAdmin",
    component: <ProfileAdmin />,
    roles: ["ROLE_ADMIN"],
  },
  {
    type: "",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    roles: ["ROLE_USER", "ROLE_PROPERTYOWNER", "ROLE_HANDYMAN"],
  },
  {
    type: "collapse",
    name: "Posts",
    key: "PostsAdmin",
    icon: <Icon fontSize="small">list</Icon>,
    route: "/PostsAdmin",
    component: <PostsAdmin />,
    roles: ["ROLE_ADMIN"],
  },
  {
    type: "",
    name: "Posts",
    key: "Posts",
    icon: <Icon fontSize="small">list</Icon>,
    route: "/posts",
    component: <Posts />,
  },
  {
    type: "",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "",
    name: "Gardners",
    key: "Gardners",
    icon: <Icon fontSize="small">yard</Icon>,
    route: "/gardners",
    component: <Gardners />,
  },
  {
    type: "",
    name: "Plumbers",
    key: "plumbers",
    icon: <Icon fontSize="small">plumbing</Icon>,
    route: "/plumbers",
    component: <Plumbers />,
  },
  {
    type: "",
    name: "Electricians",
    key: "Electricians",
    icon: <Icon fontSize="small">electric_bolt</Icon>,
    route: "/electricians",
    component: <Electricians />,
  },
  {
    type: "",
    name: "HouseKeepers",
    key: "HouseKeepers",
    icon: <Icon fontSize="small">electric_bolt</Icon>,
    route: "/houseKeepers",
    component: <HouseKeepers />,
  },
  {
    type: "",
    name: "RefrigerationTechnicians",
    key: "RefrigerationTechnicians",
    icon: <Icon fontSize="small">electric_bolt</Icon>,
    route: "/refrigerationTechnicians",
    component: <RefrigerationTechnicians />,
  },
  {
    type: "",
    name: "HomeApplianceTechnicians",
    key: "HomeApplianceTechnicians",
    icon: <Icon fontSize="small">local_laundry_service</Icon>,
    route: "/homeApplianceTechnicians",
    component: <HomeApplianceTechnicians />,
  },
  {
    type: "",
    name: "Painters",
    key: "Painters",
    icon: <Icon fontSize="small">format_paint</Icon>,
    route: "/painters",
    component: <Painters />,
  },
  {
    type: "",
    name: "BabySitters",
    key: "BabySitters",
    icon: <Icon fontSize="small">format_paint</Icon>,
    route: "/babySitters",
    component: <BabySitters />,
  },
  {
    type: "",
    name: "Carpenters",
    key: "Carpenters",
    icon: <Icon fontSize="small">format_paint</Icon>,
    route: "/carpenters",
    component: <Carpenters />,
  },
  {
    type: "",
    name: "Masons",
    key: "Masons",
    icon: <Icon fontSize="small">format_paint</Icon>,
    route: "/masons",
    component: <Masons />,
  },
  {
    type: "",
    name: "Welders",
    key: "Welders",
    icon: <Icon fontSize="small">format_paint</Icon>,
    route: "/welders",
    component: <Welders />,
  },
  {
    type: "",
    name: "SosDriver",
    key: "SosDriver",
    icon: <Icon fontSize="small">format_paint</Icon>,
    route: "/sosDriver",
    component: <SosDriver />,
  },
  {
    type: "",
    name: "Houses",
    key: "Houses",
    icon: <Icon fontSize="small">format_paint</Icon>,
    route: "/houses",
    component: <Houses />,
  },
  {
    type: "",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "",
    name: "ResetPassword",
    key: "ResetPassword",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/ResetPassword",
    component: <ResetPassword />,
  },
];

export default routes;
