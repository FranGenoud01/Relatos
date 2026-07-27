export type ExamStatus = 'approved' | 'pending' | 'rejected';

export interface MyExam {
  id: number;
  title: string;
  text: string;
  date_exam: string | null;
  status: ExamStatus;
  created_at: string;
  subject_name: string;
  teachers: string | null;
}
