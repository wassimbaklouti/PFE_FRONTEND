import { useState, useEffect, useRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import Card from "@mui/material/Card";
import MasterCard from "examples/Cards/MasterCard";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import PostAddIcon from "@mui/icons-material/PostAdd"; // Import PostAddIcon
import HomeIcon from "@mui/icons-material/Home";
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
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

function Overview() {
  const [profile, setProfile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [connectedUser, setConnectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestError, setRequestError] = useState("");
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    type: "",
    city: "",
    address: "",
    rooms: "",
    price: "",
    area: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    cardnumber: "",
    cardExpire: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [refreshTriger, setRefreshTriger] = useState(false);
  const triggerRefresh = () => {
    setRefreshTriger((prev) => !prev); // Toggling the refresh state
  };
  const [refrech, setRefrech] = useState(false);
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
  // const [userUpdated, setUserUpdated] = useState({
  //   firstName: "",
  //   lastName: "",
  //   username: "",
  //   email: "",
  //   phoneNumber: "",
  //   city: "",
  //   isActive: "",
  //   isNotLocked: "",
  //   profileImage: null,
  //   role: "",
  //   currentUsername: "",
  // });
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
    city: "",
    imageFile: null,
    owner: {
      userId: "",
      firstName: "",
      lastName: "",
      username: "",
      email: "",
    },
  });
  const [open, setOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpire, setCardExpire] = useState("");
  const [refresh, setrefresh] = useState(false);
  const handleClickOpen = () => {
    if (connectedUser.cardnumber && connectedUser.cardexpire) {
      setCardNumber(connectedUser.cardnumber);
      setCardExpire(connectedUser.cardexpire);
    }
    setOpen(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);

    // You can add logic to handle the file upload, such as saving it to formData
    setFormData((prevState) => ({
      ...prevState,
      profileImage: file, // Assuming you're adding the file to formData
    }));
  };
  const handleImageChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
    }
    // console.log("saleeeeem ", userUpdated);
  };
  const handlePostImageChange = (e) => {
    setNewPostData({ ...newPostData, profileImage: e.target.files[0] });
    // console.log("saleeeeem ", userUpdated);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    let formIsValid = true;
    let newErrors = {};
    const cardNumberRegex = /^\d{16}$/;
    const cardExpireRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!cardNumberRegex.test(cardNumber)) {
      formIsValid = false;
      newErrors.cardnumber = "Card number must be exactly 16 digits";
    }
    if (!cardNumber) {
      formIsValid = false;
      newErrors.cardnumber = "Card number is required";
    }
    if (!cardExpire) {
      formIsValid = false;
      newErrors.cardExpire = "Card expiration date is required";
    }
    if (!cardExpireRegex.test(cardExpire)) {
      formIsValid = false;
      newErrors.cardExpire = "Card expiration date must be in 'MM/YY' format";
    }

    if (!formIsValid) {
      setErrors(newErrors); // Set errors if form is invalid
      return;
    }
    // Using fetch to call the backend
    fetch(
      `/PI/update-card?username=${connectedUser.username}&cardnumber=${cardNumber}&cardexpire=${cardExpire}`,
      {
        method: "PUT",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update card info");
        }
        return response.json();
      })
      .then((data) => {
        // Handle success (e.g., show a notification or update local state)
        console.log("Card info updated successfully", data);
        setrefresh(!refresh);
        setOpen(false); // Close dialog after saving
      })
      .catch((error) => {
        // Handle error (e.g., show an error notification)
        console.error("Error:", error);
      });
  };
  const [posts, setPosts] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [activeForm, setActiveForm] = useState("post"); // To toggle between post and building form

  const fetchConnectedUser = async () => {
    const token = sessionStorage.getItem("jwt-Token") || localStorage.getItem("jwt-Token");
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
          setConnectedUser(data);
          console.log("connecteduserrrr ", connectedUser);
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
  };

  const fetchBuilding = async () => {
    // await fetchConnectedUser();
    console.log("connected user ya l wess : ", connectedUser);
    if (connectedUser) {
      const token = sessionStorage.getItem("jwt-Token") || localStorage.getItem("jwt-Token");
      const buildingsResponse = await fetch(
        `/PI/api/buildings/owner/username/${connectedUser.username}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (buildingsResponse.ok) {
        const buildingsData = await buildingsResponse.json();
        setBuildings(buildingsData);
      } else {
        console.error("Failed to fetch buildings");
      }
    }
  };

  const fetchPosts = async () => {
    // await fetchConnectedUser();
    // console.log("connected user ya l wess : ", connectedUser);
    if (connectedUser) {
      const token = sessionStorage.getItem("jwt-Token") || localStorage.getItem("jwt-Token");
      const postsResponse = await fetch(`/PI/api/posts/user/${connectedUser.username}`, {
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
    }
  };

  const fetchProfile = async () => {
    // await fetchConnectedUser();
    const token = sessionStorage.getItem("jwt-Token") || localStorage.getItem("jwt-Token");
    console.log("Token:", token); // Debug: Check if token is retrieved
    console.log("connected user : ", connectedUser);
    if (connectedUser) {
      setProfile(connectedUser);
      console.log("profileee ", profile);
      setFormData({
        firstName: connectedUser.firstName || "",
        lastName: connectedUser.lastName || "",
        username: connectedUser.username || "",
        email: connectedUser.email || "",
        phoneNumber: connectedUser.phoneNumber || "",
        city: connectedUser.city || "",
        isActive: connectedUser.active || "",
        isNotLocked: connectedUser.notLocked || "",
        profileImage: connectedUser.profileImageUrl || "",
        role: connectedUser.role || "",
        currentUsername: connectedUser.username || "",
      });
      setLoading(false);
    }
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

  useEffect(() => {
    fetchConnectedUser();
  }, [refresh]);

  useEffect(() => {
    //fetchConnectedUser();
    fetchProfile();
    fetchPosts();
    fetchBuilding();
    fetchCities();
  }, [connectedUser, refrech]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleButtonClick2 = () => {
    fileInputRef2.current.click();
  };
  const handleButtonClick3 = () => {
    fileInputRef3.current.click();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error when user starts typing
    }));
    setRequestError("");
  };

  const handleCityChange = (event, newValue) => {
    setFormData((prevData) => ({
      ...prevData,
      city: newValue || "",
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error when user starts typing
    }));
  };
  const handleBuildingCityChange = (event, newValue) => {
    setNewBuildingData((prevData) => ({
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
    let formIsValid = true;
    let newErrors = {};
    const regexPhone = /^[0-9]{8,13}$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.firstName.trim()) {
      formIsValid = false;
      newErrors.firstName = "First name is required";
    }

    // Check if content is empty
    if (!formData.lastName.trim()) {
      formIsValid = false;
      newErrors.lastName = "Last name is required";
    }
    if (!formData.username.trim()) {
      formIsValid = false;
      newErrors.username = "User name is required";
    }
    if (!regexEmail.test(formData.email)) {
      formIsValid = false;
      newErrors.email = "Invalid email address";
    }
    if (!formData.email.trim()) {
      formIsValid = false;
      newErrors.email = "Email is required";
    }
    if (!formData.phoneNumber) {
      formIsValid = false;
      newErrors.phoneNumber = "Phone number is required";
    }
    if (!regexPhone.test(formData.phoneNumber)) {
      formIsValid = false;
      newErrors.phoneNumber = "Phone number must be between 8 and 13 digits";
    }
    if (!formData.city.trim()) {
      formIsValid = false;
      newErrors.city = "City name is required";
    }

    if (!formIsValid) {
      setErrors(newErrors); // Set errors if form is invalid
      return;
    }
    const forSubmit = new FormData();
    const userForSubmission = { ...formData };
    Object.keys(userForSubmission).forEach((key) => {
      forSubmit.append(key, userForSubmission[key]);
    });
    if (token) {
      try {
        const queryString = toQueryString(formData);

        const response = await fetch("/PI/update", {
          method: "POST",
          body: forSubmit,
          // headers: {
          //   Authorization: `Bearer ${token}`,
          //   "Content-Type": "application/json",
          // },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          localStorage.setItem("profile-image", profile.profileImageUrl);
          console.log("imageeeee", profile.profileImageUrl);
          triggerRefresh();
          setEditMode(false); // Exit edit mode after successful update
        } else {
          const errorData = await response.json(); // Parse the response as JSON
          setRequestError(errorData.message);
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
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error when user starts typing
    }));
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    setCardNumber(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error when user starts typing
    }));
  };

  const handleCardExpireChange = (e) => {
    const value = e.target.value;
    setCardExpire(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error when user starts typing
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    setNewPostData((prevData) => ({
      ...prevData,
      imageFile: file, // Store the selected file
    }));
  };
  const handleBuildingImageFileChange = (e) => {
    const file = e.target.files[0];
    setNewBuildingData((prevData) => ({
      ...prevData,
      imageFile: file, // Store the selected file
    }));
  };

  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("jwt-Token") || localStorage.getItem("jwt-Token");
    let formIsValid = true;
    let newErrors = {};
    if (!newPostData.title.trim()) {
      formIsValid = false;
      newErrors.title = "Title is required";
    }

    // Check if content is empty
    if (!newPostData.content.trim()) {
      formIsValid = false;
      newErrors.content = "Content is required";
    }

    if (!formIsValid) {
      setErrors(newErrors); // Set errors if form is invalid
      return;
    }
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

  const handleRefrech = () => {
    if (refrech) {
      setRefrech(false);
    } else {
      setRefrech(true);
    }
  };

  const handleFormChange = (event, newValue) => {
    setActiveForm(newValue); // Update the active form when the tab is clicked
  };
  // New function to handle the building form
  const handleNewBuildingChange = (e) => {
    const { name, value } = e.target;
    setNewBuildingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error when user starts typing
    }));
  };

  const handleNewBuildingSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("jwt-Token") || localStorage.getItem("jwt-Token");
    let formIsValid = true;
    let newErrors = {};
    if (!newBuildingData.type.trim()) {
      formIsValid = false;
      newErrors.type = "Type is required";
    }
    if (!newBuildingData.address.trim()) {
      formIsValid = false;
      newErrors.address = "Address is required";
    }
    if (!newBuildingData.rooms.trim()) {
      formIsValid = false;
      newErrors.rooms = "Rooms is required";
    }
    if (!newBuildingData.price.trim()) {
      formIsValid = false;
      newErrors.price = "Price is required";
    }
    if (!newBuildingData.area.trim()) {
      formIsValid = false;
      newErrors.area = "Area is required";
    }
    if (!newBuildingData.city.trim()) {
      formIsValid = false;
      newErrors.city = "City is required";
    }
    if (!formIsValid) {
      setErrors(newErrors); // Set errors if form is invalid
      return;
    }
    if (token && profile) {
      // Construire un objet JavaScript avec les données du bâtiment, y compris les champs supplémentaires
      const buildingData = {
        type: newBuildingData.type,
        address: newBuildingData.address,
        rooms: newBuildingData.rooms,
        price: newBuildingData.price,
        area: newBuildingData.area, // Par exemple, 150.0
        imageFile: newBuildingData.imageFile, // Par exemple, 150.0
        city: newBuildingData.city, // Par exemple, 150.0
        owner: {
          userId: profile.userId, // Utiliser l'ID de l'utilisateur connecté
          firstName: profile.firstName,
          lastName: profile.lastName,
          username: profile.username,
          email: profile.email,
        },
      };
      const formData = new FormData();
      formData.append("type", buildingData.type); // Pass the connected username
      formData.append("address", buildingData.address);
      formData.append("rooms", buildingData.rooms);
      formData.append("price", buildingData.price);
      formData.append("area", buildingData.area);
      formData.append("city", buildingData.city);
      formData.append("ownerUsername", buildingData.owner.username);

      if (buildingData.imageFile) {
        formData.append("imageFile", buildingData.imageFile); // Append the image file to the form data
      }

      try {
        const response = await fetch("/PI/api/buildings/create", {
          method: "POST",
          // headers: {
          //   Authorization: `Bearer ${token}`,
          //   "Content-Type": "application/json", // Spécifier que le type de contenu est JSON
          // },
          body: formData, // Convertir l'objet en JSON
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
      <DashboardNavbar
        refresh={refreshTriger}
        {...(profile ? { imagee: profile.profileImageUrl } : {})}
      />
      <MDBox mb={2} />
      {loading ? (
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh" // Makes it take full height of the viewport
          width="100vw" // Makes it take full width of the viewport
          position="absolute" // Ensures it takes up the whole page
          top={0}
          // left={-150}
          bgcolor="background.default" // Optional: set the background color
        >
          <CircularProgress />
        </MDBox>
      ) : (
        <>
          <Header profile={profile} refresh={refreshTriger} />
          <MDBox mt={5} mb={3}>
            <Grid container spacing={1}>
              {/* <Grid item xs={12} md={6} xl={4}>
                <PlatformSettings />
              </Grid> */}
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
                  <Card sx={{ height: "100%", width: "100%" }}>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      pt={2}
                      px={2}
                    >
                      <MDBox component="form" onSubmit={handleSubmit}>
                        <MDTypography variant="h6">Edit Profile</MDTypography>
                        {requestError && (
                          <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <MDTypography
                              color="error"
                              variant="caption"
                              style={{ fontSize: "1rem" }}
                            >
                              {requestError}
                            </MDTypography>
                          </div>
                        )}
                        <TextField
                          label="Firstname"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          fullWidth
                          margin="normal"
                          error={!!errors.firstName}
                          helperText={errors.firstName}
                        />
                        <TextField
                          label="Lastname"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          fullWidth
                          margin="normal"
                          error={!!errors.lastName}
                          helperText={errors.lastName}
                        />
                        <TextField
                          label="Username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          fullWidth
                          margin="normal"
                          error={!!errors.username}
                          helperText={errors.username}
                        />
                        <TextField
                          label="Email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          fullWidth
                          margin="normal"
                          error={!!errors.email}
                          helperText={errors.email}
                        />
                        <TextField
                          label="Phone Number"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          fullWidth
                          margin="normal"
                          error={!!errors.phoneNumber}
                          helperText={errors.phoneNumber}
                        />
                        <Autocomplete
                          options={cities}
                          getOptionLabel={(option) => option}
                          value={formData.city}
                          onChange={handleCityChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="City"
                              fullWidth
                              margin="normal"
                              error={!!errors.city}
                              helperText={errors.city}
                            />
                          )}
                        />
                        <MDBox mt={2} mb={2}>
                          {/* Hidden file input */}
                          <input
                            accept="image/*"
                            type="file"
                            name="profileImage"
                            ref={fileInputRef3}
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                          />
                          {/* TextField acting as a trigger */}
                          <TextField
                            margin="dense"
                            name="profileImage"
                            label="Profile Image"
                            type="text"
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={selectedFileName}
                            onClick={handleButtonClick3}
                            readOnly
                          />
                        </MDBox>
                        <MDButton
                          type="submit"
                          variant="gradient"
                          color="success"
                          fullWidth
                          sx={{ mb: 2 }}
                        >
                          Save
                        </MDButton>
                        <MDButton
                          type="button"
                          onClick={() => setEditMode(false)}
                          variant="gradient"
                          color="warning"
                          fullWidth
                          sx={{ mb: 2 }}
                        >
                          Cancel
                        </MDButton>
                      </MDBox>
                    </MDBox>
                  </Card>
                )}
              </Grid>

              <Grid item xs={12} xl={4}>
                {/* Display Add Post and Add Building buttons only for Property Owners */}
                {/* {profile.role === "ROLE_PROPERTYOWNER" && (
                  <MDBox mb={2}>
                    <Button
                      variant={activeForm === "post" ? "contained" : "outlined"}
                      color="white"
                      onClick={() => setActiveForm("post")}
                      sx={{ mr: 2 }}
                    >
                      Add New Post
                    </Button>
                    <Button
                      variant={activeForm === "building" ? "contained" : "outlined"}
                      color="white"
                      onClick={() => setActiveForm("building")}
                    >
                      Add New Building
                    </Button>
                  </MDBox>
                )} */}
                {profile.role !== "ROLE_PROPERTYOWNER" && (
                  <Card sx={{ height: "100%", width: "100%" }}>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      pt={2}
                      px={2}
                    >
                      <MDBox component="form" onSubmit={handleNewPostSubmit}>
                        <MDTypography variant="h5">Add New Post</MDTypography>
                        <TextField
                          label="Title"
                          name="title"
                          value={newPostData.title}
                          onChange={handleNewPostChange}
                          fullWidth
                          margin="normal"
                          error={!!errors.title}
                          helperText={errors.title}
                        />
                        <TextField
                          label="Content"
                          name="content"
                          value={newPostData.content}
                          onChange={handleNewPostChange}
                          fullWidth
                          margin="normal"
                          error={!!errors.content}
                          helperText={errors.content}
                        />
                        <input
                          accept="image/*"
                          type="file"
                          onChange={handleImageFileChange}
                          // style={{ margin: "16px 0" }}
                          style={{ display: "none" }}
                          ref={fileInputRef2}
                        />
                        <MDButton
                          variant="contained"
                          color="primary"
                          startIcon={<Icon>upload</Icon>}
                          onClick={handleButtonClick2}
                          fullWidth
                          style={{
                            margin: "16px 0",
                            backgroundColor: "#1976d2",
                            color: "#fff",
                            padding: "12px 24px",
                            fontSize: "12px",
                            // fontWeight: "bold",
                          }}
                        >
                          Upload Image
                        </MDButton>
                        <MDButton type="submit" variant="gradient" color="success" fullWidth>
                          Add Post
                        </MDButton>
                      </MDBox>
                    </MDBox>
                  </Card>
                )}
                {profile.role === "ROLE_PROPERTYOWNER" && (
                  <Card sx={{ height: "100%", width: "100%" }}>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      pt={2}
                      px={2}
                    >
                      {/* Tabs for switching between Add Post and Add Building */}
                      <Tabs
                        value={activeForm}
                        onChange={handleFormChange}
                        aria-label="Form Tabs"
                        sx={{ width: "100%" }}
                      >
                        <Tab
                          label="Add New Post"
                          value="post"
                          icon={<PostAddIcon />} // Add PostAddIcon
                          iconPosition="start" // Position icon at the start
                        />
                        <Tab
                          label="Add New Building"
                          value="building"
                          icon={<HomeIcon />} // Add HomeIcon
                          iconPosition="start" // Position icon at the start
                        />
                      </Tabs>
                    </MDBox>

                    {/* Conditional Rendering Based on Active Tab */}
                    {activeForm === "post" && (
                      <MDBox component="form" onSubmit={handleNewPostSubmit} p={2}>
                        <MDTypography variant="h5">Add New Post</MDTypography>
                        <TextField
                          label="Title"
                          name="title"
                          value={newPostData.title}
                          onChange={handleNewPostChange}
                          fullWidth
                          margin="normal"
                          error={!!errors.title}
                          helperText={errors.title}
                        />
                        <TextField
                          label="Content"
                          name="content"
                          value={newPostData.content}
                          onChange={handleNewPostChange}
                          fullWidth
                          margin="normal"
                          error={!!errors.content}
                          helperText={errors.content}
                        />
                        <input
                          accept="image/*"
                          type="file"
                          onChange={handleImageFileChange}
                          // style={{ margin: "16px 0" }}
                          style={{ display: "none" }}
                          ref={fileInputRef2}
                        />
                        <MDButton
                          variant="contained"
                          color="primary"
                          startIcon={<Icon>upload</Icon>}
                          onClick={handleButtonClick2}
                          fullWidth
                          // fullWidth
                          style={{
                            margin: "16px 0",
                            backgroundColor: "#1976d2",
                            color: "#fff",
                            padding: "12px 24px",
                            fontSize: "12px",
                            // fontWeight: "bold",
                          }}
                        >
                          Upload Image
                        </MDButton>
                        <MDButton type="submit" variant="gradient" color="success" fullWidth>
                          Add Post
                        </MDButton>
                      </MDBox>
                    )}

                    {activeForm === "building" && (
                      <MDBox component="form" onSubmit={handleNewBuildingSubmit} p={2}>
                        <MDTypography variant="h5">Add New Building</MDTypography>
                        {/* Liste déroulante pour le type de building */}
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={!!errors.type}
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
                          <InputLabel>Type</InputLabel>
                          <Select
                            label="Type"
                            name="type"
                            value={newBuildingData.type}
                            onChange={handleNewBuildingChange}
                          >
                            <MenuItem value="appartement">Appartement</MenuItem>
                            <MenuItem value="flat">Flat</MenuItem>
                            <MenuItem value="villa">Villa</MenuItem>
                            <MenuItem value="house">House</MenuItem>
                          </Select>
                          {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
                        </FormControl>
                        <Autocomplete
                          options={cities}
                          getOptionLabel={(option) => option}
                          value={newBuildingData.city}
                          onChange={handleBuildingCityChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="City"
                              fullWidth
                              margin="normal"
                              error={!!errors.city}
                              helperText={errors.city}
                            />
                          )}
                        />
                        <TextField
                          label="Address"
                          name="address"
                          value={newBuildingData.address}
                          onChange={handleNewBuildingChange}
                          fullWidth
                          margin="normal"
                          error={!!errors.address}
                          helperText={errors.address}
                        />
                        <TextField
                          label="Rooms"
                          name="rooms"
                          value={newBuildingData.rooms}
                          onChange={handleNewBuildingChange}
                          fullWidth
                          margin="normal"
                          error={!!errors.rooms}
                          helperText={errors.rooms}
                          type="number"
                        />
                        <TextField
                          label="Price"
                          name="price"
                          value={newBuildingData.price}
                          onChange={handleNewBuildingChange}
                          fullWidth
                          margin="normal"
                          error={!!errors.price}
                          helperText={errors.price}
                          type="number"
                          inputProps={{ step: "0.1" }}
                        />
                        <TextField
                          label="Area"
                          name="area"
                          value={newBuildingData.area}
                          onChange={handleNewBuildingChange}
                          fullWidth
                          margin="normal"
                          error={!!errors.area}
                          helperText={errors.area}
                          type="number"
                          inputProps={{ step: "0.1" }}
                        />
                        <input
                          accept="image/*"
                          type="file"
                          onChange={handleBuildingImageFileChange}
                          // style={{ margin: "16px 0" }}
                          style={{ display: "none" }}
                          ref={fileInputRef}
                        />
                        <MDButton
                          variant="contained"
                          color="primary"
                          startIcon={<Icon>upload</Icon>}
                          onClick={handleButtonClick}
                          fullWidth
                          style={{
                            margin: "16px 0",
                            backgroundColor: "#1976d2",
                            color: "#fff",
                            padding: "12px 24px",
                            fontSize: "12px",
                            // fontWeight: "bold",
                          }}
                        >
                          Upload Image
                        </MDButton>
                        <MDButton type="submit" variant="gradient" color="success" fullWidth>
                          Add Building
                        </MDButton>
                      </MDBox>
                    )}
                  </Card>
                )}
              </Grid>
              <Grid item xs={12} md={6} xl={4}>
                <Card sx={{ height: "100%", width: "100%" }}>
                  <MDBox
                    display="flex"
                    flexDirection="column" // Change to column layout
                    justifyContent="flex-start" // Align items to the start
                    alignItems="flex-start" // Align items to the start
                    pt={2}
                    px={2}
                    pb={2}
                  >
                    <MDTypography variant="h5" sx={{ marginBottom: "16px" }}>
                      Billing Info
                    </MDTypography>
                    <MDBox onClick={handleClickOpen} sx={{ cursor: "pointer", width: "100%" }}>
                      <MasterCard
                        number={`${
                          connectedUser.cardnumber ? connectedUser.cardnumber : "****************"
                        }`}
                        holder={`${connectedUser.firstName} ${connectedUser.lastName}`}
                        expires={`${connectedUser.cardexpire ? connectedUser.cardexpire : "**/**"}`}
                        sx={{ marginTop: "24px" }}
                      />
                    </MDBox>
                  </MDBox>
                </Card>
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Update Card Information</DialogTitle>
                  <DialogContent>
                    <TextField
                      margin="dense"
                      label="Card Number"
                      fullWidth
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      variant="outlined"
                      error={!!errors.cardnumber}
                      helperText={errors.cardnumber}
                    />
                    <TextField
                      margin="dense"
                      label="Expiration Date"
                      fullWidth
                      value={cardExpire}
                      onChange={handleCardExpireChange}
                      variant="outlined"
                      error={!!errors.cardExpire}
                      helperText={errors.cardExpire}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                      Save
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            </Grid>
          </MDBox>

          <Card>
            <MDBox p={2}>
              Posts Section
              <Grid container spacing={6} sx={{ marginTop: "-25px" }}>
                {/* Posts Section */}
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <Grid item xs={12} md={6} xl={3} key={post.id}>
                      <PostCard
                        postId={post.id}
                        image={post.image_url || homeDecor1}
                        title={post.title}
                        content={post.content}
                        username={post.username}
                        onDeletePost={handleRefrech}
                        onUpdatePost={handleRefrech}
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
                  <Grid container justifyContent="center" sx={{ marginTop: "25px" }}>
                    <Grid item>
                      <MDTypography variant="h6" align="center" fullWidth>
                        No Posts available
                      </MDTypography>
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <>
                <br />
              </>
            </MDBox>
          </Card>
          {/* Building section */}
          {profile.role === "ROLE_PROPERTYOWNER" && (
            <Card sx={{ marginTop: "30px" }}>
              <MDBox p={2}>
                Buildings Section
                <Grid container spacing={6} sx={{ marginTop: "-25px" }}>
                  {buildings.length > 0 ? (
                    buildings.map((building) => (
                      <Grid item xs={12} md={6} xl={3} key={building.id}>
                        <BuildingCard
                          buildingId={building.id}
                          image={building.image_url || homeDecor1} // Replace with building image if available
                          type={building.type}
                          cityy={building.city}
                          address={building.address}
                          rooms={building.rooms}
                          price={building.price}
                          area={building.area}
                          owner={building.owner}
                          onDeletePost={handleRefrech}
                          onUpdatePost={handleRefrech}
                        />
                      </Grid>
                    ))
                  ) : (
                    <Grid
                      container
                      justifyContent="center"
                      sx={{ marginTop: "25px", marginBottom: "30px" }}
                    >
                      <Grid item>
                        <MDTypography variant="h6" align="center" fullWidth>
                          No Buildings available
                        </MDTypography>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </MDBox>
            </Card>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export default Overview;
