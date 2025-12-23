import * as types from "../../app/constants/actionTypes";

const initialOrdersState = {
  list: [],
  total: 0,
  loading: false,
  error: null,
  deleting: false,
  filterParams: {
    page: 1,
    name: "",
    client: "",
  },
};

export const ordersReducer = (state = initialOrdersState, action) => {
  switch (action.type) {
    case types.SET_FILTER_PARAMS:
      return {
        ...state,
        filterParams: { ...state.filterParams, ...action.payload },
      };
    case types.FETCH_ORDERS_START:
      return { ...state, loading: true, error: null };
    case types.FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload.data,
        total: action.payload.total,
      };
    case types.FETCH_ORDERS_FAIL:
      return { ...state, loading: false, error: action.payload };

    case types.DELETE_ORDER_START:
      return { ...state, deleting: true };
    case types.DELETE_ORDER_SUCCESS:
      return {
        ...state,
        deleting: false,
        list: state.list.filter((item) => item.id !== action.payload),
      };
    case types.DELETE_ORDER_FAIL:
      return { ...state, deleting: false };

    default:
      return state;
  }
};
