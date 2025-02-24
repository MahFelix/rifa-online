/* eslint-disable react/prop-types */

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const PaymentDialog = ({ open, onClose, selectedNumbers, totalPrice, onConfirmPayment }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Detalhes de Pagamento</DialogTitle>
      <DialogContent>
        <p>Números Selecionados: {selectedNumbers.join(", ")}</p>
        <p>Preço Total: R$ {totalPrice.toFixed(2)}</p>
        <h3>Todos os números serão validados via whatsapp, após o envio do comprovante de pagamento<br></br> Victor Hugo <br></br>Pix(CPF): 064.315.635-65</h3>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={onConfirmPayment} color="primary">
          Confirmar Pagamento
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;