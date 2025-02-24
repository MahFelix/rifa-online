/* eslint-disable react/prop-types */
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const LoginDialog = ({ open, onClose, adminEmail, onAdminEmailChange, adminPassword, onAdminPasswordChange, onLogin }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Login Admin</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={adminEmail}
          onChange={onAdminEmailChange}
        />
        <TextField
          margin="dense"
          label="Senha"
          type="password"
          fullWidth
          value={adminPassword}
          onChange={onAdminPasswordChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={onLogin} color="primary">
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;