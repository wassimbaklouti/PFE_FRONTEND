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
import defaultImage from "assets/images/team-1.jpg"; // Assurez-vous d'avoir une image par défaut

function BabySitters() {
  const [babySitters, setBabySitters] = useState([]);
  const [filteredBabySitters, setFilteredBabySitters] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const role = localStorage.getItem("role");

  // Fetch BabySitters data
  useEffect(() => {
    fetch("http://localhost:8089/PI/handymen/babySitter") // Votre endpoint API
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Conversion des données en JSON
      })
      .then((data) => {
        console.log("BabySitters data:", data); // Afficher les données dans la console
        setBabySitters(data); // Stockage des données des plombiers
        setFilteredBabySitters(data); // Initialise le filtre avec tous les plombiers
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

    // Filter BabySitters based on selected city
    if (city) {
      const filtered = babySitters.filter((babySitter) => babySitter.city === city);
      setFilteredBabySitters(filtered);
    } else {
      setFilteredBabySitters(babySitters);
    }
  };

  return (
    <DashboardLayout>
      {role !== "ROLE_ADMIN" && <DashboardNavbar />}
      <MDBox pt={6} px={3}>
        <MDTypography variant="h4" fontWeight="medium">
          BabySitters List
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
              {filteredBabySitters.map((babySitter, index) => (
                <Grid item xs={12} md={6} xl={2} key={babySitter.userId || index}>
                  <DefaultProjectCard
                    image={babySitter.profileImageUrl || defaultImage} // Utilise l'image du profil si disponible ou une image par défaut
                    label={`BabySitter #${index + 1}`}
                    title={`${babySitter.firstName} ${babySitter.lastName}`}
                    description={`Expertise: ${babySitter.expertise}`}
                    handymanUsername={babySitter.username}
                    phoneNumber={babySitter.phoneNumber}
                    city={`City : ${babySitter.city}`}
                    dateDeb={`Work Start Time: ${sosDriver.datetravail?.dateDeb || "N/A"}`}
                    dateFin={`Work end Time: ${sosDriver.datetravail?.dateFin || "N/A"}`}
                    action={{
                      type: "internal",
                      route: `/pages/babySitters/babySitter-overview/${babySitter.userId}`, // Met à jour le chemin avec l'ID du plombier
                      color: "info",
                      label: "View Profile",
                    }}
                    authors={[
                      {
                        image: babySitter.profileImageUrl || defaultImage,
                        name: `${babySitter.firstName} ${babySitter.lastName}`,
                      },
                    ]}
                  />
                </Grid>
              ))}
            </Grid>
          </MDBox>
        </MDBox>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default BabySitters;
