export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  status: "active" | "banned";
  roles: string[];
  permissions: string[];
}
