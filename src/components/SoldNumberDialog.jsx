/* eslint-disable react/prop-types */
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, Box } from "@mui/material";

const SoldNumbersDialog = ({ 
  open, 
  onClose, 
  soldNumbersSearch, 
  onSoldNumbersSearchChange, 
  filteredSoldNumbers, 
  isAdmin, 
  onUnmarkNumber,
  searchType,
  onSearchTypeChange 
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Números Vendidos</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            label={searchType === 'number' ? "Buscar número vendido" : "Buscar comprador"}
            variant="outlined"
            type={searchType === 'number' ? "number" : "text"}
            value={soldNumbersSearch}
            onChange={onSoldNumbersSearchChange}
            sx={{ backgroundColor: "white", borderRadius: "5px", flexGrow: 1 }}
          />
          <Select
            value={searchType}
            onChange={onSearchTypeChange}
            sx={{ backgroundColor: "white" }}
          >
            <MenuItem value="number">Número</MenuItem>
            <MenuItem value="name">Nome</MenuItem>
          </Select>
        </Box>
        
        {filteredSoldNumbers.length === 0 ? (
          <p>Nenhum número vendido encontrado.</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '10px',
            maxHeight: '60vh',
            overflowY: 'auto',
            padding: '5px'
          }}>
            {filteredSoldNumbers.map((item) => (
              <div key={item.id} style={{
                backgroundColor: '#f5f5f5',
                padding: '10px',
                borderRadius: '5px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>Número {item.number}</strong><br />
                  Comprado por: {item.buyer || 'Não informado'}
                </div>
                {isAdmin && (
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small"
                    onClick={() => onUnmarkNumber(item.id)}
                  >
                    Desmarcar
                  </Button>
                )}
              </div>
            ))}
          </div>
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