import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

function Overview() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    city: "",
    isActive: "",
    isNotLocked: "",
    profileImage: "",
    role: "",
    currentUsername: "",
  });
  const [cities, setCities] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem("jwt-Token") || localStorage.getItem("jwt-Token");
      console.log("Token:", token); // Debug: Check if token is retrieved

      if (token) {
        try {
          const response = await fetch("/PI/connected-user", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          console.log("Profile fetch response:", response); // Debug: Check response

          if (response.ok) {
            const data = await response.json();
            console.log("Profile data:", data); // Debug: Check profile data
            setProfile(data);
            setFormData({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              username: data.username || "",
              email: data.email || "",
              phoneNumber: data.phoneNumber || "",
              city: data.city || "",
              isActive: data.active || "",
              isNotLocked: data.notLocked || "",
              profileImage: data.profileImageUrl || "",
              role: data.role || "",
              currentUsername: data.username || "",
            });
          } else {
            console.error("Failed to fetch profile");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        console.warn("No token found in localStorage");
      }

      setLoading(false);
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

    fetchProfile();
    fetchCities();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCityChange = (event, newValue) => {
    setFormData((prevData) => ({
      ...prevData,
      city: newValue || "",
    }));
  };

  const toQueryString = (data) => {
    return Object.keys(data)
      .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("jwt-Token") || localStorage.getItem("jwt-Token");

    if (token) {
      try {
        const queryString = toQueryString(formData);

        const response = await fetch(`/PI/update?${queryString}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Update success:", data); // Debug: Check update response
          setProfile(data);
          setEditMode(false); // Exit edit mode after successful update
        } else {
          console.error("Failed to update profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    } else {
      console.warn("No token found in localStorage");
    }
  };

  if (loading) {
    return <MDTypography variant="h6">Loading...</MDTypography>;
  }

  if (!profile) {
    return <MDTypography variant="h6">No profile data available</MDTypography>;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4}>
              <PlatformSettings />
            </Grid>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              {!editMode ? (
                <ProfileInfoCard
                  title="Profile Information"
                  description={`UID : ${profile.userId}` || "No UID"}
                  info={{
                    FirstName: profile.firstName || "No FirstName",
                    LastName: profile.lastName || "No LastName",
                    UserName: profile.username || "No UserName",
                    email: profile.email || "No Email",
                    PhoneNumber: profile.phoneNumber || "No Phone Number",
                    City: profile.city || "No City",
                  }}
                  // social={profile.socialLinks || []}
                  action={{ route: "", tooltip: "Edit Profile", onClick: handleEdit }}
                  shadow={false}
                />
              ) : (
                <MDBox component="form" onSubmit={handleSubmit}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="User Name"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <Autocomplete
                    options={cities}
                    value={formData.city}
                    onChange={handleCityChange}
                    renderInput={(params) => (
                      <TextField {...params} label="City" margin="normal" fullWidth />
                    )}
                  />
                  <MDBox mt={2} display="flex" justifyContent="space-between">
                    <Button type="submit" variant="gradient" color="info">
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="gradient"
                      color="error"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </Button>
                  </MDBox>
                </MDBox>
              )}
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid item xs={12} xl={4}>
              <ProfilesList title="Conversations" profiles={profilesListData} shadow={false} />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Projects
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="button" color="text">
              Architects design houses
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox p={2}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor1}
                label="project #2"
                title="modern"
                description="As Uber works through a huge amount of internal management turmoil."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor2}
                label="project #1"
                title="scandinavian"
                description="Music is something that everyone has their own specific opinion about."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor3}
                label="project #3"
                title="minimalist"
                description="Different people have different taste, and various types of music."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor4}
                label="project #4"
                title="gothic"
                description="Why would anyone pick blue over pink? Pink is obviously a better color."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
