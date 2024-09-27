import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PostCardFeed from "examples/Cards/PostCardFeed/PostCardFeed";
import homeDecor1 from "assets/images/home-decor-1.jpg";

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function DashboardPosts() {
  const [posts, setPosts] = useState([]);
  const [likesData, setLikesData] = useState({});
  const [commentsData, setCommentsData] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8089/PI/api/posts/all", {
          method: "GET",
        });
        if (response.ok) {
          const postsData = await response.json();
          console.log("Posts fetched:", postsData); // Debugging: Check posts data
          setPosts(postsData);

          // Fetch likes and comments for each post
          postsData.forEach((post) => {
            fetchLikes(post.id);
            fetchComments(post.id);
          });
        } else {
          console.error("Error fetching posts:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    // Fetch likes for a specific post
    const fetchLikes = async (postId) => {
      try {
        const response = await fetch(`http://localhost:8089/PI/api/posts/likes/${postId}`, {
          method: "GET",
        });
        if (response.ok) {
          const likes = await response.json();
          console.log(`Likes for post ${postId}:`, likes); // Debugging: Check likes data
          setLikesData((prev) => ({ ...prev, [postId]: likes.length }));
          console.log(`Likes data for post ${postId}:`, likes.length); // Assuming likes is an array
        }
      } catch (error) {
        console.error(`Error fetching likes for post ${postId}:`, error);
      }
    };

    // Fetch comments for a specific post
    const fetchComments = async (postId) => {
      try {
        const response = await fetch(`http://localhost:8089/PI/api/posts/comments/${postId}`, {
          method: "GET",
        });
        if (response.ok) {
          const comments = await response.json();
          console.log(`Comments for post ${postId}:`, comments); // Debugging: Check comments data
          setCommentsData((prev) => ({ ...prev, [postId]: comments })); // Assuming comments is an array
        }
      } catch (error) {
        console.error(`Error fetching comments for post ${postId}:`, error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <MDBox py={3}>
        <MDTypography variant="h4">Posts Section</MDTypography>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8}>
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCardFeed
                  key={post.id}
                  postId={post.id}
                  image={post.imageUrl || homeDecor1}
                  title={post.title}
                  content={post.content}
                  author={post.username}
                  date={formatDate(post.date)}
                  likes={likesData[post.id] || 0}
                  comments={commentsData[post.id] || []}
                  // action={{
                  //   type: "internal",
                  //   route: `/posts/${post.id}`,
                  //   color: "info",
                  //   label: "Voir le post",
                  // }}
                />
              ))
            ) : (
              <MDTypography variant="h6" align="center" fullWidth>
                Aucun post disponible
              </MDTypography>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default DashboardPosts;
