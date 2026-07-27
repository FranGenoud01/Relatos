import { Request, Response } from 'express';
import {
  addFavoriteService,
  getFavoriteStatusService,
  getMyFavoritesService,
  removeFavoriteService,
} from './favorite.service';

export async function getFavoriteStatusController(req: Request, res: Response) {
  try {
    const examId = Number(req.params.examId);
    const status = await getFavoriteStatusService(examId, req.userId);
    res.json(status);
  } catch (error: any) {
    console.error(error);
    if (error.message === 'INVALID_EXAM_ID') {
      return res.status(400).json({ message: 'ID de relato inválido' });
    }
    res.status(500).json({ message: 'Error al obtener el estado de favorito' });
  }
}

export async function addFavoriteController(req: Request, res: Response) {
  try {
    const examId = Number(req.params.examId);
    const status = await addFavoriteService(examId, req.userId!);
    res.status(201).json(status);
  } catch (error: any) {
    console.error(error);
    if (error.message === 'INVALID_EXAM_ID') {
      return res.status(400).json({ message: 'ID de relato inválido' });
    }
    res.status(500).json({ message: 'Error al agregar a favoritos' });
  }
}

export async function removeFavoriteController(req: Request, res: Response) {
  try {
    const examId = Number(req.params.examId);
    const status = await removeFavoriteService(examId, req.userId!);
    res.json(status);
  } catch (error: any) {
    console.error(error);
    if (error.message === 'INVALID_EXAM_ID') {
      return res.status(400).json({ message: 'ID de relato inválido' });
    }
    res.status(500).json({ message: 'Error al quitar de favoritos' });
  }
}

export async function getMyFavoritesController(req: Request, res: Response) {
  try {
    const items = await getMyFavoritesService(req.userId!);
    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener tus favoritos' });
  }
}
