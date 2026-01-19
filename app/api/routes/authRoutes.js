// app/api/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  lockSession,
} = require("../../core/auth/auth");

// Registro
router.post("/register", (req, res) => {
  const { username, masterPassword } = req.body;
  try {
    registerUser(username, masterPassword);
    res.json({ success: true, message: "Usuario registrado" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Login
router.post("/login", (req, res) => {
  const { username, masterPassword } = req.body;
  try {
    loginUser(username, masterPassword);
    res.json({ success: true, message: "Login correcto" });
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Credenciales incorrectas" });
  }
});

// Bloqueo de sesión
router.post("/lock", (req, res) => {
  lockSession();
  res.json({ success: true, message: "Sesión bloqueada" });
});

module.exports = router;
