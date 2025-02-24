/* eslint-disable react/prop-types */

import { Button } from "@mui/material";

const BuyButton = ({ onClick, disabled, selectedNumbers, totalPrice }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      style={{ marginTop: "10px", marginBottom: "20px", backgroundColor: "#4caf50", color: "white" }}
    >
      Comprar Números Selecionados ({selectedNumbers.length}) - Total: R$ {totalPrice.toFixed(2)}
    </Button>
  );
};

export default BuyButton;