import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

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
import { DateRangePicker } from "react-dates";
import "react-dates/initialize"; // Ensure styles are initialized
import "react-dates/lib/css/_datepicker.css"; // Import CSS for date picker

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

  const [entryDate, setEntryDate] = useState(null);
  const [exitDate, setExitDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  const role = localStorage.getItem("role");

  const [cities, setCities] = useState([]);

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
  }, []);

  // Handle filtering logic
  useEffect(() => {
    const filterHouses = async () => {
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

      if (entryDate && exitDate) {
        // Date range conflict check
        const availableHouses = [];
        for (let house of updatedHouses) {
          const isAvailable = await checkReservationConflict(house);
          if (isAvailable) {
            availableHouses.push(house);
          }
        }
        updatedHouses = availableHouses;
      }

      setFilteredHouses(updatedHouses);
    };

    filterHouses();
  }, [type, rooms, price, area, houses, city, entryDate, exitDate]);

  const checkReservationConflict = async (house) => {
    try {
      const response = await fetch(`/PI/api/buildings/${house.id}/check-reservation-conflict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryDate, exitDate }),
      });

      if (!response.ok) {
        return false; // Conflict exists
      }
      return true; // No conflict
    } catch (error) {
      console.error("Error checking reservation conflict:", error);
      return false; // Assume conflict in case of error
    }
  };

  return (
    <DashboardLayout>
      {role !== "ROLE_ADMIN" && <DashboardNavbar />}
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
                    height: "44px",
                    borderRadius: "5px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d2d6da",
                  },
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="house">House</MenuItem>
                <MenuItem value="appartement">Appartement</MenuItem>
                <MenuItem value="flat">Flat</MenuItem>
                <MenuItem value="villa">villa</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={2}>
              <Autocomplete
                options={cities}
                getOptionLabel={(option) => option}
                value={city}
                onChange={(e, newValue) => setCity(newValue)}
                renderInput={(params) => <TextField {...params} label="City" fullWidth />}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "44px",
                    borderRadius: "5px",
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

            {/* Date Range Picker */}
            <Grid item xs={12} md={2}>
              <MDBox
                sx={{
                  "& .DateRangePicker": {
                    width: "100%",
                    height: "44px",
                    backgroundColor: "#f0f2f5",
                    borderRadius: "5px",
                    "& .DateInput_input": {
                      height: "44px",
                      padding: "10px",
                      borderRadius: "5px",
                      borderColor: "#d2d6da",
                      backgroundColor: "#f0f2f5",
                      // color: "#f0f2f5",
                    },
                    "& .DateInput_input__focused": {
                      borderColor: "#d2d6da",
                    },
                    "& .DateRangePickerInput": {
                      display: "flex",
                      alignItems: "center",
                      height: "44px",
                      backgroundColor: "#f0f2f5",
                      borderColor: "#d2d6da",
                    },
                  },
                }}
              >
                <DateRangePicker
                  startDate={entryDate}
                  startDateId="entry_date_id"
                  endDate={exitDate}
                  endDateId="exit_date_id"
                  onDatesChange={({ startDate, endDate }) => {
                    setEntryDate(startDate);
                    setExitDate(endDate);
                  }}
                  focusedInput={focusedInput}
                  onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
                  displayFormat="DD/MM/YYYY"
                  numberOfMonths={1}
                  isOutsideRange={() => false}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* Display filtered houses */}
        <MDBox mt={7}>
          <Grid container spacing={6}>
            {filteredHouses.map((house) => (
              <Grid item xs={12} md={6} xl={4} key={house.id}>
                <Elements stripe={stripePromise}>
                  <BuildingCardFeed building={house} />
                </Elements>
              </Grid>
            ))}
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Houses;
