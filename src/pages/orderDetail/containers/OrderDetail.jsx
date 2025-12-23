import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiService } from "../../../api/mockService";
import {
  setNotification,
  clearNotification,
} from "../../../app/actions/notification";

import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
} from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { filterParams } = useSelector((state) => state.orders);

  const isNew = id === "new";

  const [mode, setMode] = useState(isNew ? "edit" : "view");
  const [loading, setLoading] = useState(!isNew);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    orderName: "",
    clientName: "",
    amount: "",
    description: "",
  });
  const [originalData, setOriginalData] = useState(null);

  const notify = (msg, type = "success") => {
    dispatch(setNotification(msg, type));
    setTimeout(() => dispatch(clearNotification()), 2000);
  };

  useEffect(() => {
    if (!isNew) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await apiService.getOrderById(id);
      setFormData(data);
      setOriginalData(data);
      setLoading(false);
    } catch (error) {
      notify("Не вдалося завантажити дані", "error");
      navigate("/orders");
    }
  };

  const handleBack = () => {
    const queryString = new URLSearchParams({
      page: filterParams.page,
      name: filterParams.name,
      client: filterParams.client,
    }).toString();

    navigate(`/orders?${queryString}`);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.orderName.trim()) newErrors.orderName = "Назва обов'язкова";
    if (!formData.clientName.trim())
      newErrors.clientName = "Клієнт обов'язковий";
    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      Number(formData.amount) <= 0
    ) {
      newErrors.amount = "Введіть коректну ціну";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (isNew) {
        await apiService.createOrder(formData);
        notify("Сутність успішно створена!");
        navigate("/orders");
      } else {
        const updated = await apiService.updateOrder(id, formData);
        setOriginalData(updated);
        setMode("view");
        notify("Зміни збережено успішно");
      }
    } catch (error) {
      notify(error.message || "Сталася помилка на сервері", "error");
    }
  };

  const handleCancel = () => {
    if (isNew) {
      navigate("/orders");
    } else {
      setFormData(originalData);
      setErrors({});
      setMode("view");
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={3} component={Paper} sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton onClick={handleBack}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5">
          {isNew
            ? "Створення замовлення"
            : mode === "edit"
            ? "Редагування"
            : "Перегляд замовлення"}
        </Typography>

        {!isNew && mode === "view" && (
          <IconButton
            sx={{ ml: "auto" }}
            onClick={() => setMode("edit")}
            color="primary"
          >
            <Edit />
          </IconButton>
        )}
      </Stack>

      <Stack spacing={3}>
        <TextField
          label="Назва замовлення"
          fullWidth
          disabled={mode === "view"}
          value={formData.orderName}
          onChange={(e) =>
            setFormData({ ...formData, orderName: e.target.value })
          }
          error={!!errors.orderName}
          helperText={errors.orderName}
        />

        <TextField
          label="Клієнт"
          fullWidth
          disabled={mode === "view"}
          value={formData.clientName}
          onChange={(e) =>
            setFormData({ ...formData, clientName: e.target.value })
          }
          error={!!errors.clientName}
          helperText={errors.clientName}
        />

        <TextField
          label="Сума"
          fullWidth
          type="number"
          disabled={mode === "view"}
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          error={!!errors.amount}
          helperText={errors.amount}
        />

        <TextField
          label="Опис"
          fullWidth
          multiline
          rows={3}
          disabled={mode === "view"}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {mode === "edit" && (
            <>
              <Button variant="outlined" color="inherit" onClick={handleCancel}>
                Скасувати
              </Button>
              <Button variant="contained" color="primary" onClick={handleSave}>
                {isNew ? "Створити" : "Зберегти"}
              </Button>
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default OrderDetail;
