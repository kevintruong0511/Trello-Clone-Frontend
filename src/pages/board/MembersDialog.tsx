import { useState, type FormEvent } from "react";
import {
  Box,
  Button,
  Dialog,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { BoardMemberT } from "../../types/board";
import { inviteMember, removeMember, updateMemberRole } from "../../services/boards";

export const MembersDialog = ({
  boardId,
  ownerId,
  members,
  isOwner,
  onClose,
  onChanged,
}: {
  boardId: string;
  ownerId: string;
  members: BoardMemberT[];
  isOwner: boolean;
  onClose: () => void;
  onChanged: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "viewer">("member");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await inviteMember(boardId, email.trim(), role);
      setEmail("");
      onChanged();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Invite failed");
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <Typography variant="h2" sx={{ mb: "24px" }}>
        Board members
      </Typography>

      {isOwner && (
        <Box component="form" onSubmit={submit} sx={{ mb: "24px" }}>
          <Stack spacing="12px">
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
              required
              fullWidth
            />
            <Stack direction="row" spacing="8px">
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value as "member" | "viewer")}
                size="small"
                sx={{ flex: 1 }}
              >
                <MenuItem value="member">Member</MenuItem>
                <MenuItem value="viewer">Viewer</MenuItem>
              </Select>
              <Button type="submit" variant="contained">
                Invite
              </Button>
            </Stack>
            {error && (
              <Typography variant="caption" role="alert">
                {error}
              </Typography>
            )}
          </Stack>
        </Box>
      )}

      <Stack spacing="12px">
        {members.map((m) => (
          <Stack key={m.userId} direction="row" alignItems="center" spacing="12px">
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">{m.user.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {m.user.email}
              </Typography>
            </Box>
            {isOwner && m.userId !== ownerId ? (
              <>
                <Select
                  value={m.role}
                  size="small"
                  onChange={async (e) => {
                    await updateMemberRole(boardId, m.userId, e.target.value);
                    onChanged();
                  }}
                >
                  <MenuItem value="member">Member</MenuItem>
                  <MenuItem value="viewer">Viewer</MenuItem>
                </Select>
                <Button
                  color="inherit"
                  onClick={async () => {
                    await removeMember(boardId, m.userId);
                    onChanged();
                  }}
                >
                  Remove
                </Button>
              </>
            ) : (
              <Typography variant="caption">{m.role}</Typography>
            )}
          </Stack>
        ))}
      </Stack>

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: "24px" }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </Stack>
    </Dialog>
  );
};
