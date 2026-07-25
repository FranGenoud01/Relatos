import {
  createTeacher,
  findAllTeacheres,
  findDeletedTeachersRepo,
  restoreTeacherById,
  softDeleteTeacherById,
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

export async function getDeletedTeachersService() {
  return findDeletedTeachersRepo();
}

export async function softDeleteTeacherService(id: number, deletedBy: number): Promise<void> {
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error('INVALID_ID');
  }

  const deleted = await softDeleteTeacherById(id, deletedBy);

  if (!deleted) {
    throw new Error('NOT_FOUND');
  }
}

export async function restoreTeacherService(id: number): Promise<void> {
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error('INVALID_ID');
  }

  const restored = await restoreTeacherById(id);

  if (!restored) {
    throw new Error('NOT_FOUND');
  }
}
