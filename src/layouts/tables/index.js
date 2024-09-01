import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

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
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";

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

function Tables() {
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();

  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    role: "",
    phoneNumber: "",
    city: "",
    profileImage: null,
    expertise: "", // Add expertise to the newUser state
  });
  const [loading, setLoading] = useState(false); // Add loading state
  const [successSB, setSuccessSB] = useState(false); // Add state for success snackbar

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

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
  };

  const handleImageChange = (e) => {
    setNewUser({ ...newUser, profileImage: e.target.files[0] });
  };

  const handleCityChange = (event, value) => {
    setNewUser({ ...newUser, city: value });
  };

  const handleSubmit = async () => {
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
        //setRows((prevRows) => [...prevRows, data]);
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
      <DashboardNavbar />
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
      <Footer />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          {loading ? ( // Conditionally render loading indicator
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
              />
              <TextField
                margin="dense"
                name="lastName"
                label="Last Name"
                type="text"
                fullWidth
                value={newUser.lastName}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="username"
                label="Username"
                type="text"
                fullWidth
                value={newUser.username}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={newUser.email}
                onChange={handleChange}
              />
              <Autocomplete
                options={roleOptions}
                getOptionLabel={(option) => option.label}
                value={roleOptions.find((option) => option.value === newUser.role) || null}
                onChange={(event, newValue) => {
                  handleChange({ target: { name: "role", value: newValue?.value || "" } });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Role" margin="dense" fullWidth />
                )}
              />
              {newUser.role === "ROLE_HANDYMAN" && ( // Afficher le champ expertise si le rôle est Handyman
                <TextField
                  margin="dense"
                  name="expertise"
                  label="Expertise"
                  type="text"
                  fullWidth
                  value={newUser.expertise}
                  onChange={handleChange}
                />
              )}
              <TextField
                margin="dense"
                name="phoneNumber"
                label="Phone Number"
                type="text"
                fullWidth
                value={newUser.phoneNumber}
                onChange={handleChange}
              />
              <Autocomplete
                freeSolo
                options={cities}
                value={newUser.city}
                onChange={handleCityChange}
                renderInput={(params) => (
                  <TextField {...params} label="City" margin="dense" fullWidth />
                )}
              />
              <input
                type="file"
                name="profileImage"
                onChange={handleImageChange}
                style={{ marginTop: 20 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {renderSuccessSB}
    </DashboardLayout>
  );
}

export default Tables;
