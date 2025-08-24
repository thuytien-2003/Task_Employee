export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER'
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export interface Employee {
  id: number;
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeCreateRequest {
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  password: string;
  active?: boolean;
}

export interface EmployeeUpdateRequest {
  fullName?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: Gender;
  phoneNumber?: string;
  active?: boolean;
}
