-- Fase 8: reportes de usuarios sobre relatos (duplicado, materia/profesor incorrecto,
-- contenido inapropiado, u otro motivo). Van a una cola de revision para el admin,
-- separada de la de relatos parecidos detectados automaticamente.

CREATE TABLE IF NOT EXISTS exam_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  exam_id INT NOT NULL,
  reporter_id INT NOT NULL,
  reason ENUM('duplicado', 'materia_o_profesor_incorrecto', 'contenido_inapropiado', 'otro') NOT NULL,
  comment TEXT NULL,
  status ENUM('open', 'resolved') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  resolved_by INT NULL,
  CONSTRAINT fk_exam_reports_exam FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  CONSTRAINT fk_exam_reports_reporter FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_exam_reports_resolved_by FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
);
