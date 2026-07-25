export type ExamStatus = 'approved' | 'pending' | 'rejected';

export interface CreateExamDTO {
  subjectId: number;
  title?: string;
  text: string;
  dateExamen: string; // YYYY-MM-DD
  teachersIds?: number[];
  createdBy?: number | null;
}

export interface CreateExamRepoDTO extends CreateExamDTO {
  status: ExamStatus;
  duplicateOf?: number | null;
  similarityScore?: number | null;
}
