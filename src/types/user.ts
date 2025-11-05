export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface OnlineUser extends User {
  isOnline: boolean;
}