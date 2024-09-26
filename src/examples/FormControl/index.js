// examples/FormControlComponent/FormControlComponent.js
import React from "react";
import PropTypes from "prop-types";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";

const FormControlComponent = ({ value, onChange, items }) => {
  return (
    <FormControl>
      <IconButton aria-label="filter" size="small" style={{ marginRight: "8px" }}>
        <FilterListIcon />
      </IconButton>
      <Select
        value={value}
        onChange={onChange}
        displayEmpty
        renderValue={(selected) => (selected ? selected : <em>All cities</em>)}
      >
        <MenuItem value="">
          <em>All cities</em>
        </MenuItem>
        {items.map((item, index) => (
          <MenuItem key={index} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

FormControlComponent.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
};

export default FormControlComponent;
