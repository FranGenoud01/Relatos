export interface PendingExam {
  id: number;
  title: string;
  text: string;
  date_exam: string | null;
  similarity_score: number | null;
  created_at: string;
  subject_name: string;
  author_name: string | null;
  duplicate_id: number | null;
  duplicate_title: string | null;
  duplicate_text: string | null;
}
