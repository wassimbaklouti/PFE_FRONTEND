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

function SosDrivers() {
  const [sosDrivers, setSosDrivers] = useState([]);
  const [filteredSosDrivers, setFilteredSosDrivers] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSosDriver, setSelectedSosDriver] = useState(null); // State for dialog
  const role = localStorage.getItem("role");
  // Fetch SosDrivers data
  useEffect(() => {
    fetch("http://localhost:8089/PI/handymen/sosDriver")
      .then((response) => response.json())
      .then((data) => {
        setSosDrivers(data);
        setFilteredSosDrivers(data);
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
      const filtered = sosDrivers.filter((sosDriver) => sosDriver.city === city);
      setFilteredSosDrivers(filtered);
    } else {
      setFilteredSosDrivers(sosDrivers);
    }
  };

  // Handle dialog open
  const handleOpenDialog = (sosDriver) => {
    setSelectedSosDriver(sosDriver); // Set selected sosDriver data
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setSelectedSosDriver(null); // Close dialog
  };

  return (
    <DashboardLayout>
      {role !== "ROLE_ADMIN" && <DashboardNavbar />}
      <MDBox pt={6} px={3}>
        <MDTypography variant="h4" fontWeight="medium">
          SosDrivers List
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
              {filteredSosDrivers.map((sosDriver, index) => (
                <Grid item xs={12} md={6} xl={2} key={sosDriver.userId || index}>
                  <DefaultProjectCard
                    image={sosDriver.profileImageUrl || defaultImage}
                    label={`sosDriver #${index + 1}`}
                    title={`${sosDriver.firstName} ${sosDriver.lastName}`}
                    description={`Expertise: ${sosDriver.expertise}`}
                    handymanUsername={sosDriver.username}
                    phoneNumber={sosDriver.phoneNumber}
                    city={`City : ${sosDriver.city}`}
                    dateDeb={`Work Start Time: ${sosDriver.datetravail?.dateDeb || "N/A"}`}
                    dateFin={`Work end Time: ${sosDriver.datetravail?.dateFin || "N/A"}`}
                    onClick={() => handleOpenDialog(sosDriver)} // Open dialog on card click
                  />
                </Grid>
              ))}
            </Grid>
          </MDBox>
        </MDBox>

        {/* Dialog for handyman details */}
        {selectedSosDriver && (
          <Dialog open={Boolean(selectedSosDriver)} onClose={handleCloseDialog}>
            <DialogTitle>{`${selectedSosDriver.firstName} ${selectedSosDriver.lastName}`}</DialogTitle>
            <DialogContent>
              <MDTypography variant="body1"> Expertise: {selectedSosDriver.expertise}</MDTypography>
              <MDTypography variant="body1"> City: {selectedSosDriver.city} </MDTypography>
              <MDTypography variant="body1">Contact: {selectedSosDriver.phoneNumber}</MDTypography>
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

export default SosDrivers;
