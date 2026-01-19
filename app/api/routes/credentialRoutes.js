// app/api/routes/credentialRoutes.js
const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.join(__dirname, "../../../db/pretorian.db");
const db = new sqlite3.Database(dbPath);

// Crear nueva credencial
router.post("/add", (req, res) => {
  const { userId, serviceName, serviceUser, encryptedPassword, notes } =
    req.body;

  if (!userId || !serviceName || !encryptedPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Campos obligatorios faltantes" });
  }

  db.run(
    `INSERT INTO Credential (user_id, service_name, service_user, encrypted_password, notes) VALUES (?, ?, ?, ?, ?)`,
    [userId, serviceName, serviceUser, encryptedPassword, notes || ""],
    function (err) {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, id: this.lastID });
    },
  );
});

// Listar credenciales por usuario
router.get("/list/:userId", (req, res) => {
  const { userId } = req.params;
  db.all(
    `SELECT * FROM Credential WHERE user_id = ?`,
    [userId],
    (err, rows) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, credentials: rows });
    },
  );
});

module.exports = router;
