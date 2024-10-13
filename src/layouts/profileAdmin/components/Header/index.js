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
import Dialog from "@mui/material/Dialog"; // Import Dialog
import DialogActions from "@mui/material/DialogActions"; // Import DialogActions
import DialogContent from "@mui/material/DialogContent"; // Import DialogContent
import DialogContentText from "@mui/material/DialogContentText"; // Import DialogContentText
import DialogTitle from "@mui/material/DialogTitle"; // Import DialogTitle
import Button from "@mui/material/Button"; // Import Button
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import burceMars from "assets/images/bruce-mars.jpg";
import backgroundImage from "assets/images/bg-profile.jpeg";

function Header({ children, refresh }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false); // Dialog open state
  const [requestLoading, setRequestLoading] = useState(false); // For tracking loading state during request
  const [error, setError] = useState(null); // For tracking request error

  const navigate = useNavigate(); // Initialize useNavigate

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

  useEffect(() => {
    fetchProfile();
  }, [refresh]);

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

  const handleOpenDialog = () => {
    setError(null); // Clear previous errors
    setOpenDialog(true); // Open confirmation dialog
  };

  const handleCloseDialog = () => {
    if (!requestLoading) {
      // Prevent closing while the request is in progress
      setOpenDialog(false); // Close confirmation dialog
    }
  };

  const handleResetPassword = async () => {
    setRequestLoading(true); // Set loading to true before request starts
    setError(null); // Clear previous errors

    try {
      const response = await fetch(`/PI/resetPassword/${profile.email}`, {
        method: "GET",
      });

      if (response.ok) {
        console.log("Password reset request sent");
        setOpenDialog(false); // Close dialog on success
      } else {
        throw new Error("Failed to reset password");
      }
    } catch (error) {
      setError("Error resetting password. Please try again."); // Set error message
      console.error("Error resetting password:", error);
    } finally {
      setRequestLoading(false); // Stop loading after the request finishes
    }
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
              src={`${profile.profileImageUrl}?${new Date().getTime()}`}
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
          <Grid item xs={12} md={6} lg={2} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="Reset Password"
                  onClick={handleOpenDialog} // Show dialog on click
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      lock_reset
                    </Icon>
                  }
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
        {children}
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          {requestLoading ? (
            <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress size={50} />
            </MDBox> // Show loading spinner during request
          ) : (
            <DialogContentText>
              {error
                ? error // Show error message if request failed
                : `An email will be sent to ${profile?.email} with your new password. Are you sure you want to continue ?`}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          {!requestLoading && (
            <>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleResetPassword} color="primary" autoFocus>
                Confirm
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
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
  refresh: PropTypes.bool,
};

export default Header;
