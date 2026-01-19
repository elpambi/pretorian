// app/core/auth/passwordGenerator.js
const crypto = require("crypto");

function generatePassword(options = {}) {
  const length = options.length || 16;
  if (typeof length !== "number" || length < 8)
    throw new Error("Longitud inválida");

  const charset = [];
  if (options.uppercase) charset.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (options.lowercase) charset.push("abcdefghijklmnopqrstuvwxyz");
  if (options.numbers) charset.push("0123456789");
  if (options.symbols) charset.push("!@#$%^&*()_+-=[]{}|;:',.<>/?");

  if (!charset.length)
    throw new Error("Debes seleccionar al menos un tipo de carácter");

  let allChars = charset.join("");
  let password = "";
  for (let i = 0; i < length; i++) {
    password += allChars[crypto.randomInt(0, allChars.length)];
  }
  return password;
}

module.exports = { generatePassword };
