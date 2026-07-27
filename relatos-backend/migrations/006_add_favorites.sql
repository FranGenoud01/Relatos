-- Fase 8: favoritos, para que un usuario guarde relatos y los encuentre rapido despues.

CREATE TABLE IF NOT EXISTS exam_favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  exam_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_exam_favorites_exam_user (exam_id, user_id),
  CONSTRAINT fk_exam_favorites_exam FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  CONSTRAINT fk_exam_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
