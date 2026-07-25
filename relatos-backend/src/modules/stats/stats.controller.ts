import { Request, Response } from 'express';
import { getStatsService } from './stats.service';

export async function getStatsController(req: Request, res: Response) {
  try {
    const stats = await getStatsService();
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
}
