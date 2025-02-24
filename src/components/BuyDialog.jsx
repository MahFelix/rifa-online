/* eslint-disable react/prop-types */
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const BuyDialog = ({ open, onClose, buyerName, onBuyerNameChange, selectedNumbers, totalPrice, onBuyClick }) => {
  // Verifica se o campo "Nome e Sobrenome" está preenchido
  const isBuyerNameValid = buyerName.trim() !== "";

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Comprar Números Selecionados</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Seu Nome e Sobrenome"
          type="text"
          fullWidth
          value={buyerName}
          onChange={onBuyerNameChange}
        />
        <p>Números Selecionados: {selectedNumbers.join(", ")}</p>
        <p>Preço Total: R$ {totalPrice.toFixed(2)}</p>
        <h3>
          Todos os números serão validados via whatsapp, após o envio do comprovante de pagamento<br></br> Victor Hugo{" "}
          <br></br>Pix(CPF): 064.315.635-65
        </h3>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={onBuyClick} color="primary" disabled={!isBuyerNameValid}>
          COMPRAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BuyDialog;