import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function ComplexStatisticsCard({ color, title, count, expertiese, icon, path }) {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleClick = () => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <Card onClick={handleClick} style={{ cursor: "pointer" }}>
      <MDBox display="flex" justifyContent="space-between" pt={1} px={2}>
        <MDBox
          variant="gradient"
          bgColor={color}
          color={color === "light" ? "dark" : "white"}
          coloredShadow={color}
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="6rem"
          height="6rem"
          mt={-3}
        >
          <Icon fontSize="large" color="inherit">
            {icon}
          </Icon>
        </MDBox>
        <MDBox textAlign="right" lineHeight={1.25}>
          <MDTypography variant="h4" fontWeight="medium" color="text" sx={{ mt: 4, mb: 2, mr: 2 }}>
            {title}
          </MDTypography>
        </MDBox>
      </MDBox>
      <Divider sx={{ mt: 7 }} />
      <MDBox pb={2} px={2}>
        <MDTypography variant="h6" fontWeight="bold" color="text" sx={{ ml: 1, mb: 2 }}>
          {count} {count < 2 ? expertiese : `${expertiese}s`} available
        </MDTypography>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of ComplexStatisticsCard
ComplexStatisticsCard.defaultProps = {
  color: "info",
  path: "", // Add default path prop
};

// Typechecking props for the ComplexStatisticsCard
ComplexStatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  title: PropTypes.string.isRequired,
  expertiese: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  path: PropTypes.string, // Add typechecking for the path prop
};

export default ComplexStatisticsCard;
