import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Paper, Typography, Stack } from "@mui/material";
import { addUser } from "../api/mockApi";

export const UserAdd = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["usersList"]);
      navigate("/");
    },
  });

  const onSubmit = (data) => {
    addMutation.mutate({ ...data, edad: Number(data.edad) });
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Agregar Usuario
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            label="Nombre"
            fullWidth
            {...register("nombre", { required: "Nombre requerido" })}
            error={!!errors.nombre}
            helperText={errors.nombre?.message}
          />
          <TextField
            label="Edad"
            type="number"
            fullWidth
            {...register("edad", {
              required: "Edad requerida",
              valueAsNumber: true,
            })}
            error={!!errors.edad}
            helperText={errors.edad?.message}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={addMutation.isPending}
          >
            Save
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};
