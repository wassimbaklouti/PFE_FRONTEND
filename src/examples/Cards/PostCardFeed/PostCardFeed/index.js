import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import CardContent from "@mui/material/CardContent";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import IconButton from "@mui/material/IconButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ShareIcon from "@mui/icons-material/Share";
import MDButton from "components/MDButton";
import TextField from "@mui/material/TextField";
import { blue, grey } from "@mui/material/colors";

function PostCardFeed({ postId, image, title, content, author, date, action }) {
  const [likes, setLikes] = useState(0); // Manage likes
  const [comment, setComment] = useState(""); // Temporary comment
  const [comments, setComments] = useState([]); // Manage comments
  const [hasLiked, setHasLiked] = useState(false); // Track if the user has liked the post
  const [commentVisible, setCommentVisible] = useState(false); // Manage visibility of comment form
  const [connectedUser, setConnectedUser] = useState(null); // User info

  // Fetch likes, comments, and like status when the component loads
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

            // Check if the user has already liked the post
            const likedResponse = await fetch(
              `http://localhost:8089/PI/api/posts/has-liked?postId=${postId}&username=${data.username}`
            );
            if (likedResponse.ok) {
              const likedData = await likedResponse.json();
              setHasLiked(likedData);
              console.log("like status 2 ", likedData);
            }
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    console.log("like status ", hasLiked);
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
    fetchLikes();
    fetchComments();
  }, [postId]); // Only re-run when postId changes

  // Handle likes and unlikes
  const handleLike = async () => {
    try {
      if (hasLiked) {
        // Unlike the post
        const response = await fetch(
          `http://localhost:8089/PI/api/posts/unlike?postId=${postId}&username=${connectedUser.username}`,
          {
            method: "POST",
          }
        );
        if (response.ok) {
          setLikes(likes - 1); // Decrease the likes count
          setHasLiked(false); // Mark the post as not liked
        }
      } else {
        // Like the post
        const response = await fetch(
          `http://localhost:8089/PI/api/posts/like?postId=${postId}&username=${connectedUser.username}`,
          {
            method: "POST",
          }
        );
        if (response.ok) {
          setLikes(likes + 1); // Increase the likes count
          setHasLiked(true); // Mark the post as liked
        }
      }
    } catch (error) {
      console.error("Error liking or unliking the post:", error);
    }
  };

  // Submit a comment
  const handleSubmitComment = async () => {
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
        setComment(""); // Clear comment input
      }
    } catch (error) {
      console.error("Error submitting the comment:", error);
    }
    console.log("like status ", hasLiked);
  };

  return (
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
      {/* Post header: Author's avatar, name, and date */}
      <MDBox display="flex" alignItems="center" mb={2}>
        <Avatar alt={author} src="/static/images/avatar/1.jpg" />
        <MDBox ml={2}>
          <MDTypography variant="h6">{author}</MDTypography>
          <MDTypography variant="caption" color="textSecondary">
            {date}
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* Post image */}
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
            }}
          />
        </MDBox>
      )}

      {/* Post content */}
      <CardContent>
        <MDTypography variant="body1" mb={2}>
          {content}
        </MDTypography>
      </CardContent>

      {/* Post actions: Like, Comment, Share */}
      <MDBox display="flex" justifyContent="space-between" mt={2}>
        <IconButton onClick={handleLike}>
          <ThumbUpIcon sx={{ color: hasLiked ? blue[500] : grey[500] }} />
          <MDTypography variant="button" ml={1}>
            Like ({likes})
          </MDTypography>
        </IconButton>
        <IconButton onClick={() => setCommentVisible(!commentVisible)}>
          <ChatBubbleIcon />
          <MDTypography variant="button" ml={1}>
            Comment
          </MDTypography>
        </IconButton>
        <IconButton>
          <ShareIcon />
          <MDTypography variant="button" ml={1}>
            Share
          </MDTypography>
        </IconButton>
      </MDBox>

      {/* Comment form (hidden until the Comment button is pressed) */}
      {commentVisible && (
        <MDBox mt={2}>
          <TextField
            label="Ajouter un commentaire"
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <MDButton onClick={handleSubmitComment} color="info" variant="contained" fullWidth>
            Envoyer
          </MDButton>
        </MDBox>
      )}

      {/* Comments list */}
      <MDBox mt={2}>
        {comments.map((c, index) => (
          <MDBox key={index} mb={1}>
            <MDTypography variant="caption">{c.username}:</MDTypography>
            <MDTypography variant="body2">{c.content}</MDTypography>
          </MDBox>
        ))}
      </MDBox>

      {/* See more details button */}
      <MDBox display="flex" justifyContent="flex-end" mt={2}>
        {action.type === "internal" ? (
          <MDButton
            component={Link}
            to={action.route}
            variant="outlined"
            size="small"
            color={action.color}
          >
            {action.label}
          </MDButton>
        ) : (
          <MDButton
            component="a"
            href={action.route}
            target="_blank"
            rel="noreferrer"
            variant="outlined"
            size="small"
            color={action.color}
          >
            {action.label}
          </MDButton>
        )}
      </MDBox>
    </Card>
  );
}

PostCardFeed.propTypes = {
  postId: PropTypes.string.isRequired,
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  action: PropTypes.object.isRequired,
};

export default PostCardFeed;
