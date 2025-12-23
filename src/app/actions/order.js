import * as types from "../constants/actionTypes";

export const fetchOrdersStart = () => ({
  type: types.FETCH_ORDERS_START,
});

export const fetchOrdersSuccess = (data) => ({
  type: types.FETCH_ORDERS_SUCCESS,
  payload: data,
});

export const fetchOrdersFail = (error) => ({
  type: types.FETCH_ORDERS_FAIL,
  payload: error,
});

export const deleteOrderStart = () => ({
  type: types.DELETE_ORDER_START,
});

export const deleteOrderSuccess = (id) => ({
  type: types.DELETE_ORDER_SUCCESS,
  payload: id,
});

export const deleteOrderFail = (error) => ({
  type: types.DELETE_ORDER_FAIL,
  payload: error,
});

export const setFilterParams = (params) => ({
  type: types.SET_FILTER_PARAMS,
  payload: params,
});
