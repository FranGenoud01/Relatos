import { Request, Response } from 'express';
import {
  createTeacherService,
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

