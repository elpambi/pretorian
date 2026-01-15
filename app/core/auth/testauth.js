// app/core/auth/testauth.js
const { registerUser, loginUser, lockSession } = require("./auth");

// --- Registro de prueba ---
registerUser("alice", "miSuperClave123");

// Esperamos 1s para que se inserte en la DB
setTimeout(() => {
  // --- Login correcto ---
  loginUser("alice", "miSuperClave123");

  // --- Login incorrecto ---
  setTimeout(() => loginUser("alice", "claveIncorrecta"), 500);

  // --- Bloqueo de sesión ---
  setTimeout(() => lockSession(), 1000);
}, 1000);
