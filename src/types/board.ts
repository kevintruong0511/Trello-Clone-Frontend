export interface BoardMemberT {
  userId: string;
  role: "owner" | "member" | "viewer";
  user: { id: string; name: string; email: string; avatar: string | null };
}

export interface CardT {
  id: string;
  boardId: string;
  columnId: string;
  title: string;
  description: string | null;
  position: number;
  dueDate: string | null;
  dueComplete: boolean;
  cover: string | null;
  isArchived: boolean;
  labels: { labelId: string }[];
  assignees: { userId: string }[];
  _count: { comments: number; checklists: number };
}

export interface ColumnT {
  id: string;
  boardId: string;
  title: string;
  position: number;
  cards: CardT[];
}

export interface BoardSummary {
  id: string;
  title: string;
  description: string | null;
  background: string | null;
  visibility: string;
  ownerId: string;
  members: BoardMemberT[];
  updatedAt: string;
}

export interface BoardDetail extends BoardSummary {
  columns: ColumnT[];
  labels: { id: string; name: string; color: string }[];
}

export interface CommentT {
  id: string;
  text: string;
  createdAt: string;
  user: { id: string; name: string; avatar: string | null };
}

export interface CardDetail extends Omit<CardT, "assignees" | "_count"> {
  assignees: { user: { id: string; name: string; email: string; avatar: string | null } }[];
  comments: CommentT[];
  checklists: { id: string; title: string; items: { id: string; text: string; done: boolean }[] }[];
}
