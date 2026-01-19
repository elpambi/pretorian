// app/api/routes/passwordRoutes.js
const express = require("express");
const router = express.Router();
const {
  generatePassword,
} = require("../../core/GeneratedPassword/passwordGenerator");

// Generar contraseña segura
router.post("/generate", (req, res) => {
  const { length, upper, lower, numbers, symbols } = req.body;

  try {
    const pwd = generatePassword({
      length: length || 16,
      upper: upper ?? true,
      lower: lower ?? true,
      numbers: numbers ?? true,
      symbols: symbols ?? true,
    });
    res.json({ success: true, password: pwd });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
