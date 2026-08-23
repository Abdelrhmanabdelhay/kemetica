export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'customer' | 'guide' | 'admin';
}

export interface AuthSession {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
