-- Fase 2: cuentas de usuario
-- Tabla de usuarios + atribución opcional de relatos a un usuario.

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email)
);

ALTER TABLE exams ADD COLUMN created_by INT NULL;

ALTER TABLE exams
  ADD CONSTRAINT fk_exams_created_by
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
