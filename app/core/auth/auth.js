// app/auth.js
const crypto = require("crypto");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Conectar con DB local
const dbPath = path.join(__dirname, "../../../db/pretorian.db");
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) console.log("No se pudo conectar a la DB:", err.message);
});

// Variable global en memoria
let sessionKey = null;

// ==================== Validación de contraseña fuerte ====================
function isStrongPassword(password) {
  const minLength = 15;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':",.<>/?]/.test(password);

  return (
    password.length >= minLength &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSymbol
  );
}

// ==================== Registro ====================
function registerUser(username, masterPassword) {
  if (!username || username.length < 3) {
    console.log("Nombre de usuario inválido");
    return;
  }

  if (!isStrongPassword(masterPassword)) {
    console.log(
      "Contraseña maestra débil: debe tener mínimo 15 caracteres, mayúsculas, minúsculas, números y símbolos",
    );
    return;
  }

  // Comprobar si el usuario ya existe
  db.get(`SELECT * FROM User WHERE name = ?`, [username], (err, row) => {
    if (err) {
      console.log("Error en la operación");
      return;
    }
    if (row) {
      console.log("Usuario ya existe");
      return;
    }

    // Generar salt y hash
    const salt = crypto.randomBytes(16).toString("hex");
    const key = crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, "sha256");
    const hash = crypto.createHash("sha256").update(key).digest("hex");

    // Insertar en la DB
    db.run(
      `INSERT INTO User (name, hash_password, salt) VALUES (?, ?, ?)`,
      [username, hash, salt],
      (err) => {
        if (err) console.log("Error al registrar usuario:", err.message);
        else console.log(`Usuario ${username} registrado con éxito`);
      },
    );
  });
}

// ==================== Login ====================
function loginUser(username, masterPassword) {
  db.get(`SELECT * FROM User WHERE name = ?`, [username], (err, row) => {
    if (err) {
      console.log("Error en la operación");
      return;
    }

    if (!row) {
      console.log("Credenciales incorrectas");
      return;
    }

    try {
      const key = crypto.pbkdf2Sync(
        masterPassword,
        row.salt,
        100000,
        32,
        "sha256",
      );
      const hash = crypto.createHash("sha256").update(key).digest("hex");

      const hashBuffer = Buffer.from(hash, "hex");
      const storedHashBuffer = Buffer.from(row.hash_password, "hex");

      if (hashBuffer.length !== storedHashBuffer.length) {
        console.log("Credenciales incorrectas");
        return;
      }

      const isValid = crypto.timingSafeEqual(hashBuffer, storedHashBuffer);

      if (!isValid) {
        console.log("Credenciales incorrectas");
        return;
      }

      sessionKey = key;
      console.log("Login correcto. Sesión desbloqueada.");
    } catch {
      console.log("Error en la operación");
    }
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

// ==================== Exportar funciones ====================
module.exports = {
  registerUser,
  loginUser,
  lockSession,
  sessionKey,
};
