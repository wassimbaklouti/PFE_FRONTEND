import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import PersonIcon from "@mui/icons-material/Person";
import HandymanIcon from "@mui/icons-material/Handyman";
import HomeIcon from "@mui/icons-material/Home";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const GEO_NAMES_USERNAME = "bakloutiwassim";

function Cover() {
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    city: "",
    expertise: "",
    role: "ROLE_USER",
    dateDeb: "", // Start date field for handyman
    dateFin: "", // End date field for handyman
  });

  const [formType, setFormType] = useState("user");
  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [requestError, setRequestError] = useState("");

  const navigate = useNavigate();

  const fetchCities = async () => {
    try {
      const response = await fetch(
        `http://api.geonames.org/searchJSON?country=TN&featureClass=P&maxRows=1000&username=${GEO_NAMES_USERNAME}`
      );
      const result = await response.json();
      const cityNames = result.geonames.map((city) => city.name);
      setCities(cityNames);
    } catch (error) {
      console.error("Error fetching city names:", error);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear the error on change
    setRequestError("");
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Check for empty fields
    Object.keys(newUser).forEach((key) => {
      if (newUser[key] === "" && key !== "expertise" && key !== "dateDeb" && key !== "dateFin") {
        newErrors[key] = `${key} is required`;
        valid = false;
      }
    });

    if (formType === "handyman") {
      if (newUser.expertise === "") {
        newErrors.expertise = "Expertise is required for handymen";
        valid = false;
      }
      if (newUser.dateDeb === "" || newUser.dateFin === "") {
        newErrors.dateDeb = "Start time is required";
        newErrors.dateFin = "End time is required";
        valid = false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    // Phone number validation (8-13 digits)
    const phoneRegex = /^\d{8,13}$/;
    if (!phoneRegex.test(newUser.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 8-13 digits long";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return; // Stop form submission if validation fails

    let role;
    if (formType === "user") {
      role = "ROLE_USER";
    } else if (formType === "propertyOwner") {
      role = "ROLE_PROPERTYOWNER";
    } else if (formType === "handyman") {
      role = "ROLE_HANDYMAN";
    }

    const data = {
      ...newUser,
      role,
      datetravail: {
        dateDeb: newUser.dateDeb, // Pass the start time
        dateFin: newUser.dateFin, // Pass the end time
      },
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
        navigate("/authentication/sign-in"); // Redirect to Sign In page
      } else {
        const errorData = await response.json(); // Parse the response as JSON
        setRequestError(errorData.message);
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setFormType(newValue);
    setNewUser({
      ...newUser,
      role: newValue === "handyman" ? "ROLE_HANDYMAN" : `ROLE_${newValue.toUpperCase()}`,
    });
    setErrors({});
    setRequestError("");
  };

  return (
    <>
      <DashboardNavbar />
      <CoverLayout image={bgImage}>
        <Card sx={{ width: "150%", maxWidth: "800px", mx: "auto", marginLeft: "-110px" }}>
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
              <Tabs
                value={formType}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="info"
                centered
                sx={{ width: "100%" }}
              >
                <Tab label="User" value="user" icon={<PersonIcon />} iconPosition="start" />
                <Tab
                  label="Handyman"
                  value="handyman"
                  icon={<HandymanIcon />}
                  iconPosition="start"
                />
                <Tab
                  label="Property Owner"
                  value="propertyOwner"
                  icon={<HomeIcon />}
                  iconPosition="start"
                />
              </Tabs>
            </MDBox>
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
                  label="First Name"
                  name="firstName"
                  variant="standard"
                  fullWidth
                  onChange={onChangeInput}
                  value={newUser.firstName}
                  error={!!errors.firstName}
                />
                {errors.firstName && (
                  <MDTypography color="error" variant="caption">
                    {errors.firstName}
                  </MDTypography>
                )}
              </MDBox>

              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Last Name"
                  name="lastName"
                  variant="standard"
                  fullWidth
                  onChange={onChangeInput}
                  value={newUser.lastName}
                  error={!!errors.lastName}
                />
                {errors.lastName && (
                  <MDTypography color="error" variant="caption">
                    {errors.lastName}
                  </MDTypography>
                )}
              </MDBox>

              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="User Name"
                  name="username"
                  variant="standard"
                  fullWidth
                  onChange={onChangeInput}
                  value={newUser.username}
                  error={!!errors.username}
                />
                {errors.username && (
                  <MDTypography color="error" variant="caption">
                    {errors.username}
                  </MDTypography>
                )}
              </MDBox>

              <MDBox mb={2}>
                <MDInput
                  type="email"
                  label="Email"
                  name="email"
                  variant="standard"
                  fullWidth
                  onChange={onChangeInput}
                  value={newUser.email}
                  error={!!errors.email}
                />
                {errors.email && (
                  <MDTypography color="error" variant="caption">
                    {errors.email}
                  </MDTypography>
                )}
              </MDBox>

              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Phone Number"
                  name="phoneNumber"
                  variant="standard"
                  fullWidth
                  onChange={onChangeInput}
                  value={newUser.phoneNumber}
                  error={!!errors.phoneNumber}
                />
                {errors.phoneNumber && (
                  <MDTypography color="error" variant="caption">
                    {errors.phoneNumber}
                  </MDTypography>
                )}
              </MDBox>

              <MDBox mb={2}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel>City</InputLabel>
                  <Select
                    label="City"
                    name="city"
                    onChange={onChangeInput}
                    value={newUser.city}
                    error={!!errors.city}
                  >
                    {cities.map((cityName) => (
                      <MenuItem key={cityName} value={cityName}>
                        {cityName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.city && (
                    <MDTypography color="error" variant="caption">
                      {errors.city}
                    </MDTypography>
                  )}
                </FormControl>
              </MDBox>

              {formType === "handyman" && (
                <MDBox mb={2}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel>Expertise</InputLabel>
                    <Select
                      label="Expertise"
                      name="expertise"
                      onChange={onChangeInput}
                      value={newUser.expertise}
                      error={!!errors.expertise}
                    >
                      <MenuItem value="electrician">Electricity</MenuItem>
                      <MenuItem value="plumber">Plumbing</MenuItem>
                      <MenuItem value="painter">Painting</MenuItem>
                      <MenuItem value="gardner">Gardening</MenuItem>
                      <MenuItem value="houseKeeper">Housekeeping</MenuItem>
                      <MenuItem value="refrigerationTechnician">Refrigeration Services</MenuItem>
                      <MenuItem value="homeApplianceTechnician">Home Appliance Repair</MenuItem>
                      <MenuItem value="mason">masonry</MenuItem>
                      <MenuItem value="carpenter">carpentry</MenuItem>
                      <MenuItem value="welder">welding</MenuItem>
                      <MenuItem value="sosDriver">SOS Serice</MenuItem>
                    </Select>
                    {errors.expertise && (
                      <MDTypography color="error" variant="caption">
                        {errors.expertise}
                      </MDTypography>
                    )}
                  </FormControl>
                  <>
                    <MDBox mb={2}>
                      <MDInput
                        type="time"
                        label="Work Start Time"
                        name="dateDeb"
                        variant="standard"
                        fullWidth
                        onChange={onChangeInput}
                        value={newUser.dateDeb}
                        error={!!errors.dateDeb}
                      />
                      {errors.dateDeb && (
                        <MDTypography color="error" variant="caption">
                          {errors.dateDeb}
                        </MDTypography>
                      )}
                    </MDBox>

                    <MDBox mb={2}>
                      <MDInput
                        type="time"
                        label="Work End Time"
                        name="dateFin"
                        variant="standard"
                        fullWidth
                        onChange={onChangeInput}
                        value={newUser.dateFin}
                        error={!!errors.dateFin}
                      />
                      {errors.dateFin && (
                        <MDTypography color="error" variant="caption">
                          {errors.dateFin}
                        </MDTypography>
                      )}
                    </MDBox>
                  </>
                </MDBox>
              )}

              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" type="submit" fullWidth>
                  Sign Up
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </CoverLayout>
    </>
  );
}

export default Cover;
