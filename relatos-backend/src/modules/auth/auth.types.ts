export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}
