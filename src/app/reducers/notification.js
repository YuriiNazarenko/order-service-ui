import * as types from "../../app/constants/actionTypes";

const initialNotificationState = {
  open: false,
  message: "",
  severity: "success", // success | error
};

export const notificationReducer = (
  state = initialNotificationState,
  action
) => {
  switch (action.type) {
    case types.SET_NOTIFICATION:
      return { ...action.payload };
    case types.CLEAR_NOTIFICATION:
      return { ...state, open: false };
    default:
      return state;
  }
};
