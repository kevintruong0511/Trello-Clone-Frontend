import { useEffect, useState, type FormEvent } from "react";
import {
  Box,
  Button,
  Dialog,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { CardDetail } from "../../types/board";
import { addComment, deleteCard, getCard, updateCard } from "../../services/boards";

export const CardModal = ({
  cardId,
  canEdit,
  onClose,
  onChanged,
  onDeleted,
}: {
  cardId: string;
  canEdit: boolean;
  onClose: () => void;
  onChanged: () => void;
  onDeleted: () => void;
}) => {
  const [card, setCard] = useState<CardDetail | null>(null);
  const [description, setDescription] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    void getCard(cardId).then((c) => {
      setCard(c);
      setDescription(c.description ?? "");
    });
  }, [cardId]);

  const saveDescription = async () => {
    if (!card || description === (card.description ?? "")) return;
    await updateCard(card.id, { description: description || null });
    onChanged();
  };

  const submitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!card || !comment.trim()) return;
    const created = await addComment(card.id, comment.trim());
    setCard({ ...card, comments: [created, ...card.comments] });
    setComment("");
    onChanged();
  };

  const handleDelete = async () => {
    if (!card) return;
    await deleteCard(card.id);
    onDeleted();
    onClose();
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      {card && (
        <Box>
          <Typography variant="h2" sx={{ mb: "24px" }}>
            {card.title}
          </Typography>

          <Typography variant="h3" sx={{ mb: "8px" }}>
            Description
          </Typography>
          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={saveDescription}
            multiline
            minRows={3}
            fullWidth
            disabled={!canEdit}
            placeholder="Add a description..."
            sx={{ mb: "24px" }}
          />

          <Typography variant="h3" sx={{ mb: "8px" }}>
            Comments
          </Typography>
          {canEdit && (
            <Box component="form" onSubmit={submitComment} sx={{ mb: "16px" }}>
              <Stack direction="row" spacing="8px">
                <TextField
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  size="small"
                  fullWidth
                />
                <Button type="submit" variant="outlined">
                  Send
                </Button>
              </Stack>
            </Box>
          )}
          <Stack spacing="12px" sx={{ mb: "24px", maxHeight: 240, overflowY: "auto" }}>
            {card.comments.map((c) => (
              <Box key={c.id}>
                <Typography variant="h3" component="span">
                  {c.user.name}
                </Typography>{" "}
                <Typography variant="caption" color="text.secondary" component="span">
                  {new Date(c.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2">{c.text}</Typography>
              </Box>
            ))}
            {card.comments.length === 0 && (
              <Typography variant="caption" color="text.secondary">
                No comments yet.
              </Typography>
            )}
          </Stack>

          <Stack direction="row" spacing="16px" justifyContent="flex-end">
            {canEdit && (
              <Button onClick={handleDelete} color="inherit">
                Delete card
              </Button>
            )}
            <Button onClick={onClose} variant="outlined">
              Close
            </Button>
          </Stack>
        </Box>
      )}
    </Dialog>
  );
};
