import { Request, Response } from 'express';
import { getRatingSummaryService, rateExamService } from './rating.service';

export async function getRatingSummaryController(req: Request, res: Response) {
  try {
    const examId = Number(req.params.examId);
    const summary = await getRatingSummaryService(examId, req.userId);
    res.json(summary);
  } catch (error: any) {
    console.error(error);
    if (error.message === 'INVALID_EXAM_ID') {
      return res.status(400).json({ message: 'ID de relato inválido' });
    }
    res.status(500).json({ message: 'Error al obtener la valoración' });
  }
}

export async function rateExamController(req: Request, res: Response) {
  try {
    const examId = Number(req.params.examId);
    const { stars } = req.body;
    const summary = await rateExamService(examId, req.userId!, Number(stars));
    res.json(summary);
  } catch (error: any) {
    console.error(error);
    if (error.message === 'INVALID_EXAM_ID') {
      return res.status(400).json({ message: 'ID de relato inválido' });
    }
    if (error.message === 'STARS_INVALIDO') {
      return res.status(400).json({ message: 'La valoración debe ser un entero entre 1 y 5' });
    }
    res.status(500).json({ message: 'Error al guardar la valoración' });
  }
}
