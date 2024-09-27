import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import { navbar, navbarContainer, navbarIconButton } from "examples/Navbars/DashboardNavbar/styles";
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, darkMode } = controller;
  const navigate = useNavigate();
  const token = sessionStorage.getItem("jwt-Token") || localStorage.getItem("jwt-Token");

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  const handleLogout = () => {
    // Clear the token from storage
    sessionStorage.removeItem("jwt-Token");
    localStorage.removeItem("jwt-Token");
    // Redirect to home or sign-in page
    navigate("/authentication/sign-in"); // Change the path as needed
  };

  const iconsStyle = {
    fontSize: "3rem", // Large icon size
    marginRight: "8px", // Space between icon and text
  };

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar
        sx={(theme) => navbarContainer(theme)}
        display="flex"
        justifyContent="space-between" // Align icons in the center and search field to the right
        alignItems="center"
      >
        {/* Centered Section: Icons and Text */}
        <MDBox
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexGrow={1}
          gap={5}
          sx={{ ml: 45 }}
        >
          {/* Conditional Rendering based on Token */}
          <Link to="/dashboard">
            <MDBox display="flex" alignItems="center">
              <IconButton sx={navbarIconButton} size="large" disableRipple>
                <Icon sx={iconsStyle}>home</Icon>
                <Typography variant="h6" sx={{ fontSize: "1.25rem" }}>
                  Home
                </Typography>
              </IconButton>
            </MDBox>
          </Link>

          {token ? ( // If token exists, show Profile and Posts
            <>
              <Link to="/profile">
                <MDBox display="flex" alignItems="center">
                  <IconButton sx={navbarIconButton} size="large" disableRipple>
                    <Icon sx={iconsStyle}>account_circle</Icon>
                    <Typography variant="h6" sx={{ fontSize: "1.25rem" }}>
                      Profile
                    </Typography>
                  </IconButton>
                </MDBox>
              </Link>

              <Link to="/posts">
                <MDBox display="flex" alignItems="center">
                  <IconButton sx={navbarIconButton} size="large" disableRipple>
                    <Icon sx={iconsStyle}>article</Icon>
                    <Typography variant="h6" sx={{ fontSize: "1.25rem" }}>
                      Posts
                    </Typography>
                  </IconButton>
                </MDBox>
              </Link>

              <MDBox display="flex" alignItems="center">
                <IconButton
                  sx={navbarIconButton}
                  size="large"
                  disableRipple
                  onClick={handleLogout} // Attach logout handler
                >
                  <Icon sx={iconsStyle}>logout</Icon>
                  <Typography variant="h6" sx={{ fontSize: "1.25rem" }}>
                    Logout
                  </Typography>
                </IconButton>
              </MDBox>
            </>
          ) : (
            <>
              <Link to="/authentication/sign-in">
                <MDBox display="flex" alignItems="center">
                  <IconButton sx={navbarIconButton} size="large" disableRipple>
                    <Icon sx={iconsStyle}>login</Icon>
                    <Typography variant="h6" sx={{ fontSize: "1.25rem" }}>
                      Sign In
                    </Typography>
                  </IconButton>
                </MDBox>
              </Link>

              <Link to="/authentication/sign-up">
                <MDBox display="flex" alignItems="center">
                  <IconButton sx={navbarIconButton} size="large" disableRipple>
                    <Icon sx={iconsStyle}>person_add</Icon>
                    <Typography variant="h6" sx={{ fontSize: "1.25rem" }}>
                      Sign Up
                    </Typography>
                  </IconButton>
                </MDBox>
              </Link>
            </>
          )}
        </MDBox>

        {/* Search Field: Positioned to the right */}
        {!isMini && (
          <MDBox sx={{ marginLeft: "auto" }}>
            <MDInput
              label="Search here"
              sx={{ width: "400px" }} // Widened search field
            />
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
