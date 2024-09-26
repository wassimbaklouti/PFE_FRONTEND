import { useState, useEffect } from "react";
import axios from "axios"; // You'll use axios for making HTTP requests
import PropTypes from "prop-types";
import {
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

function BuildingCard({ buildingId, image, type, address, rooms, price, area, owner }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [updatedType, setUpdatedType] = useState(type);
  const [originalType, setOriginalType] = useState(type);
  const [updatedAddress, setUpdatedAddress] = useState(address);
  const [originalAddress, setOriginalAddress] = useState(address);
  const [updatedRooms, setUpdatedRooms] = useState(rooms);
  const [originalRooms, setOriginalRooms] = useState(rooms);
  const [updatedPrice, setUpdatedPrice] = useState(price);
  const [originalPrice, setOriginalPrice] = useState(price);
  const [updatedArea, setUpdatedArea] = useState(area);
  const [originalArea, setOriginalArea] = useState(area);
  const [ownerDetails, setOwnerDetails] = useState(owner); // Store the owner details

  // Fetch the connected user's profile and set owner details
  const fetchUserProfile = async () => {
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
          setOwnerDetails(data); // Set the entire owner object
        } else {
          console.error("Failed to fetch user profile:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile(); // Call fetchUserProfile when the component mounts
  }, []);

  // Function to handle opening the update dialog
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  // Function to handle closing the update dialog
  const handleClose = () => {
    setOpenDialog(false);
  };

  // Function to handle updating the building
  const handleUpdate = async () => {
    try {
      // Prepare the building data object with updated values
      const buildingData = {
        type: updatedType,
        address: updatedAddress,
        rooms: updatedRooms,
        price: updatedPrice,
        area: updatedArea,
        owner: {
          userId: ownerDetails.userId, // Include userId from the owner details
          firstName: ownerDetails.firstName,
          lastName: ownerDetails.lastName,
          username: ownerDetails.username,
          email: ownerDetails.email,
          isActive: ownerDetails.isActive,
          isNotLocked: ownerDetails.isNotLocked,
          phoneNumber: ownerDetails.phoneNumber,
          rating: ownerDetails.rating,
          ratingCount: ownerDetails.ratingCount,
        },
      };

      console.log("Updated building data: ", buildingData);
      // Send the PUT request to the backend
      const response = await axios.put(`/PI/api/buildings/${buildingId}`, buildingData, {
        headers: {
          "Content-Type": "application/json", // Indicate that we are sending JSON
        },
      });

      console.log("Building updated successfully:", response.data);
      handleClose();

      // Update original values with new values after successful update
      setOriginalType(updatedType);
      setOriginalAddress(updatedAddress);
      setOriginalRooms(updatedRooms);
      setOriginalPrice(updatedPrice);
      setOriginalArea(updatedArea);
      // Optional: Update the owner details in case of further updates
      setOwnerDetails({
        ...ownerDetails,
        userId: ownerDetails.userId, // Preserve the existing userId
      });
    } catch (error) {
      console.error("Error updating building:", error);
    }
  };

  // Function to handle deleting the building
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/PI/api/buildings/${buildingId}`); // Updated URL
      console.log("Building deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting building:", error);
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
        boxShadow: "none",
        overflow: "visible",
      }}
    >
      <MDBox position="relative" width="100.25%" shadow="xl" borderRadius="xl">
        <CardMedia
          src={image}
          component="img"
          title={type}
          sx={{
            maxWidth: "100%",
            margin: 0,
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </MDBox>
      <MDBox mt={1} mx={0.5}>
        <MDBox mb={1}>
          <MDTypography variant="h5" textTransform="capitalize">
            {type}
          </MDTypography>
        </MDBox>
        <MDBox mb={1}>
          <MDTypography variant="button" fontWeight="light" color="text">
            Address: {address}
          </MDTypography>
        </MDBox>
        <MDBox mb={1}>
          <MDTypography variant="button" fontWeight="light" color="text">
            Rooms: {rooms} | Price: ${price} | Area: {area} m²
          </MDTypography>
        </MDBox>
        <MDBox mb={1}>
          <MDTypography variant="button" fontWeight="light" color="text">
            Owner: {owner.firstName} {owner.lastName} ({owner.email})
          </MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDButton variant="outlined" size="small" color="primary" onClick={handleClickOpen}>
            Update Building
          </MDButton>
          <MDButton variant="outlined" size="small" color="error" onClick={handleDelete}>
            Delete Building
          </MDButton>
        </MDBox>
      </MDBox>

      {/* Dialog for updating the building */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Update Building</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To update this building, please edit the fields below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Type"
            type="text"
            fullWidth
            variant="outlined"
            value={updatedType}
            onChange={(e) => setUpdatedType(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            value={updatedAddress}
            onChange={(e) => setUpdatedAddress(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Rooms"
            type="number"
            fullWidth
            variant="outlined"
            value={updatedRooms}
            onChange={(e) => setUpdatedRooms(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            value={updatedPrice}
            onChange={(e) => setUpdatedPrice(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Area"
            type="number"
            fullWidth
            variant="outlined"
            value={updatedArea}
            onChange={(e) => setUpdatedArea(e.target.value)}
          />
          {/* File input for updating the image */}
          <input
            type="file"
            accept="image/*"
            // You can handle image upload logic here if necessary
            style={{ marginTop: "1rem" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

// Typechecking props for the BuildingCard
BuildingCard.propTypes = {
  buildingId: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  rooms: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  area: PropTypes.number.isRequired,
  owner: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default BuildingCard;
