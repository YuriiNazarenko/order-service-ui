import { combineReducers } from "redux";
import { ordersReducer } from "../reducers/order";
import { notificationReducer } from "../reducers/notification";

import user from "./user";

export default combineReducers({
  user,
  orders: ordersReducer,
  notification: notificationReducer,
});
