import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import FormControlComponent from "examples/FormControl";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Placeholder images
import defaultImage from "assets/images/team-1.jpg";

function Electricians() {
  const [electricians, setElectricians] = useState([]);
  const [filteredElectricians, setFilteredElectricians] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedElectrician, setSelectedElectrician] = useState(null); // State for dialog

  // Fetch Electricians data
  useEffect(() => {
    fetch("http://localhost:8089/PI/handymen/electrician")
      .then((response) => response.json())
      .then((data) => {
        setElectricians(data);
        setFilteredElectricians(data);
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

  // Handle city selection
  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);

    if (city) {
      const filtered = electricians.filter((electrician) => electrician.city === city);
      setFilteredElectricians(filtered);
    } else {
      setFilteredElectricians(electricians);
    }
  };

  // Handle dialog open
  const handleOpenDialog = (electrician) => {
    setSelectedElectrician(electrician); // Set selected electrician data
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setSelectedElectrician(null); // Close dialog
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} px={3}>
        <MDTypography variant="h4" fontWeight="medium">
          Electricians List
        </MDTypography>
        <MDBox mt={3} mb={1}>
          <Divider />
        </MDBox>
        <MDBox mb={3}>
          <FormControlComponent
            label="Filter by City"
            value={selectedCity}
            onChange={handleCityChange}
            items={cities}
          />
          <MDBox mt={3}>
            <Grid container spacing={6}>
              {filteredElectricians.map((electrician, index) => (
                <Grid item xs={12} md={6} xl={2} key={electrician.userId || index}>
                  <DefaultProjectCard
                    image={electrician.profileImageUrl || defaultImage}
                    label={`Electrician #${index + 1}`}
                    title={`${electrician.firstName} ${electrician.lastName}`}
                    description={`Expertise: ${electrician.expertise}`}
                    handymanUsername={electrician.username}
                    phoneNumber={electrician.phoneNumber}
                    city={`City : ${electrician.city}`}
                    onClick={() => handleOpenDialog(electrician)} // Open dialog on card click
                  />
                </Grid>
              ))}
            </Grid>
          </MDBox>
        </MDBox>

        {/* Dialog for handyman details */}
        {selectedElectrician && (
          <Dialog open={Boolean(selectedElectrician)} onClose={handleCloseDialog}>
            <DialogTitle>{`${selectedElectrician.firstName} ${selectedElectrician.lastName}`}</DialogTitle>
            <DialogContent>
              <MDTypography variant="body1">
                Expertise: {selectedElectrician.expertise}
              </MDTypography>
              <MDTypography variant="body1"> City: {selectedElectrician.city} </MDTypography>
              <MDTypography variant="body1">
                Contact: {selectedElectrician.phoneNumber}
              </MDTypography>
              {/* Add more details here as needed */}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default Electricians;
