/* eslint-disable react/prop-types */

import { TextField } from "@mui/material";

const SearchBar = ({ value, onChange }) => {
  return (
    <TextField
      label="Buscar número"
      variant="outlined"
      type="number"
      value={value}
      onChange={onChange}
      sx={{ backgroundColor: "white", borderRadius: "5px", width: "300px" }}
    />
  );
};

export default SearchBar;