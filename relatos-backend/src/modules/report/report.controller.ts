import { Request, Response } from 'express';
import {
  createReportService,
  dismissReportService,
  getOpenReportsService,
} from './report.service';

export async function createReportController(req: Request, res: Response) {
  try {
    const examId = Number(req.params.examId);
    const { reason, comment } = req.body;
    const report = await createReportService(examId, req.userId!, reason, comment);
    res.status(201).json(report);
  } catch (error: any) {
    console.error(error);
    if (error.message === 'INVALID_EXAM_ID') {
      return res.status(400).json({ message: 'ID de relato inválido' });
    }
    if (error.message === 'MOTIVO_INVALIDO') {
      return res.status(400).json({ message: 'Motivo de reporte inválido' });
    }
    if (error.message === 'COMENTARIO_MUY_LARGO') {
      return res
        .status(400)
        .json({ message: 'El comentario es demasiado largo (máx. 500 caracteres)' });
    }
    res.status(500).json({ message: 'Error al reportar el relato' });
  }
}

export async function getOpenReportsController(req: Request, res: Response) {
  try {
    const items = await getOpenReportsService();
    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los reportes' });
  }
}

export async function dismissReportController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await dismissReportService(id, req.userId!);
    res.json({ id });
  } catch (error: any) {
    console.error(error);
    if (error.message === 'INVALID_ID') {
      return res.status(400).json({ message: 'ID inválido' });
    }
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }
    res.status(500).json({ message: 'Error al descartar el reporte' });
  }
}
