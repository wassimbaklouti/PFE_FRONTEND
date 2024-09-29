/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";

// Fetch function to get user data
const fetchUserData = async () => {
  try {
    const response = await fetch("/PI/list/propertyowner");
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch user data");
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// Delete function to remove a user
const deleteUserData = async (username) => {
  try {
    const response = await fetch(`/PI/delete/${username}`, {
      method: "DELETE",
    });
    if (response.ok) {
      return true;
    } else {
      console.error("Failed to delete user");
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

export default function data() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchUserData();
      console.log(data); // Debug log to ensure data is correct
      setUsers(data);
    };
    getData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "----";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDelete = async (username) => {
    const isDeleted = await deleteUserData(username);
    if (isDeleted) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.username !== username));
    }
  };

  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ role }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {role}
      </MDTypography>
    </MDBox>
  );

  const rows = users.map((user) => ({
    author: (
      <Author
        image={`/PI/image/profile/${user.username}`}
        name={`${user.firstName} ${user.lastName}`}
        email={user.email}
      />
    ),
    function: <Job role={user.role} />,
    username: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {user.username}
      </MDTypography>
    ),
    city: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {user.city}
      </MDTypography>
    ),
    phoneNumber: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {user.phoneNumber}
      </MDTypography>
    ),
    status: (
      <MDBox ml={-1}>
        <MDBadge
          badgeContent={user.isNotLocked === 0 ? "Locked" : "Not Locked"}
          color={user.isNotLocked === 0 ? "error" : "success"}
          variant="gradient"
          size="sm"
        />
      </MDBox>
    ),
    employed: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {formatDate(user.joinDate)}
      </MDTypography>
    ),
    lastLogin: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {formatDate(user.lastLoginDate)}
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" alignItems="center">
        {/* <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
          style={{ marginRight: 8 }}
        >
          Edit
        </MDTypography> */}
        <MDButton
          variant="text"
          color="error"
          size="small"
          onClick={() => handleDelete(user.username)}
        >
          Delete
        </MDButton>
      </MDBox>
    ),
  }));

  return {
    columns: [
      { Header: "Users", accessor: "author", width: "20%", align: "left" },
      { Header: "Username", accessor: "username", align: "left" },
      { Header: "City", accessor: "city", width: "10%", align: "center" },
      { Header: "Phone Number", accessor: "phoneNumber", width: "10%", align: "center" },
      { Header: "Role", accessor: "function", align: "left" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Join Date", accessor: "employed", align: "center" },
      { Header: "Last Login Date", accessor: "lastLogin", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: rows,
  };
}
