import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// @mui material components
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/sign_in_image.jpg";

function Cover() {
  const [email, setEmail] = useState(""); // State for email input
  const [loading, setLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(""); // Error state
  const navigate = useNavigate(); // Hook to navigate back to login page

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear any previous error messages

    try {
      const response = await fetch(`/PI/resetPassword/${email}`, {
        method: "GET",
      });

      if (response.ok) {
        // If the request is successful, navigate to the login page
        navigate("/authentication/sign-in");
      } else {
        throw new Error("Failed to reset password");
      }
    } catch (error) {
      setErrorMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
            Reset Password
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            You will receive an e-mail with your new credentials in maximum 60 seconds
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={4}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Capture input value
                required
              />
            </MDBox>
            {loading ? (
              <MDBox display="flex" justifyContent="center" alignItems="center" height="100px">
                <CircularProgress size={50} />
              </MDBox>
            ) : (
              <MDBox mt={6} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth type="submit">
                  reset
                </MDButton>
              </MDBox>
            )}
            {errorMessage && (
              <MDTypography variant="button" color="error" textAlign="center">
                {errorMessage}
              </MDTypography>
            )}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Cover;
