export type ToolUsage = {
  [key: string]: number;
};

export interface User {
  uid: string; // Firebase UID
  name: string;
  email: string;
  password?: string; // Should not be stored in the user object from Firestore
  educationLevel: string;
  xp?: number;
  level?: number;
  toolUsage?: ToolUsage;
  achievements?: string[];
  favoriteResources?: string[];
  role?: 'admin' | 'user';
}

export interface RegisterCredentials extends Omit<User, 'uid' | 'password'> {
  password?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type SuggestionStatus = 'Pendiente' | 'En Revisión' | 'Aceptada' | 'Rechazada';

export type Suggestion = {
  id: string;
  text: string;
  userEmail: string;
  userName: string;
  timestamp: string; // ISO string format
  status: SuggestionStatus;
};

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  register?: (credentials: RegisterCredentials) => Promise<boolean>;
  login?: (credentials: LoginCredentials) => Promise<boolean>;
  signInWithGoogle?: () => Promise<boolean>;
  logout?: () => void;
  addXP?: (amount: number, toolId?: string) => void;
  updateUser?: (newDetails: Partial<User>) => void;
  toggleFavoriteResource?: (resourceId: string) => void;
  forceRoleSync?: () => void;
  getAllUsers?: () => Promise<User[]>;
  submitSuggestion?: (text: string) => void;
  getAllSuggestions?: () => Promise<Suggestion[]>;
  updateSuggestionStatus?: (suggestionId: string, status: SuggestionStatus) => void;
}
