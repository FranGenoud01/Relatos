export interface ExamListItem {
  id: number;
  title: string;
  text: string;
  date_exam: string | null;
  subject_id: number;
  subject_name: string;
  teachers: string | null;
}

export interface ExamListResponse {
  items: ExamListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ExamListQuery {
  subjectId?: number | null;
  teacherId?: number | null;
  search?: string | null;
  page: number;
  limit: number;
}
