import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import FormControlComponent from "examples/FormControl";
import Footer from "examples/Footer";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Placeholder images
import defaultImage from "assets/images/team-1.jpg"; // Default image
import axios from "axios"; // Ensure axios is imported

function Carpenters() {
  const [carpenters, setCarpenters] = useState([]);
  const [filteredCarpenters, setFilteredCarpenters] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRating, setSelectedRating] = useState(""); // State to hold the selected rating
  const role = localStorage.getItem("role");

  // Fetch carpenters data
  useEffect(() => {
    fetch("http://localhost:8089/PI/handymen/carpenter")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Carpenters data:", data);
        // Fetch ratings for each carpenter after fetching their data
        const carpentersWithRatings = data.map(async (carpenter) => {
          const rating = await fetchOverallRating(carpenter.username);
          return { ...carpenter, rating };
        });
        Promise.all(carpentersWithRatings).then((results) => {
          setCarpenters(results);
          setFilteredCarpenters(results);
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  // Fetch cities data
  useEffect(() => {
    fetch(
      "http://api.geonames.org/searchJSON?country=TN&featureClass=P&maxRows=1000&username=bakloutiwassim"
    )
      .then((response) => response.json())
      .then((data) => {
        const citiesList = data.geonames.map((city) => city.name);
        setCities(citiesList);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  // Fetch overall rating
  const fetchOverallRating = async (handymanUsername) => {
    try {
      const response = await axios.get(`/PI/ratings/overall?handymanUsername=${handymanUsername}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching overall rating:", error);
      return 0; // Return 0 if there's an error
    }
  };

  // Handle city selection
  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    filterCarpenters(city, selectedRating); // Filter when the city changes
  };

  // Handle rating change
  const handleRatingChange = (event) => {
    const rating = event.target.value;
    setSelectedRating(rating);
    filterCarpenters(selectedCity, rating); // Filter when the rating changes
  };

  // Filter carpenters by city and rating
  const filterCarpenters = (city, rating) => {
    let filtered = carpenters;
    if (city) {
      filtered = filtered.filter((carpenter) => carpenter.city === city);
    }
    if (rating) {
      filtered = filtered.filter((carpenter) => carpenter.rating >= rating);
    }
    setFilteredCarpenters(filtered);
  };

  return (
    <DashboardLayout>
      {role !== "ROLE_ADMIN" && <DashboardNavbar />}
      <MDBox pt={6} px={3}>
        <MDTypography variant="h4" fontWeight="medium">
          Carpenters List
        </MDTypography>
        <MDBox mt={3} mb={1}>
          <Divider />
        </MDBox>
        <MDBox mb={3}>
          {/* Align dropdowns side by side and center */}
          <Grid container justifyContent="center" spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth sx={{ height: 50 }}>
                <InputLabel id="city-label">Filter by City</InputLabel>
                <Select
                  labelId="city-label"
                  id="city-select"
                  value={selectedCity}
                  onChange={handleCityChange}
                  sx={{ height: 50 }} // Ensure height matches
                >
                  <MenuItem value="">All Cities</MenuItem>
                  {cities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth sx={{ height: 50 }}>
                <InputLabel id="rating-label">Filter by Rating</InputLabel>
                <Select
                  labelId="rating-label"
                  id="rating-select"
                  value={selectedRating}
                  label="Filter by Rating"
                  onChange={handleRatingChange}
                  sx={{ height: 50 }} // Increase the height
                >
                  <MenuItem value={0}>0 and above</MenuItem>
                  <MenuItem value={1}>1 and above</MenuItem>
                  <MenuItem value={2}>2 and above</MenuItem>
                  <MenuItem value={3}>3 and above</MenuItem>
                  <MenuItem value={4}>4 and above</MenuItem>
                  <MenuItem value={5}>5 stars only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <MDBox mt={3}>
            <Grid container spacing={6}>
              {filteredCarpenters.map((carpenter, index) => (
                <Grid item xs={12} md={6} xl={2} key={carpenter.userId || index}>
                  <DefaultProjectCard
                    image={carpenter.profileImageUrl || defaultImage}
                    label={`Carpenter #${index + 1}`}
                    title={`${carpenter.firstName} ${carpenter.lastName}`}
                    description={`Expertise: ${carpenter.expertise}`}
                    handymanUsername={carpenter.username}
                    phoneNumber={carpenter.phoneNumber}
                    city={`City : ${carpenter.city}`}
                    dateDeb={`Work Start Time: ${carpenter.datetravail?.dateDeb || "N/A"}`}
                    dateFin={`Work end Time: ${carpenter.datetravail?.dateFin || "N/A"}`}
                    action={{
                      type: "internal",
                      route: `/pages/carpenters/carpenter-overview/${carpenter.userId}`,
                      color: "info",
                      label: "View Profile",
                    }}
                    authors={[
                      {
                        image: carpenter.profileImageUrl || defaultImage,
                        name: `${carpenter.firstName} ${carpenter.lastName}`,
                      },
                    ]}
                  />
                </Grid>
              ))}
            </Grid>
          </MDBox>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Carpenters;
