import React, { useState } from "react";
import { Dialog, Button, Grid, TextField } from "@mui/material";
import PropTypes from "prop-types";
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

function BuildingCardFeed({ building }) {
  const [open, setOpen] = useState(false);
  const [openBookingForm, setOpenBookingForm] = useState(false);
  const [openStripe, setOpenStripe] = useState(false);
  const [entryDate, setEntryDate] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  const handleDialogOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  const handleBookingFormOpen = () => setOpenBookingForm(true);
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
      // No conflict, proceed to payment
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
        body: JSON.stringify({ amount: building.price, currency: "eur" }), // Price is multiplied by 100 to convert to cents
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
        setPaymentSuccess(true);
        await submitReservation();
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred during payment");
    } finally {
      setLoading(false);
    }
  };

  const submitReservation = async () => {
    try {
      const response = await fetch(`/PI/api/buildings/${building.id}/reservations`, {
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

  const connectedUser = JSON.parse(localStorage.getItem("connected-user"));
  const userId = connectedUser.id;

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
              <MDTypography variant="h4">
                {building.owner.firstName} {building.owner.lastName}
              </MDTypography>
              <MDTypography variant="body1">Address: {building.address}</MDTypography>
              <MDTypography variant="body1">Type: {building.type}</MDTypography>
              <MDTypography variant="body1">Rooms: {building.rooms}</MDTypography>
              <MDTypography variant="body1">Price: {building.price} €</MDTypography>
              <MDTypography variant="body1">Area: {building.area} m²</MDTypography>
              <MDButton
                variant="gradient"
                color="success" // Sets the color to "success"
                onClick={handleBookingFormOpen}
                sx={{ mt: 4, mb: 2 }} // Adds margin-top (mt) and margin-bottom (mb)
                fullWidth
              >
                Book House
              </MDButton>
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

      <Dialog open={openBookingForm} onClose={handleBookingFormClose} fullWidth maxWidth="md">
        <MDBox p={4}>
          <MDTypography variant="h6">Book House</MDTypography>
          <TextField
            label="Entry Date"
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Leave Date"
            type="date"
            value={exitDate}
            onChange={(e) => setExitDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mt: 2 }}
          />
          {errorMessage && (
            <MDTypography variant="body2" color="error" mt={2}>
              {errorMessage}
            </MDTypography>
          )}
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
                {loading ? "Processing..." : `Pay ${building.price} €`}
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
  building: PropTypes.object.isRequired,
};

export default BuildingCardFeed;
