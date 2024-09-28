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
import Avatar from "@mui/material/Avatar";
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
  const location = useLocation();
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
    localStorage.removeItem("role");
    // Redirect to home or sign-in page
    navigate("/authentication/sign-in"); // Change the path as needed
  };

  const iconsStyle = {
    fontSize: "3rem", // Large icon size
    marginRight: "8px", // Space between icon and text
  };

  const activeStyle = {
    color: "#2881ea",
    // fontSize: "1.5rem",
    transform: "scale(1.1)",
  };

  const iconButtonStyle = {
    fontSize: "1.5rem",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "scale(1.1)", // Slightly enlarges the button on hover
    },
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
        <Avatar
          src={"/static/images/avatar/1.jpg"} // Fetched profile image
          sx={{
            width: 60,
            height: 60,
            marginLeft: 2,
            transition: "transform 0.3s ease-in-out", // Smooth transition for scaling
            "&:hover": {
              transform: "scale(1.2)", // Grows the avatar on hover
              cursor: "pointer", // Changes the cursor to pointer on hover
            },
          }}
          onClick={() => navigate("/dashboard")} // Navigates to home when clicked
        />

        {/* Centered Section: Icons and Text */}
        <MDBox
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexGrow={1}
          gap={5}
          sx={{ ml: 40 }}
        >
          {/* Conditional Rendering based on Token */}
          <Link to="/dashboard">
            <MDBox display="flex" alignItems="center">
              <IconButton
                sx={{
                  ...iconButtonStyle,
                  ...(location.pathname === "/dashboard" && activeStyle),
                }}
                size="large"
                disableRipple
              >
                <Icon sx={iconsStyle}>home</Icon>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1.25rem",
                    ...(location.pathname === "/dashboard" && activeStyle),
                  }}
                >
                  Home
                </Typography>
              </IconButton>
            </MDBox>
          </Link>

          {token ? ( // If token exists, show Profile and Posts
            <>
              <Link to="/profile">
                <MDBox display="flex" alignItems="center">
                  <IconButton
                    sx={{
                      ...iconButtonStyle,
                      ...(location.pathname === "/profile" && activeStyle),
                    }}
                    size="large"
                    disableRipple
                  >
                    <Icon sx={iconsStyle}>account_circle</Icon>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1.25rem",
                        ...(location.pathname === "/profile" && activeStyle),
                      }}
                    >
                      Profile
                    </Typography>
                  </IconButton>
                </MDBox>
              </Link>

              <Link to="/posts">
                <MDBox display="flex" alignItems="center">
                  <IconButton
                    sx={{
                      ...iconButtonStyle,
                      ...(location.pathname === "/posts" && activeStyle),
                    }}
                    size="large"
                    disableRipple
                  >
                    <Icon sx={iconsStyle}>article</Icon>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1.25rem",
                        ...(location.pathname === "/posts" && activeStyle),
                      }}
                    >
                      Posts
                    </Typography>
                  </IconButton>
                </MDBox>
              </Link>

              <MDBox display="flex" alignItems="center">
                <IconButton
                  sx={iconButtonStyle}
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
                  <IconButton
                    sx={{
                      ...iconButtonStyle,
                      ...(location.pathname === "/authentication/sign-in" && activeStyle),
                    }}
                    size="large"
                    disableRipple
                  >
                    <Icon sx={iconsStyle}>login</Icon>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1.25rem",
                        ...(location.pathname === "/authentication/sign-in" && activeStyle),
                      }}
                    >
                      Sign In
                    </Typography>
                  </IconButton>
                </MDBox>
              </Link>

              <Link to="/authentication/sign-up">
                <MDBox display="flex" alignItems="center">
                  <IconButton
                    sx={{
                      ...iconButtonStyle,
                      ...(location.pathname === "/authentication/sign-up" && activeStyle),
                    }}
                    size="large"
                    disableRipple
                  >
                    <Icon sx={iconsStyle}>person_add</Icon>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1.25rem",
                        ...(location.pathname === "/authentication/sign-up" && activeStyle),
                      }}
                    >
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
              sx={{
                width: "400px", // Default width
                transition: "width 0.3s ease-in-out", // Smooth transition
                "&:hover": {
                  width: "500px", // Width when hovered
                },
              }}
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
