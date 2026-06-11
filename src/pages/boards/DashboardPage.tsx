import { useEffect, useState, type FormEvent } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { createBoard, listBoards } from "../../services/boards";
import type { BoardSummary } from "../../types/board";
import { BOARD_BACKGROUNDS, bgStyle, trello } from "../../theme/theme";
import { useAppSelector } from "../../redux/hooks";

const SidebarItem = ({
  label,
  to,
  selected,
  icon,
}: {
  label: string;
  to: string;
  selected?: boolean;
  icon: string;
}) => (
  <ButtonBase
    component={RouterLink}
    to={to}
    sx={{
      width: "100%",
      justifyContent: "flex-start",
      gap: "10px",
      px: "12px",
      py: "8px",
      borderRadius: "8px",
      fontSize: 14,
      fontWeight: selected ? 600 : 500,
      color: selected ? trello.brand : trello.text,
      bgcolor: selected ? trello.brandSelectedBg : "transparent",
      "&:hover": { bgcolor: selected ? trello.brandSelectedBg : "rgba(161,189,217,0.08)" },
    }}
  >
    <span style={{ fontSize: 15 }}>{icon}</span>
    {label}
  </ButtonBase>
);

const BoardTile = ({ board }: { board: BoardSummary }) => (
  <ButtonBase
    component={RouterLink}
    to={`/boards/${board.id}`}
    sx={{
      width: "100%",
      borderRadius: "8px",
      overflow: "hidden",
      flexDirection: "column",
      alignItems: "stretch",
      bgcolor: trello.surfaceRaised,
      transition: "transform 0.1s, box-shadow 0.1s",
      "&:hover": { boxShadow: trello.shadowOverlay, transform: "translateY(-1px)" },
    }}
  >
    <Box sx={{ height: 88, ...bgStyle(board.background) }} />
    <Box sx={{ p: "8px 12px", textAlign: "left" }}>
      <Typography variant="body2" sx={{ fontWeight: 600, color: trello.text }}>
        {board.title}
      </Typography>
    </Box>
  </ButtonBase>
);

export const DashboardPage = () => {
  const user = useAppSelector((s) => s.auth.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [open, setOpen] = useState(searchParams.get("create") === "1");
  const [title, setTitle] = useState("");
  const [background, setBackground] = useState(BOARD_BACKGROUNDS[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void listBoards().then(setBoards);
  }, []);

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const board = await createBoard({ title: title.trim(), background });
      setBoards((prev) => [board, ...prev]);
      setOpen(false);
      setTitle("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", maxWidth: 1280, mx: "auto", gap: "24px", px: "16px", py: "32px" }}>
      <Box sx={{ width: 240, flexShrink: 0, display: { xs: "none", md: "block" } }}>
        <Stack spacing="2px">
          <SidebarItem label="Boards" to="/" selected icon="🗂" />
          <SidebarItem label="Home" to="/" icon="🏠" />
        </Stack>
        <Typography
          variant="caption"
          sx={{ display: "block", mt: "20px", mb: "8px", px: "12px", fontWeight: 600 }}
        >
          Workspaces
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            px: "12px",
            py: "8px",
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "6px",
              background: "linear-gradient(135deg, #4BCE97, #1F845A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {user?.name?.[0]?.toUpperCase() ?? "W"}
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: trello.text }}>
            {user?.name}'s Workspace
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="h3"
          sx={{ mb: "16px", color: trello.textSubtle, letterSpacing: "0.5px" }}
        >
          YOUR BOARDS
        </Typography>

        <Grid container spacing="16px">
          {boards.map((b) => (
            <Grid item xs={12} sm={6} md={3} key={b.id}>
              <BoardTile board={b} />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={3}>
            <ButtonBase
              onClick={() => setOpen(true)}
              sx={{
                width: "100%",
                height: 124,
                borderRadius: "8px",
                bgcolor: trello.bgNeutral,
                color: trello.textSubtle,
                fontSize: 14,
                "&:hover": { bgcolor: trello.bgNeutralHover },
              }}
            >
              Create new board
            </ButtonBase>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <Box component="form" onSubmit={handleCreate}>
          <Typography variant="h3" sx={{ mb: "16px", textAlign: "center", color: trello.text }}>
            Create board
          </Typography>
          <Box
            sx={{
              height: 110,
              borderRadius: "8px",
              ...bgStyle(background),
              mb: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "#FFFFFF", fontWeight: 700, textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
              {title || "Board preview"}
            </Typography>
          </Box>
          <Stack spacing="16px">
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, display: "block", mb: "6px" }}>
                Background
              </Typography>
              <Grid container spacing="6px">
                {BOARD_BACKGROUNDS.map((c) => (
                  <Grid item key={c}>
                    <ButtonBase
                      onClick={() => setBackground(c)}
                      sx={{
                        width: 56,
                        height: 36,
                        borderRadius: "4px",
                        ...bgStyle(c),
                        outline:
                          background === c ? `2px solid ${trello.borderFocused}` : "none",
                        outlineOffset: 1,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
            <TextField
              label="Board title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !title.trim()}
              fullWidth
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};
