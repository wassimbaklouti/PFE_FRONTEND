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

function Plumbers() {
  const [plumbers, setPlumbers] = useState([]);
  const [filteredPlumbers, setFilteredPlumbers] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  // Fetch plumbers data
  useEffect(() => {
    fetch("http://localhost:8089/PI/handymen/plumber") // Votre endpoint API
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Conversion des données en JSON
      })
      .then((data) => {
        console.log("Plumbers data:", data); // Afficher les données dans la console
        setPlumbers(data); // Stockage des données des plombiers
        setFilteredPlumbers(data); // Initialise le filtre avec tous les plombiers
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

    // Filter plumbers based on selected city
    if (city) {
      const filtered = plumbers.filter((plumber) => plumber.city === city);
      setFilteredPlumbers(filtered);
    } else {
      setFilteredPlumbers(plumbers);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} px={3}>
        <MDTypography variant="h4" fontWeight="medium">
          Plumbers List
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
              {filteredPlumbers.map((plumber, index) => (
                <Grid item xs={12} md={6} xl={2} key={plumber.userId || index}>
                  <DefaultProjectCard
                    image={plumber.profileImageUrl || defaultImage} // Utilise l'image du profil si disponible ou une image par défaut
                    label={`Plumber #${index + 1}`}
                    title={`${plumber.firstName} ${plumber.lastName}`}
                    description={`Expertise: ${plumber.expertise}`}
                    handymanUsername={plumber.username}
                    phoneNumber={plumber.phoneNumber}
                    city={`City : ${plumber.city}`}
                    action={{
                      type: "internal",
                      route: `/pages/plumbers/plumber-overview/${plumber.userId}`, // Met à jour le chemin avec l'ID du plombier
                      color: "info",
                      label: "View Profile",
                    }}
                    authors={[
                      {
                        image: plumber.profileImageUrl || defaultImage,
                        name: `${plumber.firstName} ${plumber.lastName}`,
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

export default Plumbers;
