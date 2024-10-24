import React, { useState, useEffect } from "react";
import { Dialog, Button, Grid, TextField } from "@mui/material";
import { DateRangePicker } from "react-dates";
import "react-dates/initialize"; // Required for styling
import "react-dates/lib/css/_datepicker.css"; // Required for styling
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import defaultImage from "assets/images/team-1.jpg"; // Default image
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  CardNumberElement,
} from "@stripe/react-stripe-js";

// Load Stripe (replace with your own public key)
const stripePromise = loadStripe(
  "pk_test_51PzmNbIO7soUye2opH2QESx7qqHwXk2Peb5j4qNVvOP38dr42uFrq0ZQhASWpP959Z9gFLyUdQY7sgWe4VOaQW6C00hFofOjGk"
);

function BuildingCardFeed({ building, onDeletePost }) {
  const [open, setOpen] = useState(false);
  const [openBookingForm, setOpenBookingForm] = useState(false);
  const [openStripe, setOpenStripe] = useState(false);
  const [entryDate, setEntryDate] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reservations, setReservations] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  const handleDialogOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  const handleBookingFormOpen = () => {
    setOpenBookingForm(true);
    fetchReservations();
    setEntryDate("");
    setExitDate("");
  };
  const handleBookingFormClose = () => setOpenBookingForm(false);

  // Function to check reservation conflict
  const checkReservationConflict = async () => {
    try {
      const response = await fetch(`/PI/api/buildings/${building.id}/check-reservation-conflict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryDate, exitDate }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return true; // No conflict, proceed
    } catch (error) {
      setErrorMessage(error.message || "An error occurred while checking reservation conflict");
      setLoading(false);
      return false;
    }
  };

  // Modify handleSubmitBooking to check for conflict before proceeding to payment
  const handleSubmitBooking = async () => {
    setLoading(true);
    setErrorMessage(""); // Reset error message
    setPaymentSuccess(false);
    const noConflict = await checkReservationConflict();

    if (noConflict) {
      const entryDateObj = new Date(entryDate); // assuming entryDate is a state variable or prop
      const exitDateObj = new Date(exitDate); // assuming exitDate is a state variable or prop
      const timeDifference = exitDateObj - entryDateObj;
      const nights = timeDifference / (1000 * 60 * 60 * 24);

      // Multiply price per night by the number of nights
      const totalAmount = building.price * nights;
      setPaymentAmount(totalAmount);
      // No conflict, proceed to payment
      console.log("a sahbi winek ayy");
      setOpenBookingForm(false);
      setOpenStripe(true);
      setLoading(false);
    } else {
      // Conflict found, stop the flow
      setErrorMessage("The dates you selected conflicts with an other reservation");
      setLoading(false);
    }
  };

  const handleSubmitPayment = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Reset error message

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Call your backend to create a PaymentIntent
      const response = await fetch("/PI/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: paymentAmount, currency: "eur" }), // Price is multiplied by 100 to convert to cents
      });

      if (!response.ok) {
        throw new Error("Error creating PaymentIntent");
      }

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${connectedUser.firstName} ${connectedUser.lastName}`,
          },
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        await submitReservation();
        setPaymentSuccess(true);
        setEntryDate("");
        setExitDate("");
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred during payment");
    } finally {
      setLoading(false);
    }
  };

  const connectedUser = JSON.parse(localStorage.getItem("connected-user"));
  const [userId, setUserId] = useState(connectedUser.id);
  // if (connectedUser) {
  //   setUserId(connectedUser.id);
  // }

  const submitReservation = async () => {
    try {
      const response = await fetch(`/PI/api/buildings/${building.id}/reservation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryDate, exitDate, userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to reserve the property");
      }

      console.log("Reservation successful");
      setOpenStripe(false);
    } catch (error) {
      console.error("Reservation Error:", error);
      setErrorMessage("An error occurred while reserving the property");
    }
  };
  const fetchReservations = async () => {
    try {
      const response = await fetch(`/PI/api/buildings/${building.id}/reservations`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ entryDate, exitDate, userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }
      if (response.ok) {
        const reservationsData = await response.json();
        setReservations(reservationsData);
      }
      console.log("reservations ya l wess : ", reservations);
      console.log("reservations ya l wess : ", response);
    } catch (error) {
      console.error("Reservation Error:", error);
      setErrorMessage("An error occurred while reserving the property");
    }
  };
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/PI/api/buildings/${building.id}`); // Updated URL
      console.log("Building deleted successfully:", response.data);
      onDeletePost();
      handleDialogClose();
    } catch (error) {
      console.error("Error deleting building:", error);
    }
  };

  const [focusedInput, setFocusedInput] = useState(null);
  const disabledStartDate = new Date("2024-10-10");
  const disabledEndDate = new Date("2024-10-15");

  // Function to determine if a date should be blocked
  const isDayBlocked = (day) => {
    return reservations.some((range) => day.isBetween(range.entryDate, range.exitDate, null, "[]"));
  };

  useEffect(() => {
    if (openBookingForm) {
      setFocusedInput("startDate"); // Focus on start date by default
    } else {
      setFocusedInput(null); // Reset when the dialog closes
    }
  }, [openBookingForm]);

  return (
    <div>
      <MDBox onClick={handleDialogOpen} sx={{ cursor: "pointer" }}>
        <img
          src={building.image_url || defaultImage}
          alt="Building"
          style={{ width: "100%", borderRadius: "8px", aspectRatio: "1" }}
        />
        <MDTypography variant="h6">{building.type}</MDTypography>
        <MDTypography variant="body2">City: {building.city}</MDTypography>
        <MDTypography variant="body2">Address: {building.address}</MDTypography>
        <MDTypography variant="body2">Price: {building.price} €</MDTypography>
        <MDTypography variant="body2">Rooms: {building.rooms}</MDTypography>
        <MDTypography variant="body2">Area: {building.area} m²</MDTypography>
      </MDBox>

      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="lg">
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
          mt={3.5}
          ml={2}
          mr={1}
        >
          <MDBox display="flex" alignItems="center">
            <Avatar
              alt={building.owner.profileImageUrl}
              src={building.owner.profileImageUrl || "/static/images/avatar/1.jpg"}
            />
            <MDBox ml={2}>
              <MDTypography variant="h6">
                {building.owner.firstName} {building.owner.lastName}
              </MDTypography>
              {/* <MDTypography variant="caption" color="textSecondary">
                {date}
              </MDTypography> */}
            </MDBox>
          </MDBox>

          {/* If connected user is an admin, show the delete button in the top right */}
          {connectedUser?.role === "ROLE_ADMIN" && (
            <IconButton
              onClick={handleDelete}
              sx={{
                color: "inherit",
                "&:hover": {
                  color: "red",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </MDBox>
        <MDBox p={3}>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <img
                src={building.image_url || defaultImage}
                alt="Property"
                style={{
                  width: "100%",
                  height: "500px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            </Grid>
            <Grid item>
              {/* <MDTypography variant="h4">
                {building.owner.firstName} {building.owner.lastName}
              </MDTypography> */}
              <MDTypography variant="body1">Address: {building.address}</MDTypography>
              <MDTypography variant="body1">Type: {building.type}</MDTypography>
              <MDTypography variant="body1">Rooms: {building.rooms}</MDTypography>
              <MDTypography variant="body1">Price: {building.price} €</MDTypography>
              <MDTypography variant="body1">Area: {building.area} m²</MDTypography>
              {connectedUser && (
                <MDButton
                  variant="gradient"
                  color="success" // Sets the color to "success"
                  onClick={handleBookingFormOpen}
                  sx={{ mt: 4, mb: 2 }} // Adds margin-top (mt) and margin-bottom (mb)
                  fullWidth
                >
                  Book House
                </MDButton>
              )}
              <MDButton
                variant="gradient"
                color="warning" // Sets the color to "success"
                onClick={handleDialogClose}
                sx={{ mt: 0, mb: 2 }} // Adds margin-top (mt) and margin-bottom (mb)
                fullWidth
              >
                Close
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
      </Dialog>

      <Dialog
        open={openBookingForm}
        onClose={handleBookingFormClose}
        fullWidth
        maxWidth="lg"
        sx={{
          "& .MuiDialog-paper": {
            width: "80%", // Set the dialog width
            height: "450px", // Set a max height if needed
          },
        }}
      >
        <MDBox p={4}>
          <MDTypography variant="h6">Book House</MDTypography>
          <MDBox
            p={2}
            display="flex" // Set to flex to center contents
            flexDirection="column" // Stack items vertically
            // justifyContent="center" // Center content vertically
            alignItems="center" // Center content horizontally
            height="90%" // Optional: Set height to full
          >
            <DateRangePicker
              startDate={entryDate} // Use entryDate state
              startDateId="your_unique_start_date_id" // Unique ID for start date
              endDate={exitDate} // Use exitDate state
              endDateId="your_unique_end_date_id" // Unique ID for end date
              onDatesChange={({ startDate, endDate }) => {
                console.log("Dates Changing - Start:", startDate, "End:", endDate); // Log date changes
                setEntryDate(startDate); // Update entry date
                setExitDate(endDate); // Update exit date
              }}
              focusedInput={focusedInput} // Use focusedInput state
              onFocusChange={(focusedInput) => {
                console.log("Focused Input Changed:", focusedInput); // Log focus changes
                setFocusedInput(focusedInput); // Update focusedInput state
              }} // Update focusedInput state
              isOutsideRange={() => false} // Allow selection of any date
              isDayBlocked={isDayBlocked}
              displayFormat="DD/MM/YYYY" // Optional: Format to display dates
              style={{ width: "100%" }}
            />
          </MDBox>
          <MDButton
            variant="gradient"
            color="success"
            onClick={handleSubmitBooking}
            sx={{ mt: 4 }}
            fullWidth
          >
            Submit
          </MDButton>
          <MDButton
            variant="gradient"
            color="error"
            onClick={handleBookingFormClose}
            sx={{ mt: 2 }}
            fullWidth
          >
            Cancel
          </MDButton>
        </MDBox>
      </Dialog>
      {openStripe && (
        <Dialog open={openStripe} onClose={() => setOpenStripe(false)} fullWidth maxWidth="md">
          <MDBox p={4}>
            <MDTypography variant="h5" sx={{ mb: 3 }}>
              Payment
            </MDTypography>
            <form onSubmit={handleSubmitPayment}>
              <MDBox mb={4}>
                <CardElement options={{ hidePostalCode: true }} />
              </MDBox>
              <MDButton
                variant="gradient"
                color="success"
                type="submit"
                disabled={!stripe || loading}
                fullWidth
              >
                {loading ? "Processing..." : `Pay ${paymentAmount} €`}
              </MDButton>

              {paymentSuccess && (
                <MDTypography variant="body2" color="success" mt={2}>
                  Payment succeeded!
                </MDTypography>
              )}
              {errorMessage && (
                <MDTypography variant="body2" color="error" mt={2}>
                  {errorMessage}
                </MDTypography>
              )}
            </form>
          </MDBox>
        </Dialog>
      )}
    </div>
  );
}

BuildingCardFeed.propTypes = {
  onDeletePost: PropTypes.func,
  building: PropTypes.object.isRequired,
};

export default BuildingCardFeed;
