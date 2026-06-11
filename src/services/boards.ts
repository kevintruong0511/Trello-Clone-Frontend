import { api } from "./api";
import type {
  BoardDetail,
  BoardSummary,
  CardDetail,
  CardT,
  ColumnT,
  CommentT,
  BoardMemberT,
} from "../types/board";

export const listBoards = () => api.get<BoardSummary[]>("/boards").then((r) => r.data);

export const createBoard = (data: { title: string; description?: string; background?: string }) =>
  api.post<BoardSummary>("/boards", data).then((r) => r.data);

export const getBoard = (id: string) =>
  api.get<BoardDetail>(`/boards/${id}`).then((r) => r.data);

export const updateBoard = (id: string, data: Partial<{ title: string; isClosed: boolean }>) =>
  api.put(`/boards/${id}`, data).then((r) => r.data);

export const deleteBoard = (id: string) => api.delete(`/boards/${id}`);

export const inviteMember = (boardId: string, email: string, role: "member" | "viewer") =>
  api.post<BoardMemberT>(`/boards/${boardId}/invite`, { email, role }).then((r) => r.data);

export const updateMemberRole = (boardId: string, userId: string, role: string) =>
  api.put<BoardMemberT>(`/boards/${boardId}/members/${userId}`, { role }).then((r) => r.data);

export const removeMember = (boardId: string, userId: string) =>
  api.delete(`/boards/${boardId}/members/${userId}`);

export const createColumn = (boardId: string, title: string) =>
  api.post<ColumnT>(`/boards/${boardId}/columns`, { title }).then((r) => r.data);

export const updateColumn = (id: string, data: { title?: string; position?: number }) =>
  api.put<ColumnT>(`/columns/${id}`, data).then((r) => r.data);

export const deleteColumn = (id: string) => api.delete(`/columns/${id}`);

export const createCard = (columnId: string, title: string) =>
  api.post<CardT>(`/columns/${columnId}/cards`, { title }).then((r) => r.data);

export const getCard = (id: string) => api.get<CardDetail>(`/cards/${id}`).then((r) => r.data);

export const updateCard = (
  id: string,
  data: Partial<{
    title: string;
    description: string | null;
    columnId: string;
    position: number;
    dueDate: string | null;
    dueComplete: boolean;
    isArchived: boolean;
  }>,
) => api.put<CardT>(`/cards/${id}`, data).then((r) => r.data);

export const deleteCard = (id: string) => api.delete(`/cards/${id}`);

export const addComment = (cardId: string, text: string) =>
  api.post<CommentT>(`/cards/${cardId}/comments`, { text }).then((r) => r.data);
