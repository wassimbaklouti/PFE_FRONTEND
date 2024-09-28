import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import EditIcon from "@mui/icons-material/Edit";
import CardContent from "@mui/material/CardContent";
import MDBox from "components/MDBox";
import DeleteIcon from "@mui/icons-material/Delete";
import MDTypography from "components/MDTypography";
import IconButton from "@mui/material/IconButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MDButton from "components/MDButton";
import SendIcon from "@mui/icons-material/Send";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ExpandCircleDownRoundedIcon from "@mui/icons-material/ExpandCircleDownRounded";
import { blue, grey } from "@mui/material/colors";

function PostCardFeed({ postId, image, title, content, author, date, action }) {
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [connectedUser, setConnectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false); // Manage dialog visibility
  const [authorProfile, setAuthorProfile] = useState(null); // Author info including profile image
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  useEffect(() => {
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

            const likedResponse = await fetch(
              `http://localhost:8089/PI/api/posts/has-liked?postId=${postId}&username=${data.username}`
            );
            if (likedResponse.ok) {
              const likedData = await likedResponse.json();
              setHasLiked(likedData);
            }
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    const fetchAuthorProfile = async () => {
      try {
        const response = await fetch(`/PI/find/${author}`);
        if (response.ok) {
          const data = await response.json();
          setAuthorProfile(data);
        }
      } catch (error) {
        console.error("Error fetching author profile:", error);
      }
    };

    const fetchLikes = async () => {
      try {
        const response = await fetch(`http://localhost:8089/PI/api/posts/likes/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setLikes(data.length);
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8089/PI/api/posts/comments/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchConnectedUser();
    fetchAuthorProfile(); // Fetch author profile on mount
    fetchLikes();
    fetchComments();
  }, [postId, author]);

  const handleLike = async () => {
    try {
      if (hasLiked) {
        const response = await fetch(
          `http://localhost:8089/PI/api/posts/unlike?postId=${postId}&username=${connectedUser.username}`,
          {
            method: "POST",
          }
        );
        if (response.ok) {
          setLikes(likes - 1);
          setHasLiked(false);
        }
      } else {
        const response = await fetch(
          `http://localhost:8089/PI/api/posts/like?postId=${postId}&username=${connectedUser.username}`,
          {
            method: "POST",
          }
        );
        if (response.ok) {
          setLikes(likes + 1);
          setHasLiked(true);
        }
      }
    } catch (error) {
      console.error("Error liking or unliking the post:", error);
    }
  };

  const handleSubmitComment = async () => {
    if (!editingCommentId) {
      try {
        const response = await fetch(
          `http://localhost:8089/PI/api/posts/comment?postId=${postId}&username=${connectedUser.username}&content=${comment}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.ok) {
          const newComment = await response.json();
          setComments([...comments, newComment]);
          setComment("");
        }
      } catch (error) {
        console.error("Error submitting the comment:", error);
      }
    } else {
      handleUpdateComment(editingCommentId);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`/PI/api/posts/comments/delete/${commentId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setComments(comments.filter((c) => c.id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  const handleUpdateComment = async (commentId) => {
    try {
      const response = await fetch(`/PI/api/posts/comments/update/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
      });
      if (response.ok) {
        const updatedComment = await response.json();
        setComments(
          comments.map((c) => (c.id === commentId ? { ...c, content: updatedComment.content } : c))
        );
        setComment("");
        setEditingCommentId(null); // Exit edit mode
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };
  const handleEditClick = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditingContent(currentContent);
    setComment(currentContent);
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          marginBottom: "20px",
          padding: "16px",
        }}
      >
        <MDBox display="flex" alignItems="center" mb={2}>
          <Avatar
            alt={author}
            src={authorProfile?.profileImageUrl || "/static/images/avatar/1.jpg"} // Fetched profile image
          />
          <MDBox ml={2}>
            <MDTypography variant="h6">{author}</MDTypography>
            <MDTypography variant="caption" color="textSecondary">
              {date}
            </MDTypography>
          </MDBox>
        </MDBox>

        {image && (
          <MDBox mb={2}>
            <CardMedia
              component="img"
              image={image}
              title={title}
              sx={{
                borderRadius: "10px",
                maxHeight: "400px",
                objectFit: "cover",
                display: "block",
                margin: "auto",
                maxWidth: "100%",
              }}
            />
          </MDBox>
        )}

        <CardContent>
          <MDTypography variant="body1" mb={2}>
            {content}
          </MDTypography>
        </CardContent>

        <MDBox display="flex" justifyContent="space-between" mt={2}>
          <IconButton onClick={handleLike}>
            <ThumbUpIcon sx={{ color: hasLiked ? blue[500] : grey[500] }} />
            <MDTypography variant="button" ml={1}>
              Like ({likes})
            </MDTypography>
          </IconButton>
          <IconButton onClick={() => setDialogOpen(true)}>
            <ChatBubbleIcon />
            <MDTypography variant="button" ml={1}>
              Comment
            </MDTypography>
          </IconButton>
          <IconButton onClick={() => setDialogOpen(true)}>
            <VisibilityIcon />
            <MDTypography variant="button" ml={1}>
              Show post
            </MDTypography>
          </IconButton>
        </MDBox>

        {/* Display only three comments */}
        <MDBox mt={2}>
          {comments.slice(0, 2).map((c, index) => (
            <MDBox key={index} mb={1}>
              <MDTypography variant="caption">{c.username}:</MDTypography>
              <MDTypography variant="body2">{c.content}</MDTypography>
            </MDBox>
          ))}
          {comments.length > 2 && (
            <IconButton onClick={() => setDialogOpen(true)}>
              <ExpandCircleDownRoundedIcon />
              <MDTypography variant="button" ml={1}>
                Show more comments
              </MDTypography>
            </IconButton>
          )}
        </MDBox>
      </Card>

      {/* Dialog for showing the full post */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
        <DialogContent>
          <MDBox display="flex" alignItems="center" mb={2}>
            <Avatar
              alt={author}
              src={authorProfile?.profileImageUrl || "/static/images/avatar/1.jpg"} // Fetched profile image
            />
            <MDBox ml={2}>
              <MDTypography variant="h6">{author}</MDTypography>
              <MDTypography variant="caption" color="textSecondary">
                {date}
              </MDTypography>
            </MDBox>
          </MDBox>

          <MDTypography variant="h5" gutterBottom>
            {title}
          </MDTypography>
          {image && (
            <CardMedia
              component="img"
              image={image}
              title={title}
              sx={{
                borderRadius: "10px",
                maxHeight: "400px",
                objectFit: "cover",
              }}
            />
          )}
          <MDTypography variant="body1" mt={2}>
            {content}
          </MDTypography>

          <MDBox mt={3}>
            {comments.map((c, index) => (
              <MDBox
                key={index}
                mb={1}
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <MDBox>
                  <MDTypography variant="caption">{c.username}:</MDTypography>
                  <MDTypography variant="body2">{c.content}</MDTypography>
                </MDBox>
                {connectedUser?.username === c.username && (
                  <MDBox display="flex" justifyContent="flex-end" alignItems="center">
                    <IconButton
                      onClick={() => handleEditClick(c.id, c.content)}
                      sx={{
                        marginLeft: "auto",
                        color: "inherit", // Default color
                        "&:hover": {
                          color: "blue", // Change color to red on hover
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteComment(c.id)}
                      sx={{
                        marginLeft: "auto",
                        color: "inherit", // Default color
                        "&:hover": {
                          color: "red", // Change color to red on hover
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </MDBox>
                )}
              </MDBox>
            ))}
          </MDBox>
        </DialogContent>
        <DialogActions>
          {connectedUser && (
            <TextField
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSubmitComment}
                      disabled={!comment.trim()} // Disables the button if the comment is empty
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
          <MDButton onClick={() => setDialogOpen(false)}>Close</MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

PostCardFeed.propTypes = {
  postId: PropTypes.number.isRequired,
  image: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  action: PropTypes.func,
};

export default PostCardFeed;
