export interface CreateExamPayload {
  subject_id: number;
  title?: string;
  text: string;
  date_exam?: string | null; // YYYY-MM-DD
  teachersIds?: number[]; // [1,2]
}
