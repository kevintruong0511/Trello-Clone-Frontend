import { Box, Paper, Stack, Typography } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CardT } from "../../types/board";
import { trello } from "../../theme/theme";

export const CardItem = ({
  card,
  onClick,
  disabled,
}: {
  card: CardT;
  onClick: () => void;
  disabled?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id, data: { type: "card", card }, disabled });

  const overdue = card.dueDate && !card.dueComplete && new Date(card.dueDate) < new Date();

  return (
    <Paper
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onClick}
      sx={{
        p: "8px 12px",
        cursor: disabled ? "default" : "pointer",
        bgcolor: trello.cardBg,
        borderRadius: "8px",
        boxShadow: trello.shadowCard,
        border: "2px solid transparent",
        opacity: isDragging ? 0.4 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
        "&:hover": { borderColor: trello.borderFocused, bgcolor: trello.cardHover },
      }}
    >
      {card.cover && (
        <Box sx={{ height: 8, borderRadius: "4px", bgcolor: card.cover, mb: "6px" }} />
      )}
      <Typography variant="body2" sx={{ color: trello.text }}>
        {card.title}
      </Typography>
      {(card._count.comments > 0 || card.dueDate || card._count.checklists > 0) && (
        <Stack direction="row" spacing="8px" sx={{ mt: "6px", flexWrap: "wrap" }} useFlexGap>
          {card.dueDate && (
            <Typography
              variant="caption"
              sx={{
                px: "4px",
                py: "1px",
                borderRadius: "3px",
                bgcolor: card.dueComplete
                  ? "rgba(75,206,151,0.2)"
                  : overdue
                    ? "rgba(248,113,104,0.2)"
                    : "transparent",
                color: card.dueComplete
                  ? trello.successText
                  : overdue
                    ? trello.dangerText
                    : trello.textSubtlest,
              }}
            >
              🕐 {new Date(card.dueDate).toLocaleDateString()}
            </Typography>
          )}
          {card._count.comments > 0 && (
            <Typography variant="caption">💬 {card._count.comments}</Typography>
          )}
          {card._count.checklists > 0 && (
            <Typography variant="caption">☑ {card._count.checklists}</Typography>
          )}
        </Stack>
      )}
    </Paper>
  );
};
