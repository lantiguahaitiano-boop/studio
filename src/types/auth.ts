export interface User {
  name: string;
  email: string;
  password?: string; // Password should not be stored in the main user object in a real app
  educationLevel: string;
  xp?: number;
  level?: number;
}

export interface RegisterCredentials extends Omit<User, 'password'> {
  password?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (credentials: RegisterCredentials) => boolean;
  login: (credentials: LoginCredentials) => boolean;
  logout: () => void;
  addXP: (amount: number) => void;
}
