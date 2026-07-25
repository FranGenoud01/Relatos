import { Request, Response } from 'express';
import {
  getDeletedExamsService,
  getPendingExamsService,
  moderateExamService,
  restoreExamService,
  softDeleteExamService,
} from '../exam_report/exam.service';
import {
  getDeletedTeachersService,
  restoreTeacherService,
  softDeleteTeacherService,
} from '../teacher/teacher.service';

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

export async function getDeletedExamsController(req: Request, res: Response) {
  try {
    const items = await getDeletedExamsService();
    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener relatos eliminados' });
  }
}

export async function deleteExamController(req: Request, res: Response) {
  try {
    const examId = Number(req.params.id);
    await softDeleteExamService(examId, req.userId!);
    res.json({ id: examId });
  } catch (error: any) {
    console.error(error);
    if (error.message === 'INVALID_ID') {
      return res.status(400).json({ message: 'ID inválido' });
    }
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Relato no encontrado' });
    }
    res.status(500).json({ message: 'Error al eliminar el relato' });
  }
}

export async function restoreExamController(req: Request, res: Response) {
  try {
    const examId = Number(req.params.id);
    await restoreExamService(examId);
    res.json({ id: examId });
  } catch (error: any) {
    console.error(error);
    if (error.message === 'INVALID_ID') {
      return res.status(400).json({ message: 'ID inválido' });
    }
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Relato eliminado no encontrado' });
    }
    res.status(500).json({ message: 'Error al restaurar el relato' });
  }
}

export async function getDeletedTeachersController(req: Request, res: Response) {
  try {
    const items = await getDeletedTeachersService();
    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener profesores eliminados' });
  }
}

export async function deleteTeacherController(req: Request, res: Response) {
  try {
    const teacherId = Number(req.params.id);
    await softDeleteTeacherService(teacherId, req.userId!);
    res.json({ id: teacherId });
  } catch (error: any) {
    console.error(error);
    if (error.message === 'INVALID_ID') {
      return res.status(400).json({ message: 'ID inválido' });
    }
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }
    res.status(500).json({ message: 'Error al eliminar el profesor' });
  }
}

export async function restoreTeacherController(req: Request, res: Response) {
  try {
    const teacherId = Number(req.params.id);
    await restoreTeacherService(teacherId);
    res.json({ id: teacherId });
  } catch (error: any) {
    console.error(error);
    if (error.message === 'INVALID_ID') {
      return res.status(400).json({ message: 'ID inválido' });
    }
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Profesor eliminado no encontrado' });
    }
    res.status(500).json({ message: 'Error al restaurar el profesor' });
  }
}
