import * as types from "../constants/actionTypes";

export const setNotification = (message, severity = "success") => ({
  type: types.SET_NOTIFICATION,
  payload: { message, severity, open: true },
});

export const clearNotification = () => ({
  type: types.CLEAR_NOTIFICATION,
});
