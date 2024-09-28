import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";

function ProfileInfoCard({ title, description, info, action, shadow }) {
  const renderItems = Object.entries(info).map(([key, value]) => (
    <MDBox key={key} display="flex" alignItems="center" py={1.5} pr={2} marginLeft="10px">
      {key === "FirstName" && <PersonIcon color="action" sx={{ fontSize: "1.5rem", mr: 1.5 }} />}
      {key === "LastName" && <PersonIcon color="action" sx={{ fontSize: "1.5rem", mr: 1.5 }} />}
      {key === "UserName" && <PersonIcon color="action" sx={{ fontSize: "1.5rem", mr: 1.5 }} />}
      {key === "email" && <EmailIcon color="action" sx={{ fontSize: "1.5rem", mr: 1.5 }} />}
      {key === "PhoneNumber" && <PhoneIcon color="action" sx={{ fontSize: "1.5rem", mr: 1.5 }} />}
      {key === "City" && <LocationIcon color="action" sx={{ fontSize: "1.5rem", mr: 1.5 }} />}

      <MDTypography
        variant="button"
        fontWeight="bold"
        textTransform="capitalize"
        color="text.primary"
      >
        {key.replace(/([A-Z])/g, " $1").trim()}: &nbsp;
      </MDTypography>
      <MDTypography variant="button" fontWeight="regular" color="text.secondary">
        &nbsp;{value}
      </MDTypography>
    </MDBox>
  ));

  return (
    <Card sx={{ height: "100%", width: "100%", boxShadow: !shadow && "none", borderRadius: 2 }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography
          variant="h5"
          fontWeight="medium"
          textTransform="capitalize"
          color="text.primary"
        >
          {title}
        </MDTypography>
        <MDTypography component="span" variant="body2" color="secondary" onClick={action.onClick}>
          <Tooltip title={action.tooltip} placement="top">
            <Icon>edit</Icon>
          </Tooltip>
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <MDBox mt={2}> {renderItems} </MDBox>
      </MDBox>
    </Card>
  );
}

ProfileInfoCard.defaultProps = {
  shadow: true,
};

ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  info: PropTypes.objectOf(PropTypes.string).isRequired,
  action: PropTypes.shape({
    route: PropTypes.string,
    tooltip: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  }).isRequired,
  shadow: PropTypes.bool,
};

export default ProfileInfoCard;
