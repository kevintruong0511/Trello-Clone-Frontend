import { api } from "./api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  status: "active" | "banned";
  createdAt: string;
  roles: string[];
}

export interface AdminBoard {
  id: string;
  title: string;
  createdAt: string;
  owner: { id: string; name: string; email: string };
  _count: { members: number; cards: number };
}

export interface AuditRow {
  id: string;
  actorId: string | null;
  targetId: string | null;
  action: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
}

export const listUsers = (search?: string) =>
  api
    .get<{ users: AdminUser[]; total: number }>("/admin/users", { params: { search } })
    .then((r) => r.data);

export const setUserRole = (id: string, role: "admin" | "user") =>
  api.put(`/admin/users/${id}/role`, { role });

export const setUserBan = (id: string, banned: boolean) =>
  api.put(`/admin/users/${id}/ban`, { banned });

export const deleteUser = (id: string) => api.delete(`/admin/users/${id}`);

export const listAllBoards = () =>
  api.get<{ boards: AdminBoard[]; total: number }>("/admin/boards").then((r) => r.data);

export const deleteAnyBoard = (id: string) => api.delete(`/admin/boards/${id}`);

export const getStats = () =>
  api
    .get<{ users: number; activeUsers: number; boards: number; cards: number }>(
      "/admin/stats",
    )
    .then((r) => r.data);

export const getActivity = () => api.get<AuditRow[]>("/admin/activity").then((r) => r.data);
