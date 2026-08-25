export interface SignUpFormData {
  fullName: string;
  universityId: string;
  email: string;
  password: string;
}

export interface SignUpFormErrors {
  fullName?: string;
  universityId?: string;
  email?: string;
  password?: string;
  general?: string;
}
