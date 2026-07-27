import { Request, Response } from 'express';
import {
  createExamService,
  getRandomExamService,
  findAllExamsService,
  getMyExamsService,
} from './exam.service';

export async function createExamController(req: Request, res: Response) {
  try {
    const { subject_id, text, date_exam, teachersIds } = req.body;
    const exam = await createExamService({
      subjectId: subject_id,
      text: text,
      dateExamen: date_exam,
      teachersIds: teachersIds,
      createdBy: req.userId ?? null,
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

export async function getMyExamsController(req: Request, res: Response) {
  try {
    const items = await getMyExamsService(req.userId!);
    res.json({ items });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener tus relatos' });
  }
}

export async function findAllExamsController(req: Request, res: Response) {
  try {
    const subject_id = req.query.subject_id ? Number(req.query.subject_id) : undefined;
    const teacher_id = req.query.teacher_id ? Number(req.query.teacher_id) : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const result = await findAllExamsService({
      subjectId: subject_id,
      teacherId: teacher_id,
      search,
      page,
      limit,
    });
    res.json(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los examenes' });
  }
}
