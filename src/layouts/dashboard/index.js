/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import DashboardPosts from "layouts/posts";
import MDTypography from "components/MDTypography";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

function Dashboard() {
  const [handymanCounts, setHandymanCounts] = useState({
    plumbing: 0,
    electricity: 0,
    housekeeping: 0,
    airConditioning: 0,
    washingMachine: 0,
    painting: 0,
    babysitting: 0,
    gardening: 0,
    carpentry: 0,
    masonry: 0,
    welding: 0,
    houses: 0,
    SosService: 0,
  });
  const [houseCount, setHouseCount] = useState({
    houses: 0,
  });

  useEffect(() => {
    // Function to fetch count for a specific expertise using fetch API
    const fetchCount = async (expertise, key) => {
      try {
        const response = await fetch(`http://localhost:8089/PI/handymen/${expertise}`, {
          method: "POST",
        });

        if (response.ok) {
          const count = await response.json();
          setHandymanCounts((prevCounts) => ({
            ...prevCounts,
            [key]: count,
          }));
        } else {
          console.error(`Error fetching count for ${expertise}:`, response.statusText);
        }
      } catch (error) {
        console.error(`Error fetching ${expertise} count:`, error);
      }
    };
    // useEffect(() => {
    //   //compter le nombre de maisons selon la réponse de cette requette http://localhost:8089/PI/api/buildings
    // },

    // Fetch counts for all expertise types
    fetchCount("plumber", "plumbing");
    fetchCount("electrician", "electricity");
    fetchCount("houseKeeper", "housekeeping");
    fetchCount("refrigerationTechnician", "airConditioning");
    fetchCount("homeApplianceTechnician", "washingMachine");
    fetchCount("painter", "painting");
    fetchCount("babySitter", "babysitting");
    fetchCount("gardner", "gardening");
    fetchCount("carpenter", "carpentry");
    fetchCount("mason", "masonry");
    fetchCount("welder", "welding");
    fetchCount("sosDriver", "SosService");
    // Fetch count for houses
    const fetchHouseCount = async () => {
      try {
        const response = await fetch("http://localhost:8089/PI/api/buildings");
        if (response.ok) {
          const houses = await response.json();
          setHandymanCounts((prevCounts) => ({
            ...prevCounts,
            houses: houses.length, // Set house count from the API response
          }));
          console.log("nombres de maisons: ", houses);
        } else {
          console.error("Error fetching houses:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching house count:", error);
      }
    };

    fetchHouseCount();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3} sx={{ mt: 5 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                // color="dark"
                icon="plumbing"
                title="Plumbing"
                expertiese="plumber"
                count={handymanCounts.plumbing}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than last week",
                }}
                path="/plumbers" // Ajout du chemin pour redirection
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="electric_bolt"
                title="Electricity"
                expertiese="electrician"
                count={handymanCounts.electricity}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
                path="/electricians" // Ajout du chemin pour redirection
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="electric_bolt"
                title="Sos Service"
                expertiese="sosDriver"
                count={handymanCounts.SosService}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
                path="/sosDriver" // Ajout du chemin pour redirection
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                // color="success"
                icon="cleaning_services"
                title="Housekeeping"
                count={handymanCounts.housekeeping}
                expertiese="housekeeper"
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
                path="/houseKeepers
" // Ajout du chemin pour redirection
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                // color="primary"
                icon="ac_unit"
                title="Air Conditioning"
                count={handymanCounts.airConditioning}
                expertiese="AC technician"
                percentage={{
                  color: "success",
                  amount: "10%",
                  label: "Just updated",
                }}
                path="/RefrigerationTechnicians" // Ajout du chemin pour redirection
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                // color="primary"
                icon="local_laundry_service"
                title="Home Appliance"
                expertiese="home appliance technician"
                count={handymanCounts.washingMachine}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
                path="/homeApplianceTechnicians" // Ajout du chemin pour redirection
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                // color="primary"
                icon="format_paint"
                title="Painting"
                expertiese="painter"
                count={handymanCounts.painting}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
                path="/painters" // Ajout du chemin pour redirection
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                // color="primary"
                icon="child_friendly"
                title="Baby Sitting"
                expertiese="baby sitter"
                count={handymanCounts.babysitting}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
                path="/babySitters" // Ajout du chemin pour redirection
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                // color="primary"
                icon="yard"
                title="Gardening"
                expertiese="gardener"
                count={handymanCounts.gardening}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
                path="/gardners" // Ajout du chemin pour redirection
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="handyman" // Icon for carpenter
                title="Carpentry"
                expertiese="carpenter"
                count={handymanCounts.carpentry}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
                path="/carpenters" // Redirection path for carpenters
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="construction" // Icon for mason
                title="Construction"
                expertiese="mason"
                count={handymanCounts.masonry}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
                path="/masons" // Redirection path for masons
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="build" // Icon for welding (or use "construction" or similar)
                title="Welding"
                expertiese="welder"
                count={handymanCounts.welding}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
                path="/welders" // Redirection path for welders
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="home" // Icon for houses
                title="Houses"
                expertiese="house"
                count={handymanCounts.houses}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
                path="/houses" // Redirection path for houses
              />
            </MDBox>
          </Grid>
        </Grid>

        {/* <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
