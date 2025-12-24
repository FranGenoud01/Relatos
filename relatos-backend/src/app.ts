import express from 'express';
import cors from 'cors';
import { subjectRouter } from './modules/subject/subject.routes';
import { teacherRouter } from './modules/teacher/teacher.routes';
import { examRouter } from './modules/exam_report/exam.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/subjects', subjectRouter);
app.use('/teachers', teacherRouter);
app.use('/exams', examRouter);

export default app;
