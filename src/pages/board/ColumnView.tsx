import { useState, type FormEvent } from "react";
import { Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CardT, ColumnT } from "../../types/board";
import { CardItem } from "./CardItem";
import { trello } from "../../theme/theme";

export const ColumnView = ({
  column,
  canEdit,
  onAddCard,
  onDeleteColumn,
  onCardClick,
}: {
  column: ColumnT;
  canEdit: boolean;
  onAddCard: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onCardClick: (card: CardT) => void;
}) => {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: column.id, data: { type: "column", column }, disabled: !canEdit });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddCard(column.id, title.trim());
    setTitle("");
  };

  return (
    <Box
      ref={setNodeRef}
      sx={{
        width: 272,
        flexShrink: 0,
        bgcolor: trello.listBg,
        borderRadius: "12px",
        p: "8px",
        alignSelf: "flex-start",
        maxHeight: "calc(100vh - 168px)",
        display: "flex",
        flexDirection: "column",
        boxShadow: trello.shadowCard,
        opacity: isDragging ? 0.4 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{ mb: "8px", px: "6px", pt: "4px", cursor: canEdit ? "grab" : "default" }}
        {...attributes}
        {...listeners}
      >
        <Typography variant="h3" sx={{ flex: 1, color: trello.text }}>
          {column.title}
        </Typography>
        {canEdit && (
          <IconButton
            size="small"
            aria-label="Delete column"
            onClick={() => onDeleteColumn(column.id)}
            sx={{ width: 24, height: 24, fontSize: 13, lineHeight: 1 }}
          >
            ✕
          </IconButton>
        )}
      </Stack>

      <SortableContext
        items={column.cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <Stack spacing="8px" sx={{ minHeight: 4, overflowY: "auto", px: "2px", pb: "2px" }}>
          {column.cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              disabled={!canEdit}
              onClick={() => onCardClick(card)}
            />
          ))}
        </Stack>
      </SortableContext>

      {canEdit &&
        (adding ? (
          <Box component="form" onSubmit={submit} sx={{ mt: "8px" }}>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title or paste a link"
              size="small"
              autoFocus
              fullWidth
              multiline
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: trello.cardBg,
                  borderRadius: "8px",
                  p: "8px 12px",
                },
              }}
            />
            <Stack direction="row" spacing="8px" alignItems="center" sx={{ mt: "8px" }}>
              <Button type="submit" variant="contained" size="small">
                Add card
              </Button>
              <IconButton
                size="small"
                onClick={() => {
                  setAdding(false);
                  setTitle("");
                }}
                sx={{ fontSize: 14 }}
              >
                ✕
              </IconButton>
            </Stack>
          </Box>
        ) : (
          <Button
            onClick={() => setAdding(true)}
            fullWidth
            sx={{
              mt: "4px",
              justifyContent: "flex-start",
              color: trello.textSubtle,
              fontWeight: 500,
              borderRadius: "8px",
              "&:hover": { bgcolor: "rgba(161,189,217,0.12)", color: trello.text },
            }}
          >
            + Add a card
          </Button>
        ))}
    </Box>
  );
};
