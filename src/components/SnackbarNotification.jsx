/* eslint-disable react/prop-types */

import { Snackbar } from "@mui/material";

const SnackbarNotification = ({ open, onClose, message }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose} message={message} />
  );
};

export default SnackbarNotification;