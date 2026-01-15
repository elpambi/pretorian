-- ===============================
-- Base de datos para Pretorian
-- Version 0.0
-- ===============================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    hash_password TEXT NOT NULL,
    salt TEXT NOT NULL
);

-- Tabla de credenciales (contraseñas)
CREATE TABLE IF NOT EXISTS Credential (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    service_name TEXT NOT NULL,
    service_user TEXT,
    encrypted_password BLOB NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
);

-- Tabla de tags
CREATE TABLE IF NOT EXISTS Tag (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

-- Relación muchos a muchos
CREATE TABLE IF NOT EXISTS CredentialTag (
    credential_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (credential_id, tag_id),
    FOREIGN KEY (credential_id) REFERENCES Credential(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tag(id) ON DELETE CASCADE
);
