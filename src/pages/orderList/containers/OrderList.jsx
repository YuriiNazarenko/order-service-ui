import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  CircularProgress,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";

import { apiService } from "../../../api/mockService";
import {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFail,
  deleteOrderStart,
  deleteOrderSuccess,
  deleteOrderFail,
  setFilterParams,
} from "../../../app/actions/order";

import {
  setNotification,
  clearNotification,
} from "../../../app/actions/notification";
const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { list, total, loading, deleting, filterParams } = useSelector(
    (state) => state.orders
  );

  const page = parseInt(searchParams.get("page") || "1");
  const filterName = searchParams.get("name") || "";
  const filterClient = searchParams.get("client") || "";

  const [nameInput, setNameInput] = useState(filterName);
  const [clientInput, setClientInput] = useState(filterClient);

  const loadOrders = useCallback(
    async (p, name, client) => {
      dispatch(fetchOrdersStart());
      try {
        const data = await apiService.getOrders(p, 10, { name, client });
        dispatch(fetchOrdersSuccess(data));
      } catch (error) {
        dispatch(fetchOrdersFail(error.message));
        dispatch(setNotification(`Помилка: ${error.message}`, "error"));
        setTimeout(() => dispatch(clearNotification()), 4000);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const urlPage = searchParams.get("page");
    if (
      !urlPage &&
      (filterParams.page !== 1 || filterParams.name || filterParams.client)
    ) {
      setSearchParams({
        page: filterParams.page,
        name: filterParams.name,
        client: filterParams.client,
      });
    }
  }, []);

  useEffect(() => {
    setNameInput(filterName);
    setClientInput(filterClient);

    dispatch(setFilterParams({ page, name: filterName, client: filterClient }));

    loadOrders(page, filterName, filterClient);
  }, [page, filterName, filterClient, dispatch, loadOrders]);

  const handleApplyFilter = () => {
    setSearchParams({
      page: 1,
      name: nameInput,
      client: clientInput,
    });
  };

  const handlePageChange = (event, value) => {
    setSearchParams({
      page: value,
      name: filterName,
      client: filterClient,
    });
  };

  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    dispatch(deleteOrderStart());
    try {
      await apiService.deleteOrder(deleteId);
      dispatch(deleteOrderSuccess(deleteId));
      dispatch(setNotification("Сутність успішно видалена", "success"));
      setTimeout(() => dispatch(clearNotification()), 4000);
      setDeleteId(null);
    } catch (error) {
      dispatch(deleteOrderFail(error.message));
      dispatch(setNotification(`Помилка: ${error.message}`, "error"));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Список Замовлень</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/orders/new")}
        >
          Додати сутність
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Назва замовлення"
            size="small"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <TextField
            label="Клієнт"
            size="small"
            value={clientInput}
            onChange={(e) => setClientInput(e.target.value)}
          />
          <Button variant="contained" onClick={handleApplyFilter}>
            Пошук
          </Button>
        </Stack>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Назва</TableCell>
              <TableCell>Клієнт</TableCell>
              <TableCell>Сума</TableCell>
              <TableCell align="right">Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress sx={{ m: 2 }} />
                </TableCell>
              </TableRow>
            ) : (
              list.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => navigate(`/orders/${row.id}`)}
                  sx={{
                    cursor: "pointer",
                    "&:hover .delete-btn": { visibility: "visible" },
                  }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.orderName}</TableCell>
                  <TableCell>{row.clientName}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      className="delete-btn"
                      sx={{ visibility: "hidden" }}
                      color="error"
                      onClick={(e) => handleDeleteClick(e, row.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.ceil(total / 10)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      <Dialog open={!!deleteId} onClose={() => !deleting && setDeleteId(null)}>
        <DialogTitle>Підтвердження видалення</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Видалити замовлення #{deleteId}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} disabled={deleting}>
            Скасувати
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            autoFocus
            disabled={deleting}
          >
            {deleting ? "Видалення..." : "Видалити"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderList;
