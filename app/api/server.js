// app/api/server.js
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const credentialRoutes = require("./routes/credentialRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();
app.use(express.json()); // parsear JSON

// Rutas
app.use("/auth", authRoutes);
app.use("/credentials", credentialRoutes);
app.use("/password", passwordRoutes);

// Solo escucha en localhost
const PORT = 3000;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`API local escuchando en http://127.0.0.1:${PORT}`);
});
