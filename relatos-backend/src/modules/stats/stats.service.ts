import { getSubjectStatsRepo, getTeacherStatsRepo, getTotalsRepo } from './stats.repository';
import { StatsResponse } from './stats.types';

export async function getStatsService(): Promise<StatsResponse> {
  const [bySubject, byTeacher, totals] = await Promise.all([
    getSubjectStatsRepo(),
    getTeacherStatsRepo(),
    getTotalsRepo(),
  ]);

  return { bySubject, byTeacher, totals };
}
