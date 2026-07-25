import { Request, Response } from 'express';
import { getPendingExamsService, moderateExamService } from '../exam_report/exam.service';

export async function getPendingExamsController(req: Request, res: Response) {
  try {
    const items = await getPendingExamsService();
    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener relatos pendientes' });
  }
}

export async function approveExamController(req: Request, res: Response) {
  try {
    const examId = Number(req.params.id);
    await moderateExamService(examId, 'approved');
    res.json({ id: examId, status: 'approved' });
  } catch (error: any) {
    console.error(error);
    if (error.message === 'INVALID_ID') {
      return res.status(400).json({ message: 'ID inválido' });
    }
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Relato pendiente no encontrado' });
    }
    res.status(500).json({ message: 'Error al aprobar el relato' });
  }
}

export async function rejectExamController(req: Request, res: Response) {
  try {
    const examId = Number(req.params.id);
    await moderateExamService(examId, 'rejected');
    res.json({ id: examId, status: 'rejected' });
  } catch (error: any) {
    console.error(error);
    if (error.message === 'INVALID_ID') {
      return res.status(400).json({ message: 'ID inválido' });
    }
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Relato pendiente no encontrado' });
    }
    res.status(500).json({ message: 'Error al rechazar el relato' });
  }
}
