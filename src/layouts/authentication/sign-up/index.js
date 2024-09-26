import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

const GEO_NAMES_USERNAME = "bakloutiwassim";

function Cover() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [expertise, setExpertise] = useState("");
  const [formType, setFormType] = useState("user");

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          `http://api.geonames.org/searchJSON?country=TN&featureClass=P&maxRows=1000&username=${GEO_NAMES_USERNAME}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        const cityNames = result.geonames.map((city) => city.name);
        setCities(cityNames);
      } catch (error) {
        console.error("Error fetching city names:", error);
      }
    };

    fetchCities();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let role;
    if (formType === "user") {
      role = "ROLE_USER";
    } else if (formType === "propertyOwner") {
      role = "ROLE_PROPERTYOWNER";
    } else if (formType === "handyman") {
      role = "ROLE_HANDYMAN";
    }

    const data = {
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      city,
      role,
      expertise, // Set to null if not handyman
    };

    try {
      const response = await fetch("/PI/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        navigate("/authentication/sign-in"); // Redirect to Sign In page
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter information to register and you will get your credentials in an email
          </MDTypography>

          {/* Role Selection Buttons */}
          <MDBox display="flex" justifyContent="center" mt={2}>
            <MDButton
              variant={formType === "user" ? "contained" : "outlined"}
              color="info"
              onClick={() => setFormType("user")}
            >
              User
            </MDButton>
            <MDButton
              variant={formType === "handyman" ? "contained" : "outlined"}
              color="info"
              onClick={() => setFormType("handyman")}
              ml={2}
            >
              Handyman
            </MDButton>
            <MDButton
              variant={formType === "propertyOwner" ? "contained" : "outlined"}
              color="info"
              onClick={() => setFormType("propertyOwner")}
              ml={2}
            >
              Property Owner
            </MDButton>
          </MDBox>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="First Name"
                variant="standard"
                fullWidth
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Last Name"
                variant="standard"
                fullWidth
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="User Name"
                variant="standard"
                fullWidth
                onChange={(e) => setUserName(e.target.value)}
                value={username}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Phone Number"
                variant="standard"
                fullWidth
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
              />
            </MDBox>
            <MDBox mb={2}>
              <FormControl variant="standard" fullWidth>
                <InputLabel>City</InputLabel>
                <Select label="City" onChange={(e) => setCity(e.target.value)} value={city}>
                  {cities.map((cityName) => (
                    <MenuItem key={cityName} value={cityName}>
                      {cityName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>

            {/* Conditionally Render Expertise Field for Handyman */}
            {formType === "handyman" && (
              <MDBox mb={2}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel>Expertise</InputLabel>
                  <Select
                    label="Expertise"
                    onChange={(e) => setExpertise(e.target.value)}
                    value={expertise}
                  >
                    <MenuItem value="plumber">Plumber</MenuItem>
                    <MenuItem value="electrician">Electrician</MenuItem>
                    <MenuItem value="gardner">Gardener</MenuItem>
                    <MenuItem value="houseKeeper">HouseKeeper</MenuItem>
                    <MenuItem value="refrigerationTechnician">refrigerationTechnician</MenuItem>
                    <MenuItem value="homeApplianceTechnician">homeApplianceTechnician</MenuItem>
                    <MenuItem value="mason">mason</MenuItem>
                    <MenuItem value="carpenter">carpenter</MenuItem>
                    <MenuItem value="painter">painter</MenuItem>
                    <MenuItem value="welder">welder</MenuItem>
                  </Select>
                </FormControl>
              </MDBox>
            )}

            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree to the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                Sign Up
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
