export interface FavoriteStatus {
  isFavorite: boolean;
}

export interface FavoriteExamItem {
  id: number;
  title: string;
  text: string;
  date_exam: string | null;
  subject_id: number;
  subject_name: string;
  teachers: string | null;
  favorited_at: string;
}
