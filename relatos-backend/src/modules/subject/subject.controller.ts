import { Request, Response } from 'express';
import {
  createSubjectService,
  deleteSubjectService,
  getSubjectsService,
} from './subject.service';

export async function getSubjectsController(req: Request, res: Response) {
  try {
    const subjects = await getSubjectsService();
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener materias' });
  }
}

export async function createSubjectController(req: Request, res: Response) {
  try {
    const { name } = req.body;

    const subject = await createSubjectService(name);
    res.status(201).json(subject);
  } catch (error: any) {
    console.error(error);

    if (error.message === 'NOMBRE_OBLIGATORIO') {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    // Podrías hacer manejo especial de errores de DB acá si querés
    return res.status(500).json({ message: 'Error al crear materia' });
  }
}

export async function deleteSubjectController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    await deleteSubjectService(id);

    return res.status(200).json({ message: `Materia número ${id} eliminada` });
  } catch (error: any) {
    console.error(error);

    if (error.message === 'INVALID_ID') {
      return res.status(400).json({ message: 'ID inválido' });
    }
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Subject no encontrado' });
    }

    return res.status(500).json({ message: 'Error al eliminar subject' });
  }
}
