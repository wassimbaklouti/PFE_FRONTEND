// Required imports
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Tooltip from "@mui/material/Tooltip";
import Rating from "@mui/material/Rating";
import axios from "axios"; // To make HTTP requests
import { useLocation } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";
import Dialog from "@mui/material/Dialog"; // Import Dialog components
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

function DefaultProjectCard({
  image,
  label,
  title,
  description,
  action,
  authors,
  handymanUsername,
  phoneNumber,
  city,
  userUsername,
}) {
  const [rating, setRating] = useState(0); // Overall rating
  const [userRating, setUserRating] = useState(0); // User's rating
  const [connectedUser, setConnectedUser] = useState(null);
  const [showRatingSection, setShowRatingSection] = useState(false); // To toggle the rating section
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog open/close
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const selectedUsername = query.get("username");

  // Function to submit or update the rating
  const submitRating = async (newRating) => {
    try {
      if (userRating) {
        await axios.put("/PI/ratings/update", {
          username: connectedUser.username,
          handymanUsername: handymanUsername,
          rate: newRating,
        });
      } else {
        await axios.post("/PI/ratings/add", {
          username: connectedUser.username,
          handymanUsername: handymanUsername,
          rate: newRating,
        });
      }
      setUserRating(newRating);
      fetchOverallRating(); // Refresh overall rating after submission
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  // Function to delete the rating
  const deleteRating = async () => {
    try {
      await axios.delete("/PI/ratings/delete", {
        data: {
          username: connectedUser.username,
          handymanUsername: handymanUsername,
        },
      });
      setUserRating(0); // Reset the user's rating to 0
      fetchOverallRating(); // Refresh overall rating after deletion
    } catch (error) {
      console.error("Error deleting rating:", error);
    }
  };

  // Function to fetch the overall rating of the handyman
  const fetchOverallRating = async () => {
    try {
      const response = await axios.get(`/PI/ratings/overall?handymanUsername=${handymanUsername}`);
      if (response.status === 200) {
        setRating(response.data);
      }
    } catch (error) {
      console.error("Error fetching overall rating:", error);
    }
  };

  // Function to fetch the connected user
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

          // Check if the user has already rated the handyman
          const responseRating = await axios.get(
            `/PI/ratings/get?username=${data.username}&handymanUsername=${handymanUsername}`
          );
          if (responseRating.status === 200) {
            setUserRating(responseRating.data);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
  };

  useEffect(() => {
    fetchConnectedUser();
    fetchOverallRating(); // Fetch overall rating when component mounts
    if (selectedUsername == handymanUsername) {
      setOpenDialog(true);
    }
  }, [handymanUsername]);

  // const renderAuthors = authors.map(({ image: media, name }) => (
  //   <Tooltip key={name} title={name} placement="bottom">
  //     <MDAvatar
  //       src={media}
  //       alt={name}
  //       size="xs"
  //       sx={({ borders: { borderWidth }, palette: { white } }) => ({
  //         border: `${borderWidth[2]} solid ${white.main}`,
  //         cursor: "pointer",
  //         position: "relative",
  //         ml: -1.25,

  //         "&:hover, &:focus": {
  //           zIndex: "10",
  //         },
  //       })}
  //     />
  //   </Tooltip>
  // ));

  // Handlers for opening and closing the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
    setShowRatingSection(false); // Reset rating section when dialog opens
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      {/* Card Component */}
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "transparent",
          boxShadow: "none",
          overflow: "visible",
          width: "120%",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.02)",
            transition: "transform 0.3s ease-in-out",
          },
        }}
        onClick={handleOpenDialog} // Open dialog on card click
      >
        <MDBox position="relative" width="100.25%" shadow="xl" borderRadius="xl">
          <CardMedia
            src={image}
            component="img"
            title={title}
            sx={{
              maxWidth: "100%",
              margin: 0,
              boxShadow: ({ boxShadows: { md } }) => md,
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </MDBox>
        <MDBox mt={1} mx={0.5}>
          <MDTypography
            variant="button"
            fontWeight="regular"
            color="text"
            textTransform="capitalize"
          >
            {label}
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="h5" textTransform="capitalize">
              {title}
            </MDTypography>
          </MDBox>
          <MDBox mb={3} lineHeight={0}>
            <MDTypography variant="button" fontWeight="light" color="text">
              {description}
            </MDTypography>
          </MDBox>
          <MDBox mb={3} lineHeight={0}>
            <MDTypography variant="button" fontWeight="light" color="text">
              {city}
            </MDTypography>
          </MDBox>

          {/* Overall rating display */}
          <MDBox mb={3} display="flex" alignItems="center">
            <MDTypography variant="button" fontWeight="regular" color="text">
              Overall Rating : {rating.toFixed(2)}/5.00
            </MDTypography>
          </MDBox>

          {/* <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDBox display="flex">{renderAuthors}</MDBox>
          </MDBox> */}
        </MDBox>
      </Card>

      {/* Dialog Component */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{`${title}`}</DialogTitle>
        <DialogContent>
          <MDBox mb={2}>
            <CardMedia
              src={image}
              component="img"
              title={title}
              sx={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </MDBox>
          <MDTypography variant="body1" color="text" gutterBottom>
            {description}
          </MDTypography>
          <MDTypography variant="body1" color="text" gutterBottom>
            {city}
          </MDTypography>
          <MDTypography variant="body1" color="text" gutterBottom>
            Phone Number : {phoneNumber}
          </MDTypography>

          {/* Overall rating display */}
          <MDBox mt={2} mb={2} display="flex" alignItems="center">
            <MDTypography variant="button" fontWeight="regular" color="text">
              Overall Rating: {rating.toFixed(2)}/5.00
            </MDTypography>
          </MDBox>

          {/* Toggle rating section */}
          {connectedUser && (
            <>
              {showRatingSection ? (
                <>
                  {/* User rating system */}
                  <MDBox mb={2} display="flex" alignItems="center">
                    <MDTypography variant="button" fontWeight="regular" color="text">
                      Your Rating:
                    </MDTypography>
                    <Rating
                      name="handyman-rating"
                      value={userRating} // Show the user's rating
                      onChange={(event, newValue) => submitRating(newValue)} // Update rating when changed
                      max={5}
                      size="medium"
                      sx={{ ml: 1 }}
                    />
                  </MDBox>

                  {/* Clear rating button */}
                  <MDButton
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={deleteRating}
                    sx={{ mt: 1 }}
                  >
                    Clear Rating
                  </MDButton>
                </>
              ) : (
                <MDButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={() => setShowRatingSection(true)}
                >
                  Rate Handyman
                </MDButton>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Default props for the card
DefaultProjectCard.defaultProps = {
  authors: [],
  userRating: 0,
  connectedUser: null,
};

// Typechecking for the card
DefaultProjectCard.propTypes = {
  image: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  phoneNumber: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  action: PropTypes.shape({
    type: PropTypes.oneOf(["internal", "external"]),
    route: PropTypes.string,
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "light",
      "dark",
    ]),
    label: PropTypes.string,
  }).isRequired,
  authors: PropTypes.arrayOf(PropTypes.object),
  handymanUsername: PropTypes.string.isRequired,
  userUsername: PropTypes.string.isRequired,
};

export default DefaultProjectCard;
