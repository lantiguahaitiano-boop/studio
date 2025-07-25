export type ToolUsage = {
  [key: string]: number;
};

export interface User {
  name: string;
  email: string;
  password?: string; // Password should not be stored in the main user object in a real app
  educationLevel: string;
  xp?: number;
  level?: number;
  toolUsage?: ToolUsage;
  achievements?: string[];
  favoriteResources?: string[];
  role?: 'admin' | 'user';
}

export interface RegisterCredentials extends Omit<User, 'password'> {
  password?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export type SuggestionStatus = 'Pendiente' | 'En Revisión' | 'Aceptada' | 'Rechazada';

export type Suggestion = {
  id: string;
  text: string;
  userEmail: string;
  userName: string;
  timestamp: string;
  status: SuggestionStatus;
};

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (credentials: RegisterCredentials) => boolean;
  login: (credentials: LoginCredentials) => boolean;
  logout: () => void;
  addXP: (amount: number, toolId?: string) => void;
  updateUser?: (newDetails: Partial<User>) => void;
  toggleFavoriteResource?: (resourceId: string) => void;
  forceRoleSync?: () => void;
  getAllUsers?: () => User[];
  submitSuggestion?: (text: string) => void;
  getAllSuggestions?: () => Suggestion[];
  updateSuggestionStatus?: (suggestionId: string, status: SuggestionStatus) => void;
}
