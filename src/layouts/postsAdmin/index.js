import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PostCardFeed from "examples/Cards/PostCardFeed/PostCardFeed";
import homeDecor1 from "assets/images/home-decor-1.jpg";
import CircularProgress from "@mui/material/CircularProgress";
import Sidenav from "examples/Sidenav";
import routes from "routes";

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function DashboardPostsAdmin() {
  const [posts, setPosts] = useState([]);
  const [likesData, setLikesData] = useState({});
  const [commentsData, setCommentsData] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [refrech, setRefrech] = useState(false);

  const handleRefrech = () => {
    if (refrech) {
      setRefrech(false);
    } else {
      setRefrech(true);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8089/PI/api/posts/all", {
          method: "GET",
        });
        if (response.ok) {
          const postsData = await response.json();
          console.log("Posts fetched:", postsData);
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
      } finally {
        setLoading(false); // Set loading to false once the fetch completes
      }
    };

    const fetchLikes = async (postId) => {
      try {
        const response = await fetch(`http://localhost:8089/PI/api/posts/likes/${postId}`, {
          method: "GET",
        });
        if (response.ok) {
          const likes = await response.json();
          console.log(`Likes for post ${postId}:`, likes);
          setLikesData((prev) => ({ ...prev, [postId]: likes.length }));
        }
      } catch (error) {
        console.error(`Error fetching likes for post ${postId}:`, error);
      }
    };

    const fetchComments = async (postId) => {
      try {
        const response = await fetch(`http://localhost:8089/PI/api/posts/comments/${postId}`, {
          method: "GET",
        });
        if (response.ok) {
          const comments = await response.json();
          console.log(`Comments for post ${postId}:`, comments);
          setCommentsData((prev) => ({ ...prev, [postId]: comments }));
        }
      } catch (error) {
        console.error(`Error fetching comments for post ${postId}:`, error);
      }
    };

    fetchPosts();
  }, [refrech]);

  return (
    <DashboardLayout>
      <Sidenav color={"info"} brandName="Admin Dashboard" routes={routes} />
      {/* <DashboardNavbar /> */}
      <MDBox justifyContent="flex-end" ml={33}>
        <MDBox py={3}>
          {loading ? (
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100vh"
              width="100vw"
              position="absolute"
              top={0}
              bgcolor="background.default"
            >
              <CircularProgress />
            </MDBox>
          ) : (
            <>
              <MDTypography variant="h4" ml={2} mb={5}>
                Posts Section
              </MDTypography>
              <Grid container justifyContent="center">
                <Grid item xs={12} md={8}>
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <PostCardFeed
                        key={post.id}
                        postId={post.id}
                        image={post.image_url || homeDecor1}
                        title={post.title}
                        content={post.content}
                        author={post.username}
                        date={formatDate(post.date)}
                        onDeletePost={handleRefrech}
                        likes={likesData[post.id] || 0}
                        comments={commentsData[post.id] || []}
                      />
                    ))
                  ) : (
                    <MDTypography variant="h6" align="center">
                      No Post Available
                    </MDTypography>
                  )}
                </Grid>
              </Grid>
            </>
          )}
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default DashboardPostsAdmin;
