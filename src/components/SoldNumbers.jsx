/* eslint-disable react/prop-types */

import { Button } from "@mui/material";

const SoldNumbersButton = ({ onClick, soldNumbersCount }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      style={{ backgroundColor: "#6B5B95", color: "white" }}
    >
      Ver Números Vendidos ({soldNumbersCount})
    </Button>
  );
};

export default SoldNumbersButton;