/* eslint-disable react/prop-types */
import { TextField, Select, MenuItem, Box } from "@mui/material";

const SearchBar = ({ value, onChange, searchType, onSearchTypeChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <TextField
        label={searchType === 'number' ? "Buscar número" : "Buscar nome"}
        variant="outlined"
        type={searchType === 'number' ? "number" : "text"}
        value={value}
        onChange={onChange}
        sx={{ backgroundColor: "white", borderRadius: "5px", width: "300px" }}
      />
      <Select
        value={searchType}
        onChange={onSearchTypeChange}
        sx={{ height: '56px', backgroundColor: "white" }}
      >
        <MenuItem value="number">Número</MenuItem>
        <MenuItem value="name">Nome</MenuItem>
      </Select>
    </Box>
  );
};

export default SearchBar;