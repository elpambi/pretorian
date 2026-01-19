// testGenerator.js
const { generatePassword } = require("./passwordGenerator");
const { encryptPassword, decryptPassword } = require("./encrypt");

// Simulación de sessionKey (normalmente se obtiene del login)
const crypto = require("crypto");
const sessionKey = crypto.randomBytes(32);

// Generar contraseña
const pwd = generatePassword({
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
});
console.log("Contraseña generada:", pwd);

// Cifrar
const encrypted = encryptPassword(pwd, sessionKey);
console.log("Cifrada:", encrypted);

// Descifrar
const decrypted = decryptPassword(encrypted, sessionKey);
console.log("Descifrada:", decrypted);

// Verificar que coincide
console.log("Coincide:", decrypted === pwd);
