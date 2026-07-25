export interface SubjectStat {
  id: number;
  name: string;
  exam_count: number;
}

export interface TeacherStat {
  id: number;
  name: string;
  exam_count: number;
}

export interface StatsTotals {
  exams: number;
  subjects: number;
  teachers: number;
  users: number;
  ratings: number;
  comments: number;
}

export interface StatsResponse {
  bySubject: SubjectStat[];
  byTeacher: TeacherStat[];
  totals: StatsTotals;
}
