export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface UserPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: "USER" | "ADMIN";
}
