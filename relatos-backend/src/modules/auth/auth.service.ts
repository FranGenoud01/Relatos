import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserById, UserRecord } from './auth.repository';
import { AuthResult, AuthUser, LoginDTO, RegisterDTO } from './auth.types';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me';
const JWT_EXPIRES_IN = '30d';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toAuthUser(user: UserRecord): AuthUser {
  return { id: user.id, name: user.name, email: user.email, isAdmin: Boolean(user.is_admin) };
}

function signToken(user: UserRecord): string {
  return jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export async function registerService(dto: RegisterDTO): Promise<AuthResult> {
  const name = (dto.name || '').trim();
  const email = (dto.email || '').trim().toLowerCase();
  const password = dto.password || '';

  if (!name || !email || !password) {
    throw new Error('DATOS_OBLIGATORIOS');
  }
  if (!EMAIL_REGEX.test(email)) {
    throw new Error('EMAIL_INVALIDO');
  }
  if (password.length < 8) {
    throw new Error('PASSWORD_DEBIL');
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error('EMAIL_EN_USO');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(name, email, passwordHash);

  return { token: signToken(user), user: toAuthUser(user) };
}

export async function loginService(dto: LoginDTO): Promise<AuthResult> {
  const email = (dto.email || '').trim().toLowerCase();
  const password = dto.password || '';

  if (!email || !password) {
    throw new Error('DATOS_OBLIGATORIOS');
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('CREDENCIALES_INVALIDAS');
  }

  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) {
    throw new Error('CREDENCIALES_INVALIDAS');
  }

  return { token: signToken(user), user: toAuthUser(user) };
}

export async function getUserByIdService(id: number): Promise<AuthUser> {
  const user = await findUserById(id);
  if (!user) {
    throw new Error('NOT_FOUND');
  }
  return toAuthUser(user);
}

export function verifyAuthToken(token: string): { id: number } {
  const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  return { id: Number(payload.sub) };
}
