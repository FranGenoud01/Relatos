export interface CreateExamDTO {
  subjectId: number;
  title?: string;
  text: string;
  dateExamen: string; // YYYY-MM-DD
  teachersIds?: number[];
}
