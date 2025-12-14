let usuariosDB = [
  { id: 1, nombre: "Ana López", edad: 28 },
  { id: 2, nombre: "Carlos Ruiz", edad: 35 },
  { id: 3, nombre: "Beatriz Méndez", edad: 42 },
  { id: 4, nombre: "David Vega", edad: 22 },
  { id: 5, nombre: "Elena Saiz", edad: 31 },
  { id: 6, nombre: "Fernando Gil", edad: 29 },
];

export const fetchUsers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...usuariosDB];
};

export const addUser = async (nuevoUsuario) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const nuevoId =
    usuariosDB.length > 0 ? Math.max(...usuariosDB.map((u) => u.id)) + 1 : 1;
  const usuarioConId = { id: nuevoId, ...nuevoUsuario };
  usuariosDB.push(usuarioConId);
  return usuarioConId;
};

export const deleteUsers = async (idsAEliminar) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  usuariosDB = usuariosDB.filter((user) => !idsAEliminar.includes(user.id));
  return true;
};
