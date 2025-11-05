interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface TransformedUser {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UsersApiResponse {
  users: TransformedUser[];
}