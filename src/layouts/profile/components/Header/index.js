import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Updated import

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import burceMars from "assets/images/bruce-mars.jpg";
import backgroundImage from "assets/images/bg-profile.jpeg";

function Header({ children }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem("jwt-Token") || localStorage.getItem("jwt-Token");
      console.log("Token:", token); // Debug: Check if token is retrieved

      if (token) {
        try {
          const response = await fetch("/PI/connected-user", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          console.log("Profile fetch response:", response); // Debug: Check response

          if (response.ok) {
            const data = await response.json();
            console.log("Profile data:", data); // Debug: Check profile data
            setProfile(data);
          } else {
            console.error("Failed to fetch profile");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        console.warn("No token found in localStorage");
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const handleLogout = () => {
    localStorage.removeItem("jwt-Token");
    sessionStorage.removeItem("jwt-Token");
    navigate("/authentication/sign-in"); // Redirect to login page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <MDAvatar
              src={`/PI/image/profile/${profile.username}`}
              alt="profile-image"
              size="xxl"
              shadow="sm"
            />
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              {profile && (
                <>
                  <MDTypography variant="h5" fontWeight="medium">
                    {`${profile.firstName} ${profile.lastName}`}
                  </MDTypography>
                  <MDTypography variant="button" color="text" fontWeight="regular">
                    {profile.email}
                  </MDTypography>
                </>
              )}
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="App"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      home
                    </Icon>
                  }
                />
                <Tab
                  label="Message"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      email
                    </Icon>
                  }
                />
                <Tab
                  label="Settings"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      settings
                    </Icon>
                  }
                />
                <Tab
                  label="Log Out"
                  onClick={handleLogout} // Add onClick handler
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      logout
                    </Icon>
                  }
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
