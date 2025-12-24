import {
  createTeacher,
  deleteTeacherById,
  findAllTeacheres,
  Teacher,
} from './teacher.repository';

export async function getTeachersService(): Promise<Teacher[]> {
  return findAllTeacheres();
}

export async function createTeacherService(name: string): Promise<Teacher> {
  if (!name || !name.trim()) {
    throw new Error('NOMBRE_OBLIGATORIO');
  }
  return createTeacher(name.trim());
}

export async function deleteTeacherService(id: number): Promise<void> {
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error('INVALID_ID');
  }

  const deleted = await deleteTeacherById(id);

  if (!deleted) {
    throw new Error('NOT_FOUND');
  }
}
