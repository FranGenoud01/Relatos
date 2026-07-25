export interface DeletedExam {
  id: number;
  title: string;
  text: string;
  date_exam: string | null;
  deleted_at: string;
  subject_name: string;
  deleted_by_name: string | null;
}
