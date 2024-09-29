import React, { useState } from "react";
import { Dialog, Button, Grid, TextField } from "@mui/material";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import defaultImage from "assets/images/team-1.jpg"; // Default image
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Load Stripe (replace with your own public key)
const stripePromise = loadStripe(
  "pk_test_51PzmNbIO7soUye2opH2QESx7qqHwXk2Peb5j4qNVvOP38dr42uFrq0ZQhASWpP959Z9gFLyUdQY7sgWe4VOaQW6C00hFofOjGk"
);

function BuildingCardFeed({ building }) {
  const [open, setOpen] = useState(false);
  const [openBookingForm, setOpenBookingForm] = useState(false);
  const [openStripe, setOpenStripe] = useState(false);
  const [entryDate, setEntryDate] = useState("");
  const [leaveDate, setLeaveDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  const handleDialogOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  const handleBookingFormOpen = () => setOpenBookingForm(true);
  const handleBookingFormClose = () => setOpenBookingForm(false);

  const handleSubmitBooking = async () => {
    setLoading(true);
    setErrorMessage(""); // Reset error message
    setOpenBookingForm(false);
    setOpenStripe(true);
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
    console.log("Card Element:", cardElement);

    try {
      // Call your backend to create a PaymentIntent
      const response = await fetch("/PI/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: building.price, currency: "eur" }), // Price is multiplied by 100 to convert to cents
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error("Error creating PaymentIntent");
      }

      const { clientSecret } = await response.json();
      console.log("Card Element:", cardElement);
      // Confirm the payment with the clientSecret
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${connectedUser.firstName} ${connectedUser.lastName}`,
          },
        },
      });

      if (result.error) {
        // Show error to your customer (e.g., insufficient funds)
        setErrorMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        // The payment has been processed!
        setPaymentSuccess(true);
        await submitReservation();
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message || "An error occurred during payment");
    } finally {
      setLoading(false);
    }
  };

  const submitReservation = async () => {
    try {
      const response = await fetch(`/PI/buildings/${building.id}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryDate, leaveDate }),
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

  return (
    <div>
      <MDBox onClick={handleDialogOpen} sx={{ cursor: "pointer" }}>
        <img
          src={building.owner.profileImageUrl || defaultImage}
          alt="Building"
          style={{ width: "100%", borderRadius: "8px" }}
        />
        <MDTypography variant="h6">{building.type}</MDTypography>
        <MDTypography variant="body2">{building.address}</MDTypography>
        <MDTypography variant="body2">Price: {building.price} €</MDTypography>
        <MDTypography variant="body2">Rooms: {building.rooms}</MDTypography>
        <MDTypography variant="body2">Area: {building.area} m²</MDTypography>
      </MDBox>

      {/* Enlarged Dialog with Bigger Image */}
      <Dialog
        open={open}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="lg" // Set dialog size to large
      >
        <MDBox p={3}>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <img
                src={building.imageUrl || defaultImage}
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
              <Button variant="contained" onClick={handleBookingFormOpen} sx={{ mt: 2 }}>
                Book House
              </Button>
            </Grid>
          </Grid>
        </MDBox>
      </Dialog>

      {/* Booking Form Dialog */}
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
            value={leaveDate}
            onChange={(e) => setLeaveDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mt: 2 }}
          />
          <Button variant="contained" onClick={handleSubmitBooking} sx={{ mt: 2 }}>
            Submit
          </Button>
        </MDBox>
      </Dialog>

      {/* Stripe Payment Dialog */}
      {openStripe && (
        <Dialog open={openStripe} onClose={() => setOpenStripe(false)} fullWidth maxWidth="md">
          <MDBox p={4}>
            <MDTypography variant="h6">Payment</MDTypography>
            <Elements stripe={stripePromise}>
              <form onSubmit={handleSubmitPayment}>
                <MDBox mb={2}>
                  <CardElement options={{ hidePostalCode: true }} />
                </MDBox>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!stripe || loading}
                >
                  {loading ? "Processing..." : `Pay ${building.price} €`}
                </Button>

                {/* Display success or error messages */}
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
            </Elements>
          </MDBox>
        </Dialog>
      )}
    </div>
  );
}

BuildingCardFeed.propTypes = {
  building: PropTypes.shape({
    owner: PropTypes.shape({
      profileImageUrl: PropTypes.string,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }).isRequired,
    id: PropTypes.string,
    imageUrl: PropTypes.string,
    type: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    rooms: PropTypes.number.isRequired,
    area: PropTypes.number.isRequired,
  }).isRequired,
};

export default BuildingCardFeed;
