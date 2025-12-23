import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { clearNotification } from "../actions/notification";

const GlobalNotification = () => {
  const { open, message, severity } = useSelector(
    (state) => state.notification
  );
  const dispatch = useDispatch();

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => dispatch(clearNotification())}
    >
      <Alert severity={severity} onClose={() => dispatch(clearNotification())}>
        {message}
      </Alert>
    </Snackbar>
  );
};
export default GlobalNotification;
