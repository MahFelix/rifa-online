/* eslint-disable react/prop-types */

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const SoldNumbersDialog = ({ open, onClose, soldNumbersSearch, onSoldNumbersSearchChange, filteredSoldNumbers, isAdmin, onUnmarkNumber }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Números Vendidos</DialogTitle>
      <DialogContent>
        <TextField
          label="Buscar número vendido"
          variant="outlined"
          type="number"
          value={soldNumbersSearch}
          onChange={onSoldNumbersSearchChange}
          sx={{ backgroundColor: "white", borderRadius: "5px", width: "100%", marginBottom: "20px" }}
        />
        {filteredSoldNumbers.length === 0 ? (
          <p>Nenhum número vendido encontrado.</p>
        ) : (
          <ul>
            {filteredSoldNumbers.map((item) => (
              <li key={item.id}>
                Número {item.number} - Comprado por: {item.buyer}
                {isAdmin && (
                  <Button color="secondary" onClick={() => onUnmarkNumber(item.id)} style={{ marginLeft: "10px" }}>
                    Desmarcar
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SoldNumbersDialog;