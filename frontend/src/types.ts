export type UserRole = 'doctor' | 'nurse' | 'patient' | 'admin' | 'reception' | 'clinician';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  // optional profile fields
  address?: string;
  phone?: string;
  notes?: string;
}
