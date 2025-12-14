import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import { UserList } from "./components/UserList";
import { UserAdd } from "./components/UserAdd";

function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Gestión de Usuarios</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/add" element={<UserAdd />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
