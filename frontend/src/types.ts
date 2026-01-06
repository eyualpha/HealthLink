export type UserRole = 'doctor' | 'nurse' | 'patient' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
