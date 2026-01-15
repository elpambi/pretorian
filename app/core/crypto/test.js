import { deriveKey, encryptAES, decryptAES } from "./aes.js";

const masterPassword = "MiSuperClave123!";
const { key, salt } = deriveKey(masterPassword);

const password = "ContraseñaSecreta!@#";
console.log("Original:", password);

// Cifrar
const { encrypted, iv, tag } = encryptAES(password, key);
console.log("Cifrado:", encrypted.toString("hex"));

// Descifrar
const decrypted = decryptAES(encrypted, key, iv, tag);
console.log("Descifrado:", decrypted);
