import { Request, Response } from 'express';
import { getCommentsService, createCommentService } from './comment.service';

export async function getCommentsController(req: Request, res: Response) {
  try {
    const examId = Number(req.params.examId);
    const items = await getCommentsService(examId);
    res.json({ items });
  } catch (error: any) {
    console.error(error);
    if (error.message === 'INVALID_EXAM_ID') {
      return res.status(400).json({ message: 'ID de relato inválido' });
    }
    res.status(500).json({ message: 'Error al obtener comentarios' });
  }
}

export async function createCommentController(req: Request, res: Response) {
  try {
    const examId = Number(req.params.examId);
    const { text } = req.body;
    const comment = await createCommentService(examId, req.userId!, text);
    res.status(201).json(comment);
  } catch (error: any) {
    console.error(error);
    if (error.message === 'INVALID_EXAM_ID') {
      return res.status(400).json({ message: 'ID de relato inválido' });
    }
    if (error.message === 'TEXTO_OBLIGATORIO') {
      return res.status(400).json({ message: 'El comentario no puede estar vacío' });
    }
    if (error.message === 'TEXTO_MUY_LARGO') {
      return res
        .status(400)
        .json({ message: 'El comentario es demasiado largo (máx. 1000 caracteres)' });
    }
    res.status(500).json({ message: 'Error al crear el comentario' });
  }
}
