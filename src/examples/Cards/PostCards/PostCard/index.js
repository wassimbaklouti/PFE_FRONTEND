import { useState } from "react";
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

function PostCard({ postId, image, title, content, username, onDeletePost }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [originalTitle, setOriginalTitle] = useState(title);
  const [updatedContent, setUpdatedContent] = useState(content);
  const [originalContent, setOriginalContent] = useState(content);
  const [imageFile, setImageFile] = useState(null); // For storing the image file

  // Function to handle opening the update dialog
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  // Function to handle closing the update dialog
  const handleClose = () => {
    setOpenDialog(false);
  };

  // Function to handle updating the post
  const handleUpdate = async () => {
    try {
      // Prepare the form data
      const formData = new FormData();
      formData.append("username", username);
      formData.append("title", updatedTitle);
      formData.append("content", updatedContent);
      if (imageFile) {
        formData.append("imageFile", imageFile); // Add image only if it exists
      }

      // Send the PUT request to the backend
      const response = await axios.put(`/PI/api/posts/update/${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post updated successfully:", response.data);
      handleClose();
      setOriginalContent(updatedContent);
      setOriginalTitle(updatedTitle);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  // Function to handle deleting the post
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/PI/api/posts/delete-post/${postId}`);
      console.log("Post deleted successfully:", response.data);
      onDeletePost();
      // Optionally, you can add logic to remove the post from the UI after deletion,
      // such as navigating away, showing a confirmation message, etc.
    } catch (error) {
      console.error("Error deleting post:", error);
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
          title={title}
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
            {originalTitle}
          </MDTypography>
        </MDBox>
        <MDBox mb={3} lineHeight={0}>
          <MDTypography variant="button" fontWeight="light" color="text">
            {originalContent}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDButton variant="outlined" size="small" color="primary" onClick={handleClickOpen}>
            Update Post
          </MDButton>
          <MDButton variant="outlined" size="small" color="error" onClick={handleDelete}>
            Delete Post
          </MDButton>
        </MDBox>
      </MDBox>

      {/* Dialog for updating the post */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Update Post</DialogTitle>
        <DialogContent>
          <DialogContentText>To update this post, please edit the fields below.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Content"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
          />
          {/* File input for updating the image */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
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

// Typechecking props for the PostCard
PostCard.propTypes = {
  postId: PropTypes.string.isRequired, // Ensure postId is passed as prop
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  onDeletePost: PropTypes.func,
};

export default PostCard;
