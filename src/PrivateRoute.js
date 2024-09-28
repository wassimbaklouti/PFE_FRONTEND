import React from "react";
import { Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import prop-types

// Example of checking authentication and roles
const isAuthenticated = () => {
  // Logic to check if user is authenticated (e.g., checking a token in localStorage)
  const token = localStorage.getItem("authToken");
  return !!token;
};

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const userRole = localStorage.getItem("user");
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          roles && roles.includes(userRole) ? (
            <Component {...props} />
          ) : (
            <Navigate to="/not-authorized" />
          )
        ) : (
          <Navigate to="/authentication/sign-in" />
        )
      }
    />
  );
};

// Prop-types validation
PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func]).isRequired, // Component must be a React component or function
  roles: PropTypes.arrayOf(PropTypes.string), // Roles is an array of strings
};

export default PrivateRoute;
