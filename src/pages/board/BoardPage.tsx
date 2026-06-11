import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import type { BoardDetail, CardT, ColumnT } from "../../types/board";
import * as boardsApi from "../../services/boards";
import { positionAt } from "../../utils/positions";
import { bgStyle, trello } from "../../theme/theme";
import { useAppSelector } from "../../redux/hooks";
import { useBoardSocket } from "../../hooks/useBoardSocket";
import { ColumnView } from "./ColumnView";
import { CardItem } from "./CardItem";
import { CardModal } from "./CardModal";
import { MembersDialog } from "./MembersDialog";

export const BoardPage = () => {
  const { id: boardId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const me = useAppSelector((s) => s.auth.user);

  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [columns, setColumns] = useState<ColumnT[]>([]);
  const [activeCard, setActiveCard] = useState<CardT | null>(null);
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [membersOpen, setMembersOpen] = useState(false);
  const [addingColumn, setAddingColumn] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");

  const myRole = useMemo(() => {
    const member = board?.members.find((m) => m.userId === me?.id);
    if (member) return member.role;
    return me?.roles.includes("admin") ? "owner" : null;
  }, [board, me]);
  const canEdit = myRole === "owner" || myRole === "member";

  const reload = useCallback(async () => {
    if (!boardId) return;
    const data = await boardsApi.getBoard(boardId);
    setBoard(data);
    setColumns(data.columns);
  }, [boardId]);

  useEffect(() => {
    reload().catch(() => navigate("/"));
  }, [reload, navigate]);

  useBoardSocket(boardId, {
    "column:created": () => void reload(),
    "column:updated": () => void reload(),
    "column:deleted": () => void reload(),
    "card:created": () => void reload(),
    "card:updated": () => void reload(),
    "card:deleted": () => void reload(),
    "member:added": () => void reload(),
    "member:updated": () => void reload(),
    "member:removed": () => void reload(),
    "board:updated": () => void reload(),
    "board:deleted": () => navigate("/"),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const findColumnOfCard = (cardId: string) =>
    columns.find((col) => col.cards.some((c) => c.id === cardId));

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (active.data.current?.type === "card") {
      setActiveCard(active.data.current.card as CardT);
    }
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || active.data.current?.type !== "card") return;
    const fromCol = findColumnOfCard(String(active.id));
    const toCol =
      over.data.current?.type === "card"
        ? findColumnOfCard(String(over.id))
        : columns.find((c) => c.id === over.id);
    if (!fromCol || !toCol || fromCol.id === toCol.id) return;

    setColumns((cols) => {
      const card = fromCol.cards.find((c) => c.id === active.id)!;
      return cols.map((col) => {
        if (col.id === fromCol.id) {
          return { ...col, cards: col.cards.filter((c) => c.id !== active.id) };
        }
        if (col.id === toCol.id) {
          const overIndex = col.cards.findIndex((c) => c.id === over.id);
          const insertAt = overIndex >= 0 ? overIndex : col.cards.length;
          const cards = [...col.cards];
          cards.splice(insertAt, 0, { ...card, columnId: col.id });
          return { ...col, cards };
        }
        return col;
      });
    });
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveCard(null);
    if (!over) return;

    if (active.data.current?.type === "column") {
      const fromIndex = columns.findIndex((c) => c.id === active.id);
      const toIndex = columns.findIndex((c) => c.id === over.id);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;
      const reordered = arrayMove(columns, fromIndex, toIndex);
      setColumns(reordered);
      const without = reordered.filter((c) => c.id !== active.id);
      const newPos = positionAt(without, toIndex);
      setColumns((cols) =>
        cols.map((c) => (c.id === active.id ? { ...c, position: newPos } : c)),
      );
      await boardsApi.updateColumn(String(active.id), { position: newPos });
      return;
    }

    const col = findColumnOfCard(String(active.id));
    if (!col) return;
    const fromIndex = col.cards.findIndex((c) => c.id === active.id);
    let toIndex =
      over.data.current?.type === "card"
        ? col.cards.findIndex((c) => c.id === over.id)
        : col.cards.length - 1;
    if (toIndex < 0) toIndex = col.cards.length - 1;

    const reordered = arrayMove(col.cards, fromIndex, toIndex);
    const without = reordered.filter((c) => c.id !== active.id);
    const newPos = positionAt(without, toIndex);

    setColumns((cols) =>
      cols.map((c) =>
        c.id === col.id
          ? {
              ...c,
              cards: reordered.map((card) =>
                card.id === active.id ? { ...card, position: newPos } : card,
              ),
            }
          : c,
      ),
    );
    await boardsApi.updateCard(String(active.id), {
      columnId: col.id,
      position: newPos,
    });
  };

  const handleAddColumn = async (e: FormEvent) => {
    e.preventDefault();
    if (!boardId || !columnTitle.trim()) return;
    const column = await boardsApi.createColumn(boardId, columnTitle.trim());
    setColumns((cols) => [...cols, { ...column, cards: [] }]);
    setColumnTitle("");
    setAddingColumn(false);
  };

  const handleAddCard = async (columnId: string, title: string) => {
    const card = await boardsApi.createCard(columnId, title);
    setColumns((cols) =>
      cols.map((c) => (c.id === columnId ? { ...c, cards: [...c.cards, card] } : c)),
    );
  };

  const handleDeleteColumn = async (columnId: string) => {
    await boardsApi.deleteColumn(columnId);
    setColumns((cols) => cols.filter((c) => c.id !== columnId));
  };

  if (!board) return null;

  return (
    <Box
      sx={{
        ...bgStyle(board.background),
        minHeight: "calc(100vh - 49px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          gap: "12px",
          px: "16px",
          py: "10px",
          bgcolor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(6px)",
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{ flex: 1, color: "#FFFFFF", fontSize: 18, fontWeight: 700 }}
        >
          {board.title}
        </Typography>
        <Stack direction="row" sx={{ mr: "4px" }}>
          {board.members.slice(0, 5).map((m, i) => (
            <Box
              key={m.userId}
              title={m.user.name}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                bgcolor: "#00A3BF",
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid rgba(255,255,255,0.8)",
                ml: i > 0 ? "-6px" : 0,
              }}
            >
              {m.user.name[0]?.toUpperCase()}
            </Box>
          ))}
        </Stack>
        <Button
          onClick={() => setMembersOpen(true)}
          sx={{
            color: "#FFFFFF",
            bgcolor: "rgba(255,255,255,0.2)",
            borderRadius: "6px",
            "&:hover": { bgcolor: "rgba(255,255,255,0.32)" },
          }}
        >
          Share
        </Button>
      </Stack>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={columns.map((c) => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          <Stack
            direction="row"
            spacing="12px"
            sx={{ overflowX: "auto", p: "16px", flex: 1, alignItems: "flex-start" }}
          >
            {columns.map((column) => (
              <ColumnView
                key={column.id}
                column={column}
                canEdit={canEdit}
                onAddCard={handleAddCard}
                onDeleteColumn={handleDeleteColumn}
                onCardClick={(card) => setOpenCardId(card.id)}
              />
            ))}

            {canEdit && (
              <Box sx={{ width: 272, flexShrink: 0 }}>
                {addingColumn ? (
                  <Box
                    component="form"
                    onSubmit={handleAddColumn}
                    sx={{ bgcolor: trello.listBg, borderRadius: "12px", p: "8px" }}
                  >
                    <TextField
                      value={columnTitle}
                      onChange={(e) => setColumnTitle(e.target.value)}
                      placeholder="Enter list title..."
                      size="small"
                      autoFocus
                      fullWidth
                      onBlur={() => !columnTitle.trim() && setAddingColumn(false)}
                    />
                    <Button type="submit" variant="contained" size="small" sx={{ mt: "8px" }}>
                      Add list
                    </Button>
                  </Box>
                ) : (
                  <Button
                    fullWidth
                    onClick={() => setAddingColumn(true)}
                    sx={{
                      justifyContent: "flex-start",
                      color: "#FFFFFF",
                      bgcolor: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(4px)",
                      borderRadius: "12px",
                      p: "10px 12px",
                      fontWeight: 500,
                      "&:hover": { bgcolor: "rgba(255,255,255,0.32)" },
                    }}
                  >
                    + Add another list
                  </Button>
                )}
              </Box>
            )}
          </Stack>
        </SortableContext>

        <DragOverlay>
          {activeCard && <CardItem card={activeCard} onClick={() => {}} disabled />}
        </DragOverlay>
      </DndContext>

      {openCardId && (
        <CardModal
          cardId={openCardId}
          canEdit={canEdit}
          onClose={() => setOpenCardId(null)}
          onChanged={() => void reload()}
          onDeleted={() => void reload()}
        />
      )}
      {membersOpen && (
        <MembersDialog
          boardId={board.id}
          ownerId={board.ownerId}
          members={board.members}
          isOwner={myRole === "owner"}
          onClose={() => setMembersOpen(false)}
          onChanged={() => void reload()}
        />
      )}
    </Box>
  );
};
