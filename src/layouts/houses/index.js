import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultProjectCard from "examples/Cards/HouseCards/DefaultHouseCard";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// Placeholder images
import defaultImage from "assets/images/team-1.jpg"; // Assurez-vous d'avoir une image par défaut

function Houses() {
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);

  // Fetch Houses data
  useEffect(() => {
    fetch("http://localhost:8089/PI/api/buildings") // Votre endpoint API
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Conversion des données en JSON
      })
      .then((data) => {
        console.log("Houses data:", data); // Afficher les données dans la console
        setHouses(data); // Stockage des données des maisons
        setFilteredHouses(data); // Initialise le filtre avec toutes les maisons
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} px={3}>
        <MDTypography variant="h4" fontWeight="medium">
          Houses List
        </MDTypography>
        <MDBox mt={3} mb={1}>
          <Divider />
        </MDBox>
        <MDBox mb={3}>
          <MDBox mt={3}>
            <Grid container spacing={6}>
              {filteredHouses.map((house, index) => (
                <Grid item xs={12} md={6} xl={4} key={house.id || index}>
                  <DefaultProjectCard
                    image={house.owner.profileImageUrl || defaultImage} // Utilise l'image du profil si disponible ou une image par défaut
                    label={`House #${index + 1}`} // Indique l'index de la maison
                    title={`Owner: ${house.owner.firstName || "Unknown"} 
                    ${house.owner.lastName || "Unknown"}`} // Nom du propriétaire
                    description={`Type: ${house.type}\nRooms: ${house.rooms}\nPrice: ${house.price} €\nArea: ${house.area} m²`} // Détails de la maison
                    handymanUsername={house.owner.username || "N/A"} // Username du propriétaire
                    action={{
                      type: "internal",
                      route: `/pages/houses/house-overview/${house.owner.userId}`, // Redirige vers la page de profil du propriétaire
                      color: "info",
                      label: "View Profile",
                    }}
                    authors={[
                      {
                        image: house.owner.profileImageUrl || defaultImage,
                        name: `${house.owner.firstName || "Unknown"} 
                        ${house.owner.lastName || "Unknown"}`,
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

export default Houses;
