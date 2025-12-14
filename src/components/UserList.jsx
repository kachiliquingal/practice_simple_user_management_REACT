import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Button,
  TextField,
  Paper,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TablePagination,
} from "@mui/material";
import { fetchUsers, deleteUsers } from "../api/mockApi";

export const UserList = () => {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["usersList"],
    queryFn: fetchUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUsers,
    onSuccess: () => {
      queryClient.invalidateQueries(["usersList"]);
      setSelectedIds([]);
    },
  });

  const filteredUsers = (users || []).filter((user) =>
    user.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = paginatedUsers.map((n) => n.id);
      setSelectedIds(newSelected);
      return;
    }
    setSelectedIds([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }
    setSelectedIds(newSelected);
  };

  const isSelected = (id) => selectedIds.indexOf(id) !== -1;

  const handleDelete = () => {
    if (selectedIds.length > 0) deleteMutation.mutate(selectedIds);
  };

  if (isLoading)
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;
  if (isError) return <Alert severity="error">Error al cargar datos</Alert>;

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Lista de Usuarios
      </Typography>

      <TextField
        label="Buscar por nombre..."
        variant="outlined"
        fullWidth
        size="small"
        sx={{ mb: 2 }}
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setPage(0);
        }}
      />

      <TableContainer sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedIds.length > 0 &&
                    selectedIds.length < paginatedUsers.length
                  }
                  checked={
                    paginatedUsers.length > 0 &&
                    selectedIds.length === paginatedUsers.length
                  }
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>
                <strong>Nro</strong>
              </TableCell>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Age</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay datos
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((row) => {
                const isItemSelected = isSelected(row.id);
                return (
                  <TableRow
                    key={row.id}
                    hover
                    role="checkbox"
                    selected={isItemSelected}
                    onClick={() => handleClick(row.id)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} />
                    </TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.nombre}</TableCell>
                    <TableCell>{row.edad}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Filas:"
      />

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" component={Link} to="/add">
          Add
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={selectedIds.length === 0 || deleteMutation.isPending}
          onClick={handleDelete}
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
      </Stack>
    </Paper>
  );
};
