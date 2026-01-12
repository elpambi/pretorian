import crypto from 'crypto';

// Derivar clave de la contraseña maestra
export function deriveKey(masterPassword, salt = null) {
    salt = salt || crypto.randomBytes(16); // Genera un salt aleatorio si no hay
    const key = crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, 'sha256'); // AES-256 = 32 bytes
    return { key, salt };
}

// Cifrar texto
export function encryptAES(plaintext, key) {
    const iv = crypto.randomBytes(12); // Vector de inicialización único
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return { encrypted, iv, tag };
}

// Descifrar texto
export function decryptAES(encrypted, key, iv, tag) {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
}
