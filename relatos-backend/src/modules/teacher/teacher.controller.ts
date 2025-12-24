import { Request, Response } from 'express';
import {
  createTeacherService,
  deleteTeacherService,
  getTeachersService,
} from './teacher.service';

export async function getTeachersController(req: Request, res: Response) {
  try {
    const teachers = await getTeachersService();
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener profesores' });
  }
}

export async function createTeacherController(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const teacher = await createTeacherService(name);
    res.status(201).json(teacher);
  } catch (error: any) {
    console.error(error);
    if (error.message === 'NOMBRE_OBLIGATORIO') {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }
    res.status(500).json({ message: 'Error al crear profesor' });
  }
}

export async function deleteTeacherController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await deleteTeacherService(id);
    return res.status(200).json({ message: `Profesor número ${id} eliminado` });
  } catch (error: any) {
    console.error(error);
    if (error.message === 'INVALID_ID') {
      return res.status(400).json({ message: 'ID inválido' });
    }
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }
    return res.status(500).json({ message: 'Error al eliminar profesor' });
  }
}
