import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/sign_in_image.jpg";

function Basic() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [requestError, setRequestError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    setRequestError("");
    e.preventDefault();
    const data = { username, password };

    setLoading(true); // Start loading indicator

    try {
      const response = await fetch("/PI/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        const token = response.headers.get("jwt-Token");
        const role = result.role; // Assuming the role is returned in the response
        console.log("role signin ", role);

        // Store token and user info in sessionStorage and localStorage
        sessionStorage.clear();
        localStorage.clear();
        sessionStorage.setItem("jwt-Token", token);
        sessionStorage.setItem("connected-user", JSON.stringify(result));
        localStorage.setItem("connected-user", JSON.stringify(result));
        localStorage.setItem("role", role);
        localStorage.setItem("profile-image", result.profileImageUrl);

        // Role-based redirection
        if (role === "ROLE_PROPERTYOWNER" || role === "ROLE_HANDYMAN") {
          navigate("/profile");
        } else if (role === "ROLE_USER") {
          navigate("/dashboard");
        } else if (role === "ROLE_ADMIN") {
          navigate("/DashboardAdmin");
        } else {
          console.error("Unknown role:", role);
        }
      } else {
        const errorData = await response.json(); // Parse the response as JSON
        setRequestError(errorData.message);
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography></MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {requestError && (
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <MDTypography color="error" variant="caption" style={{ fontSize: "1rem" }}>
                {requestError}
              </MDTypography>
            </div>
          )}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading} // Disable input when loading
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading} // Disable input when loading
              />
            </MDBox>
            {/* Removed Remember Me switch */}
            <MDBox mt={4} mb={1} position="relative">
              <MDButton
                type="submit"
                variant="gradient"
                color="info"
                fullWidth
                disabled={loading} // Disable button when loading
              >
                {loading ? "Signing in..." : "Sign in"}
              </MDButton>
            </MDBox>
            {loading && (
              <MDBox display="flex" justifyContent="center" mt={2}>
                <CircularProgress size={24} color="info" />
              </MDBox>
            )}
            <MDBox mt={3} mb={1} textAlign="center">
              <MDBox>
                <MDTypography variant="button" color="text">
                  Don&apos;t have an account?{" "}
                  <MDTypography
                    component={Link}
                    to="/authentication/sign-up"
                    variant="button"
                    color="info"
                    fontWeight="medium"
                    textGradient
                  >
                    Sign up
                  </MDTypography>
                </MDTypography>
              </MDBox>
              <MDTypography variant="button" color="text">
                Forgot your password?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/ResetPassword"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Reset password
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
