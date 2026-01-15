-- ===============================
-- Datos de prueba para desarrollo
-- ===============================

-- Usuarios de prueba
INSERT INTO User (name, hash_password, salt)
VALUES
('Alice', 'hash_falso_123', 'salt_false'),
('Bob', 'hash_falso_456', 'salt_false');

-- Credenciales (contraseñas) de prueba
INSERT INTO Credential (
    user_id,
    service_name,
    service_user,
    encrypted_password,
    notes
)
VALUES
(1, 'Gmail', 'alice@gmail.com', 'AES256_FALSO_1', 'Cuenta personal'),
(1, 'Facebook', 'alice.fb', 'AES256_FALSO_2', 'Cuenta secundaria'),
(2, 'Twitter', 'bob_twitter', 'AES256_FALSO_3', 'Cuenta oficial');

-- Tags de prueba
INSERT INTO Tag (name)
VALUES
('Trabajo'),
('Personal'),
('Redes');

-- Relación Credential-Tag (muchos a muchos)
INSERT INTO CredentialTag (credential_id, tag_id)
VALUES
(1, 2),  -- Gmail -> Personal
(2, 2),  -- Facebook -> Personal
(3, 1);  -- Twitter -> Trabajo
