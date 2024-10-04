import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Sidenav from "examples/Sidenav";
import routes from "routes";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import Autocomplete from "@mui/material/Autocomplete";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import BuildingCardFeed from "examples/Cards/BuildingCardFeed/BuildingCardFeed";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Stripe components
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe with your public key
const stripePromise = loadStripe(
  "pk_test_51PzmNbIO7soUye2opH2QESx7qqHwXk2Peb5j4qNVvOP38dr42uFrq0ZQhASWpP959Z9gFLyUdQY7sgWe4VOaQW6C00hFofOjGk"
);

function Houses() {
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);

  // State for filters
  const [type, setType] = useState("");
  const [rooms, setRooms] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");

  const role = localStorage.getItem("role");

  const [cities, setCities] = useState([]);
  const [refrech, setRefrech] = useState(false);

  const handleRefrech = () => {
    if (refrech) {
      setRefrech(false);
    } else {
      setRefrech(true);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch(
        "http://api.geonames.org/searchJSON?country=TN&maxRows=500&username=bakloutiwassim"
      );
      const data = await response.json();
      if (data.geonames) {
        const cities = data.geonames.map((city) => city.name);
        setCities(cities);
      } else {
        console.error("No cities found");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Fetch Houses data
  useEffect(() => {
    fetch("http://localhost:8089/PI/api/buildings") // API endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Houses data:", data);
        setHouses(data);
        setFilteredHouses(data); // Initialize filtered houses with all data
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
    fetchCities();
  }, [refrech]);

  // Handle filtering logic
  useEffect(() => {
    const filterHouses = () => {
      let updatedHouses = houses;

      if (type) {
        updatedHouses = updatedHouses.filter((house) => house.type === type);
      }
      if (rooms) {
        updatedHouses = updatedHouses.filter((house) => house.rooms === parseInt(rooms));
      }
      if (price) {
        updatedHouses = updatedHouses.filter((house) => house.price <= parseInt(price));
      }
      if (area) {
        updatedHouses = updatedHouses.filter((house) => house.area >= parseInt(area));
      }
      if (city) {
        updatedHouses = updatedHouses.filter((house) => house.city === city);
      }

      setFilteredHouses(updatedHouses);
    };

    filterHouses();
  }, [type, rooms, price, area, houses, city, refrech]);

  return (
    <DashboardLayout>
      <Sidenav color={"info"} brandName="Admin Dashboard" routes={routes} />
      {/* <DashboardNavbar /> */}
      <MDBox justifyContent="flex-end" ml={33}>
        <MDBox pt={6} px={3}>
          <MDTypography variant="h4" fontWeight="medium">
            Houses List
          </MDTypography>
          <MDBox mt={3} mb={1}>
            <Divider />
          </MDBox>

          {/* Filters */}
          <MDBox mb={3}>
            <Grid container spacing={2} justifyContent="space-between">
              <Grid item xs={12} md={2}>
                <TextField
                  select
                  label="Type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "44px", // Adjust the height here
                      borderRadius: "5px", // Optional: Customize border radius
                    },
                    "& .MuiInputLabel-root": {
                      // top: "-5px", // Adjust label positioning if necessary
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d2d6da", // Optional: Customize border color
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="maison">Maison</MenuItem>
                  <MenuItem value="appartement">Appartement</MenuItem>
                  <MenuItem value="villa">Villa</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={2}>
                <Autocomplete
                  options={cities}
                  getOptionLabel={(option) => option}
                  value={city}
                  onChange={(e, newValue) => setCity(newValue)} // Fix the event handler
                  renderInput={(params) => <TextField {...params} label="City" fullWidth />}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "44px", // Adjust the height here
                      borderRadius: "5px", // Optional: Customize border radius
                    },
                    "& .MuiInputLabel-root": {
                      // top: "-5px", // Adjust label positioning if necessary
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d2d6da", // Optional: Customize border color
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Rooms"
                  type="number"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Max Price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Min Area"
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </MDBox>

          {/* Display filtered houses */}
          <MDBox mt={7}>
            <Grid container spacing={6}>
              {filteredHouses.map((house) => (
                <Grid item xs={12} md={6} xl={4} key={house.id}>
                  <Elements stripe={stripePromise}>
                    <BuildingCardFeed building={house} onDeletePost={handleRefrech} />
                  </Elements>
                </Grid>
              ))}
            </Grid>
          </MDBox>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Houses;
