import {
  createSubject,
  deleteSubjectById,
  findAllSubjects,
  Subject,
} from './subject.repository';

export async function getSubjectsService(): Promise<Subject[]> {
  return findAllSubjects();
}

export async function createSubjectService(name: string): Promise<Subject> {
  if (!name || !name.trim()) {
    throw new Error('NOMBRE_OBLIGATORIO');
  }

  // Podés hacer validaciones extras acá
  return createSubject(name.trim());
}

export async function deleteSubjectService(id: number): Promise<void> {
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error('INVALID_ID');
  }

  const deleted = await deleteSubjectById(id);

  if (!deleted) {
    throw new Error('NOT_FOUND');
  }
}
