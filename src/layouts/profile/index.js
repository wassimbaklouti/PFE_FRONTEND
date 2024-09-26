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
import PostCard from "examples/Cards/PostCards/PostCard"; // Make sure to create this component
import BuildingCard from "examples/Cards/BuildingCards/BuildingCard"; // Make sure to create this component

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

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
  const [newPostData, setNewPostData] = useState({
    title: "",
    content: "",
    imageFile: null,
  });
  const [newBuildingData, setNewBuildingData] = useState({
    type: "",
    address: "",
    rooms: "",
    price: "",
    area: "",
    owner: {
      userId: "",
      firstName: "",
      lastName: "",
      username: "",
      email: "",
    },
  });

  const [posts, setPosts] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [activeForm, setActiveForm] = useState(null); // To toggle between post and building form

  const fetchBuilding = async () => {
    const token = sessionStorage.getItem("jwt-Token") || localStorage.getItem("jwt-Token");
    const buildingsResponse = await fetch(`/PI/api/buildings/owner/username/${profile.username}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (buildingsResponse.ok) {
      const buildingsData = await buildingsResponse.json();
      setBuildings(buildingsData);
    } else {
      console.error("Failed to fetch buildings");
    }
  };

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

          if (response.ok) {
            const data = await response.json();
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

            // Fetch posts
            const postsResponse = await fetch(`/PI/api/posts/user/${data.username}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (postsResponse.ok) {
              const postsData = await postsResponse.json();
              setPosts(postsData);
            } else {
              console.error("Failed to fetch posts");
            }

            // Fetch buildings
            fetchBuilding();
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

  const handleNewPostChange = (e) => {
    const { name, value } = e.target;
    setNewPostData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    setNewPostData((prevData) => ({
      ...prevData,
      imageFile: file, // Store the selected file
    }));
  };

  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("jwt-Token") || localStorage.getItem("jwt-Token");

    if (token && profile) {
      const formData = new FormData();
      formData.append("username", profile.username); // Pass the connected username
      formData.append("title", newPostData.title);
      formData.append("content", newPostData.content);

      if (newPostData.imageFile) {
        formData.append("imageFile", newPostData.imageFile); // Append the image file to the form data
      }

      try {
        const response = await fetch("/PI/api/posts/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, // Send the form data, including the file
        });

        if (response.ok) {
          console.log("New post added successfully");
          // Reset the form fields
          setNewPostData({
            title: "",
            content: "",
            imageFile: null,
          });
          // Refetch posts
          const postsResponse = await fetch(`/PI/api/posts/user/${profile.username}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (postsResponse.ok) {
            const postsData = await postsResponse.json();
            setPosts(postsData);
          }
        } else {
          console.error("Failed to add new post");
        }
      } catch (error) {
        console.error("Error adding new post:", error);
      }
    } else {
      console.warn("No token found in localStorage or profile not available");
    }
  };

  // New function to handle the building form
  const handleNewBuildingChange = (e) => {
    const { name, value } = e.target;
    setNewBuildingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNewBuildingSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("jwt-Token") || localStorage.getItem("jwt-Token");
    if (token && profile) {
      // Construire un objet JavaScript avec les données du bâtiment, y compris les champs supplémentaires
      const buildingData = {
        type: newBuildingData.type,
        address: newBuildingData.address,
        rooms: newBuildingData.rooms,
        price: newBuildingData.price,
        area: newBuildingData.area, // Par exemple, 150.0
        owner: {
          userId: profile.userId, // Utiliser l'ID de l'utilisateur connecté
          firstName: profile.firstName,
          lastName: profile.lastName,
          username: profile.username,
          email: profile.email,
        },
      };

      try {
        const response = await fetch("/PI/api/buildings/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Spécifier que le type de contenu est JSON
          },
          body: JSON.stringify(buildingData), // Convertir l'objet en JSON
        });

        if (response.ok) {
          console.log("New building added successfully");
          // Réinitialiser les champs du formulaire après succès
          setNewBuildingData({
            type: "",
            address: "",
            rooms: "",
            price: "",
            area: "",
            owner: {
              userId: "",
              firstName: "",
              lastName: "",
              username: "",
              email: "",
            },
          });
          // Logique supplémentaire pour gérer la réussite si nécessaire
          fetchBuilding();
        } else {
          console.error("Failed to add new building");
        }
      } catch (error) {
        console.error("Error adding new building:", error);
      }
    } else {
      console.warn("No token found in localStorage or profile not available");
    }
  };

  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <MDBox mb={2} />
      {loading ? (
        <MDTypography variant="h6">Loading...</MDTypography>
      ) : (
        <>
          <Header profile={profile} />
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
                    info={{
                      FirstName: profile.firstName || "No FirstName",
                      LastName: profile.lastName || "No LastName",
                      UserName: profile.username || "No UserName",
                      email: profile.email || "No Email",
                      PhoneNumber: profile.phoneNumber || "No Phone Number",
                      City: profile.city || "No City",
                    }}
                    action={{ route: "", tooltip: "Edit Profile", onClick: handleEdit }}
                  />
                ) : (
                  <MDBox component="form" onSubmit={handleSubmit}>
                    <MDTypography variant="h6">Edit Profile</MDTypography>
                    <TextField
                      label="Username"
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
                      getOptionLabel={(option) => option}
                      value={formData.city}
                      onChange={handleCityChange}
                      renderInput={(params) => (
                        <TextField {...params} label="City" fullWidth margin="normal" />
                      )}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Save
                    </Button>
                  </MDBox>
                )}
              </Grid>

              <Grid item xs={12} xl={4}>
                {/* Display Add Post and Add Building buttons only for Property Owners */}
                {profile.role === "ROLE_PROPERTYOWNER" && (
                  <MDBox mb={2}>
                    <Button
                      variant={activeForm === "post" ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => setActiveForm("post")}
                      sx={{ mr: 2 }}
                    >
                      Add New Post
                    </Button>
                    <Button
                      variant={activeForm === "building" ? "contained" : "outlined"}
                      color="secondary"
                      onClick={() => setActiveForm("building")}
                    >
                      Add New Building
                    </Button>
                  </MDBox>
                )}
                {profile.role !== "ROLE_PROPERTYOWNER" && (
                  <MDBox component="form" onSubmit={handleNewPostSubmit}>
                    <MDTypography variant="h6">Add New Post</MDTypography>
                    <TextField
                      label="Title"
                      name="title"
                      value={newPostData.title}
                      onChange={handleNewPostChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Content"
                      name="content"
                      value={newPostData.content}
                      onChange={handleNewPostChange}
                      fullWidth
                      margin="normal"
                    />
                    <input
                      accept="image/*"
                      type="file"
                      onChange={handleImageFileChange}
                      style={{ margin: "16px 0" }} // Add some margin for better layout
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Add Post
                    </Button>
                  </MDBox>
                )}

                {/* Conditional rendering of forms based on activeForm */}
                {activeForm === "post" && (
                  <MDBox component="form" onSubmit={handleNewPostSubmit}>
                    <MDTypography variant="h6">Add New Post</MDTypography>
                    <TextField
                      label="Title"
                      name="title"
                      value={newPostData.title}
                      onChange={handleNewPostChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Content"
                      name="content"
                      value={newPostData.content}
                      onChange={handleNewPostChange}
                      fullWidth
                      margin="normal"
                    />
                    <input
                      accept="image/*"
                      type="file"
                      onChange={handleImageFileChange}
                      style={{ margin: "16px 0" }} // Add some margin for better layout
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Add Post
                    </Button>
                  </MDBox>
                )}

                {activeForm === "building" && (
                  <MDBox component="form" onSubmit={handleNewBuildingSubmit}>
                    <MDTypography variant="h6">Add New Building</MDTypography>
                    <TextField
                      label="Type"
                      name="type"
                      value={newBuildingData.type}
                      onChange={handleNewBuildingChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Adress"
                      name="address"
                      value={newBuildingData.address}
                      onChange={handleNewBuildingChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Rooms"
                      name="rooms"
                      value={newBuildingData.rooms}
                      onChange={handleNewBuildingChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Price"
                      name="price"
                      value={newBuildingData.price}
                      onChange={handleNewBuildingChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Area"
                      name="area"
                      value={newBuildingData.area}
                      onChange={handleNewBuildingChange}
                      fullWidth
                      margin="normal"
                    />
                    <Button type="submit" variant="contained" color="secondary" fullWidth>
                      Add Building
                    </Button>
                  </MDBox>
                )}
              </Grid>
            </Grid>
          </MDBox>

          <MDBox p={2}>
            Posts Section
            <Grid container spacing={6}>
              {/* Posts Section */}
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Grid item xs={12} md={6} xl={3} key={post.id}>
                    <PostCard
                      postId={post.id}
                      image={homeDecor1}
                      title={post.title}
                      content={post.content}
                      username={post.username}
                      action={{
                        type: "internal",
                        route: `/posts/${post.id}`,
                        color: "info",
                        label: "View Post",
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <MDTypography variant="h6" align="center" fullWidth>
                  No posts available
                </MDTypography>
              )}
            </Grid>
            <>
              <br />
            </>
          </MDBox>
          {/* Building section */}
          <MDBox p={2}>
            Buildings Section
            <Grid container spacing={6}>
              {buildings.length > 0 ? (
                buildings.map((building) => (
                  <Grid item xs={12} md={6} xl={3} key={building.id}>
                    <BuildingCard
                      buildingId={building.id}
                      image={homeDecor1} // Replace with building image if available
                      type={building.type}
                      address={building.address}
                      rooms={building.rooms}
                      price={building.price}
                      area={building.area}
                      owner={building.owner}
                    />
                  </Grid>
                ))
              ) : (
                <div>No buildings found.</div>
              )}
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}

export default Overview;
