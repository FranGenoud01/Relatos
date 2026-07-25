-- Fase 6: moderacion de relatos parecidos/duplicados.

ALTER TABLE exams ADD COLUMN status ENUM('approved', 'pending', 'rejected') NOT NULL DEFAULT 'approved';
ALTER TABLE exams ADD COLUMN duplicate_of INT NULL;
ALTER TABLE exams ADD COLUMN similarity_score DECIMAL(4, 3) NULL;

ALTER TABLE exams
  ADD CONSTRAINT fk_exams_duplicate_of
    FOREIGN KEY (duplicate_of) REFERENCES exams(id) ON DELETE SET NULL;

ALTER TABLE users ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE;
