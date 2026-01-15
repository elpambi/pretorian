// app/auth.js
const crypto = require("crypto");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Conectar con DB local
const dbPath = path.join(__dirname, "../../../db/pretorian.db");
const db = new sqlite3.Database(dbPath);

// Variable global en memoria
let sessionKey = null;

// ==================== Registro ====================
function registerUser(username, masterPassword) {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, "sha256");
  const hash = crypto.createHash("sha256").update(key).digest("hex");

  if (!username || username.length < 3)
    return console.log("Nombre demasiado corto");
  if (!masterPassword || masterPassword.length < 8)
    return console.log("Contraseña demasiado corta");

  db.run(
    `INSERT INTO User (name, hash_password, salt) VALUES (?, ?, ?)`,
    [username, hash, salt],
    (err) => {
      if (err) console.log("Error al registrar usuario:", err.message);
      else console.log(`Usuario ${username} registrado con éxito`);
    }
  );
}

// ==================== Login ====================
function loginUser(username, masterPassword) {
  db.get(`SELECT * FROM User WHERE name = ?`, [username], (err, row) => {
    if (err) {
      console.log("Error DB:", err.message);
      return;
    }

    // Mensaje genérico → evita enumeración de usuarios
    if (!row) {
      console.log("Credenciales incorrectas");
      return;
    }

    // Derivar clave con el salt almacenado
    const key = crypto.pbkdf2Sync(
      masterPassword,
      row.salt,
      100000,
      32,
      "sha256"
    );

    const hash = crypto.createHash("sha256").update(key).digest("hex");

    const hashBuffer = Buffer.from(hash, "hex");
    const storedHashBuffer = Buffer.from(row.hash_password, "hex");

    // Protección extra (longitud)
    if (hashBuffer.length !== storedHashBuffer.length) {
      console.log("Credenciales incorrectas");
      return;
    }

    // Comparación segura
    const isValid = crypto.timingSafeEqual(hashBuffer, storedHashBuffer);

    if (!isValid) {
      console.log("Credenciales incorrectas");
      return;
    }

    // ✅ Login correcto
    sessionKey = key;
    console.log("Login correcto. Sesión desbloqueada.");
  });
}

// ==================== Bloqueo ====================
function lockSession() {
  if (sessionKey) {
    sessionKey.fill(0);
    sessionKey = null;
    console.log("Sesión bloqueada");
  }
}

// Exportar funciones
module.exports = {
  registerUser,
  loginUser,
  lockSession,
  sessionKey,
};
