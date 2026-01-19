// encrypt.js
const crypto = require("crypto");

// Cifra una contraseña
function encryptPassword(plainText, sessionKey) {
  if (!sessionKey) throw new Error("Sesión no desbloqueada");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", sessionKey, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), data: encrypted };
}

// Descifra una contraseña
function decryptPassword(encryptedObj, sessionKey) {
  const { iv, data } = encryptedObj;
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    sessionKey,
    Buffer.from(iv, "hex"),
  );
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encryptPassword, decryptPassword };
