import { Request, Response } from 'express';
import {
  createExamService,
  getRandomExamService,
  deleteExamService,
  findAllExamsService,
} from './exam.service';

export async function createExamController(req: Request, res: Response) {
  try {
    const { subject_id, text, date_exam, teachersIds } = req.body;
    const exam = await createExamService({
      subjectId: subject_id,
      text: text,
      dateExamen: date_exam,
      teachersIds: teachersIds,
    });
    res.status(201).json(exam);
  } catch (error: any) {
    console.error(error);
    if (error.message === 'DATOS_OBLIGATORIOS') {
      return res
        .status(400)
        .json({ message: 'materiaId y texto son obligatorios' });
    }
    res.status(500).json({ message: 'Error al crear relato' });
  }
}

// GET /relatos/random?materiaId=1
export async function getRandomExamController(req: Request, res: Response) {
  try {
    const subject_id = Number(req.query.subject_id);
    const teacher_id = req.query.teacher_id
      ? Number(req.query.teacher_id)
      : undefined;

    const excludeParam = (req.query.exclude as string) || '';
    const excludeIds = excludeParam
      .split(',')
      .map((x) => Number(x))
      .filter((n) => !isNaN(n));

    const exam = await getRandomExamService(subject_id, teacher_id, excludeIds);
    res.json(exam);
  } catch (error: any) {
    console.error('🔥 getRandomExamController error:', error?.stack || error);

    if (error.message === 'MATERIA_OBLIGATORIA') {
      return res.status(400).json({ message: 'materiaId es obligatorio' });
    }
    if (error.message === 'SIN_RELATOS') {
      return res
        .status(404)
        .json({ message: 'No hay más relatos para ese filtro' });
    }
    return res
      .status(500)
      .json({ message: 'Error al obtener relato aleatorio' });
  }
}

export async function deleteExamController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await deleteExamService(id);
    return res.status(200).json({ message: `Examen número ${id} eliminado` });
  } catch (error: any) {
    console.error(error);

    if (error.message === 'INVALID_ID') {
      return res.status(400).json({ message: 'ID inválido' });
    }
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Examen no encontrado' });
    }

    return res.status(500).json({ message: 'Error al eliminar examen' });
  }
}

export async function findAllExamsController(req: Request, res: Response) {
  try {
    const exams = await findAllExamsService();
    res.json(exams);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los examenes' });
  }
}
