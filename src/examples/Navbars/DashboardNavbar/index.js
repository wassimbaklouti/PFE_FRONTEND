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
  const profileimage = localStorage.getItem("profile-image");
  const [searchTerm, setSearchTerm] = useState(""); // État pour la recherche
  const [suggestions, setSuggestions] = useState([]); // État pour les suggestions d'autocomplétion
  const [isFocused, setIsFocused] = useState(false);
  const [blurTimer, setBlurTimer] = useState(null);

  const handleBlur = () => {
    // Set a timer for 3 seconds to set isFocused to false
    const timer = setTimeout(() => {
      setIsFocused(false);
    }, 3000);

    setBlurTimer(timer); // Save the timer ID
  };

  useEffect(() => {
    return () => {
      if (blurTimer) {
        clearTimeout(blurTimer);
      }
    };
  }, [blurTimer]);

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
    localStorage.removeItem("profile-image");
    localStorage.clear();
    sessionStorage.clear();
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

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.length > 2) {
      // Vous pouvez ajuster le seuil
      fetch(`http://localhost:8089/PI/handymen/search?username=${value}`)
        .then((response) => response.json())
        .then((data) => {
          const usernames = data.map((handyman) => handyman.username); // Remplacez par votre logique d'extraction
          setSuggestions(usernames);
        })
        .catch((error) => console.error("Erreur de recherche:", error));
    } else {
      setSuggestions([]); // Réinitialisez les suggestions si le champ est vide ou trop court
    }
  };

  const handleSuggestionClick = (username) => {
    console.log("hello wassim");
    setSearchTerm(username); // Mettez à jour le champ de recherche
    setSuggestions([]); // Réinitialisez les suggestions
    // Naviguez vers la page appropriée en fonction de l'expertise
    fetch(`http://localhost:8089/PI/handymen/${username}`)
      .then((response) => response.json())
      .then((data) => {
        const expertise = data.expertise; // Assurez-vous d'adapter cela à votre structure de données
        console.log("expertise :", expertise);
        navigate(`/${expertise}s?username=${username}`); // Redirigez vers la page d'expertise
      })
      .catch((error) => console.error("Erreur de récupération des données du handyman:", error));
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
          src={profileimage} // Fetched profile image
          sx={{
            width: 60,
            height: 60,
            marginLeft: 2,
            // border: "3px solid #fff", // Round frame with white border
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Shadow effect
            borderRadius: "50%", // Ensures the avatar stays round
            transition: "transform 0.3s ease-in-out", // Smooth transition for scaling
            "&:hover": {
              transform: "scale(1.2)", // Grows the avatar on hover
              cursor: "pointer", // Changes the cursor to pointer on hover
            },
          }}
          onClick={() => navigate("/profile")} // Navigates to home when clicked
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
              label="Search handyman here"
              sx={{
                width: "400px",
                transition: "width 0.3s ease-in-out",
                "&:hover": {
                  width: "500px",
                },
                "&:focus-within": {
                  width: "500px", // Maintains the hover width while typing
                },
              }}
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsFocused(true)} // Set focus to true
              onBlur={handleBlur} // Set focus to false
            />
            {isFocused && suggestions.length > 0 && (
              <MDBox
                sx={{
                  position: "absolute",
                  zIndex: 1000,
                  backgroundColor: "white",
                  boxShadow: 3,
                  width: "500px",
                  borderRadius: 1, // Optional: add border-radius for rounded corners
                  border: "1px solid lightgray",
                }}
              >
                {suggestions.map((username) => (
                  <MDBox
                    key={username}
                    sx={{
                      padding: 1,
                      cursor: "pointer",
                      width: "100%",
                      backgroundColor: "#f0f2f5",
                    }}
                    onClick={() => handleSuggestionClick(username)}
                  >
                    {username}
                  </MDBox>
                ))}
              </MDBox>
            )}
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
