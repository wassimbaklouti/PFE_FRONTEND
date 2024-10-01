import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Sidenav from "examples/Sidenav";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem"; // Import MenuItem for select options
import Select from "@mui/material/Select"; // Import Select for expertise field
import InputLabel from "@mui/material/InputLabel"; // Import InputLabel for Select label
import FormControl from "@mui/material/FormControl"; // Import FormControl for styling
import routes from "routes";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tablesUser/data/authorsTableData";
import projectsTableData from "layouts/tablesUser/data/projectsTableData";

const fetchCities = async () => {
  try {
    const response = await fetch(
      "http://api.geonames.org/searchJSON?country=TN&featureClass=P&maxRows=1000&username=bakloutiwassim"
    );
    if (response.ok) {
      const data = await response.json();
      return data.geonames.map((city) => city.name);
    } else {
      console.error("Failed to fetch cities");
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

function TablesUser() {
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();

  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    role: "ROLE_USER",
    phoneNumber: "",
    city: "",
    profileImage: null,
    expertise: "", // Add expertise to the newUser state
  });
  const [loading, setLoading] = useState(false); // Add loading state
  const [successSB, setSuccessSB] = useState(false); // Add state for success snackbar

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
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

  useEffect(() => {
    const getCities = async () => {
      const citiesList = await fetchCities();
      setCities(citiesList);
    };
    getCities();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error when user starts typing
    }));
  };

  const handleImageChange = (e) => {
    setNewUser({ ...newUser, profileImage: e.target.files[0] });
  };

  const handleCityChange = (event, value) => {
    setNewUser({ ...newUser, city: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error when user starts typing
    }));
  };

  const handleSubmit = async () => {
    let formIsValid = true;
    let newErrors = {};
    const regexPhone = /^[0-9]{8,13}$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!newUser.firstName.trim()) {
      formIsValid = false;
      newErrors.firstName = "First name is required";
    }

    // Check if content is empty
    if (!newUser.lastName.trim()) {
      formIsValid = false;
      newErrors.lastName = "Last name is required";
    }
    if (!newUser.username.trim()) {
      formIsValid = false;
      newErrors.username = "User name is required";
    }
    if (!regexEmail.test(newUser.email)) {
      formIsValid = false;
      newErrors.email = "Invalid email address";
    }
    if (!newUser.email.trim()) {
      formIsValid = false;
      newErrors.email = "Email is required";
    }
    if (!regexPhone.test(newUser.phoneNumber)) {
      formIsValid = false;
      newErrors.phoneNumber = "Phone number must be between 8 and 13 digits";
    }
    if (!newUser.phoneNumber) {
      formIsValid = false;
      newErrors.phoneNumber = "Phone number is required";
    }
    if (!newUser.city.trim()) {
      formIsValid = false;
      newErrors.city = "City name is required";
    }

    if (!formIsValid) {
      setErrors(newErrors); // Set errors if form is invalid
      return;
    }
    setLoading(true); // Set loading to true when form submission starts
    const formData = new FormData();

    // Set expertise to null if the role is not Handyman
    const userForSubmission = { ...newUser };
    if (userForSubmission.role !== "ROLE_HANDYMAN") {
      userForSubmission.expertise = "";
    }

    Object.keys(userForSubmission).forEach((key) => {
      formData.append(key, userForSubmission[key]);
    });

    try {
      const response = await fetch("/PI/add", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        openSuccessSB(); // Show success notification
        handleClose();
        window.location.reload();
      } else {
        console.error("Failed to add new user");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false when form submission is complete
    }
  };

  const roleOptions = [
    { label: "Admin", value: "ROLE_ADMIN" },
    { label: "User", value: "ROLE_USER" },
    { label: "Handyman", value: "ROLE_HANDYMAN" },
    { label: "Property Owner", value: "ROLE_PROPRETYOWNER" },
  ];

  const expertiseOptions = [
    { label: "Plumber", value: "plumber" },
    { label: "Electrician", value: "electrician" },
    { label: "Gardener", value: "gardner" },
    { label: "HouseKeeper", value: "houseKeeper" },
    { label: "Refrigeration Technician", value: "refrigerationTechnician" },
    { label: "Home Appliance Technician", value: "homeApplianceTechnician" },
    { label: "Mason", value: "mason" },
    { label: "Carpenter", value: "carpenter" },
    { label: "Painter", value: "painter" },
  ];

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Material Dashboard"
      content="User added successfully!"
      dateTime="Now"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  return (
    <DashboardLayout>
      <Sidenav color={"info"} brandName="Admin Dashboard" routes={routes} />
      {/* <DashboardNavbar /> */}
      <MDBox justifyContent="flex-end" ml={33}>
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h5" color="white">
                    Users Table
                  </MDTypography>
                  <Button
                    variant="contained"
                    color="dark"
                    onClick={handleClickOpen}
                    style={{ float: "right" }}
                  >
                    Add User
                  </Button>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      {/* <Footer /> */}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <>
              <TextField
                autoFocus
                margin="dense"
                name="firstName"
                label="First Name"
                type="text"
                fullWidth
                value={newUser.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
              <TextField
                margin="dense"
                name="lastName"
                label="Last Name"
                type="text"
                fullWidth
                value={newUser.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
              <TextField
                margin="dense"
                name="username"
                label="Username"
                type="text"
                fullWidth
                value={newUser.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={newUser.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              {/* <Autocomplete
                options={roleOptions}
                getOptionLabel={(option) => option.label}
                value={roleOptions.find((option) => option.value === newUser.role) || null}
                onChange={(event, newValue) => {
                  handleChange({ target: { name: "role", value: newValue?.value || "" } });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Role" margin="dense" fullWidth />
                )}
              /> */}
              {newUser.role === "ROLE_HANDYMAN" && (
                <FormControl fullWidth margin="dense">
                  <InputLabel id="expertise-label">Expertise</InputLabel>
                  <Select
                    labelId="expertise-label"
                    id="expertise"
                    name="expertise"
                    value={newUser.expertise}
                    onChange={handleChange}
                    label="Expertise"
                  >
                    {expertiseOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <Autocomplete
                options={cities}
                getOptionLabel={(option) => option}
                value={newUser.city || null}
                onChange={handleCityChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    margin="dense"
                    fullWidth
                    error={!!errors.city}
                    helperText={errors.city}
                  />
                )}
              />
              <TextField
                margin="dense"
                name="phoneNumber"
                label="Phone Number"
                type="tel"
                fullWidth
                value={newUser.phoneNumber}
                onChange={handleChange}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
              <TextField
                margin="dense"
                name="profileImage"
                label="Profile Image"
                type="file"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleImageChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Add User
          </Button>
        </DialogActions>
      </Dialog>
      {renderSuccessSB}
    </DashboardLayout>
  );
}

export default TablesUser;
