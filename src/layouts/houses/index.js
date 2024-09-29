import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
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
  const role = localStorage.getItem("role");

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
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

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
        <MDBox mb={3}>
          <MDBox mt={3}>
            <Grid container spacing={6}>
              {houses.map((house) => (
                <Grid item xs={12} md={6} xl={4} key={house.id}>
                  <Elements stripe={stripePromise}>
                    <BuildingCardFeed building={house} />
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
