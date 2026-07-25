import { Request, Response } from 'express';
import { getUserByIdService, loginService, registerService } from './auth.service';

export async function registerController(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    const result = await registerService({ name, email, password });
    res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    if (error.message === 'DATOS_OBLIGATORIOS') {
      return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
    }
    if (error.message === 'EMAIL_INVALIDO') {
      return res.status(400).json({ message: 'El email no es válido' });
    }
    if (error.message === 'PASSWORD_DEBIL') {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });
    }
    if (error.message === 'EMAIL_EN_USO') {
      return res.status(409).json({ message: 'Ya existe una cuenta con ese email' });
    }
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await loginService({ email, password });
    res.json(result);
  } catch (error: any) {
    console.error(error);
    if (error.message === 'DATOS_OBLIGATORIOS') {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }
    if (error.message === 'CREDENCIALES_INVALIDAS') {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
}

export async function meController(req: Request, res: Response) {
  try {
    const user = await getUserByIdService(req.userId!);
    res.json(user);
  } catch (error: any) {
    console.error(error);
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
}
