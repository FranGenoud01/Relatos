-- Fase 7: soft-delete de relatos y profesores para poder revertir borrados desde el admin.

ALTER TABLE exams ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;
ALTER TABLE exams ADD COLUMN deleted_by INT NULL;

ALTER TABLE exams
  ADD CONSTRAINT fk_exams_deleted_by
    FOREIGN KEY (deleted_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE teachers ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;
ALTER TABLE teachers ADD COLUMN deleted_by INT NULL;

ALTER TABLE teachers
  ADD CONSTRAINT fk_teachers_deleted_by
    FOREIGN KEY (deleted_by) REFERENCES users(id) ON DELETE SET NULL;
