import { useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Load Stripe (replace with your own public key)
// const stripePromise = loadStripe(
//   "pk_test_51PzmNbIO7soUye2opH2QESx7qqHwXk2Peb5j4qNVvOP38dr42uFrq0ZQhASWpP959Z9gFLyUdQY7sgWe4VOaQW6C00hFofOjGk"
// );

// function CheckoutForm() {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setErrorMessage(""); // Reset error message

//     if (!stripe || !elements) {
//       setLoading(false);
//       return;
//     }

//     const cardElement = elements.getElement(CardElement);
//     console.log("Card Element:", cardElement);

//     try {
//       // Call your backend to create a PaymentIntent
//       const response = await fetch("/PI/api/payment/create-payment-intent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount: 1000, currency: "usd" }), // Added 'currency'
//       });

//       // Check if the response is OK
//       if (!response.ok) {
//         throw new Error("Erreur lors de la création du PaymentIntent");
//       }

//       const { clientSecret } = await response.json();
//       console.log("Card Element:", cardElement);
//       // Confirm the payment with the clientSecret
//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: cardElement,
//           billing_details: {
//             name: "John Doe",
//           },
//         },
//       });

//       if (result.error) {
//         // Show error to your customer (e.g., insufficient funds)
//         setErrorMessage(result.error.message);
//       } else if (result.paymentIntent.status === "succeeded") {
//         // The payment has been processed!
//         setPaymentSuccess(true);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setErrorMessage(error.message || "Une erreur s'est produite");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <MDBox mb={2}>
//         <MDTypography variant="h5">Complete your payment</MDTypography>
//         <CardElement options={{ hidePostalCode: true }} />
//       </MDBox>
//       <MDButton
//         variant="gradient"
//         color="success"
//         type="submit"
//         disabled={!stripe || loading}
//         fullWidth
//       >
//         {loading ? "Processing..." : "Pay $10"}
//       </MDButton>

//       {/* Display success or error messages */}
//       {paymentSuccess && (
//         <MDTypography variant="body2" color="success" mt={2}>
//           Payment succeeded!
//         </MDTypography>
//       )}
//       {errorMessage && (
//         <MDTypography variant="body2" color="error" mt={2}>
//           {errorMessage}
//         </MDTypography>
//       )}
//     </form>
//   );
// }

function Notifications() {
  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Stripe Checkout</MDTypography>
              </MDBox>
              <MDBox p={2}></MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Notifications;
