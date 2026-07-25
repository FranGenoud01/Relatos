import express from 'express';
import cors from 'cors';
import { subjectRouter } from './modules/subject/subject.routes';
import { teacherRouter } from './modules/teacher/teacher.routes';
import { examRouter } from './modules/exam_report/exam.routes';
import { authRouter } from './modules/auth/auth.routes';
import { ratingRouter } from './modules/rating/rating.routes';
import { commentRouter } from './modules/comment/comment.routes';
import { statsRouter } from './modules/stats/stats.routes';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:4200', /\.vercel\.app$/],
  })
);
app.use(express.json());

// Rutas
app.use('/auth', authRouter);
app.use('/subjects', subjectRouter);
app.use('/teachers', teacherRouter);
app.use('/exams', examRouter);
app.use('/exams/:examId/ratings', ratingRouter);
app.use('/exams/:examId/comments', commentRouter);
app.use('/stats', statsRouter);

export default app;
