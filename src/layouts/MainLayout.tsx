import { AppBar, Avatar, Box, Button, InputBase, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { usePermission } from "../hooks/usePermission";
import { logout } from "../services/auth";
import { trello } from "../theme/theme";

const navButtonSx = {
  color: trello.text,
  fontWeight: 500,
  px: "12px",
  "&:hover": { backgroundColor: "rgba(161,189,217,0.12)" },
};

export const MainLayout = () => {
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const { hasRole } = usePermission();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: trello.surface }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: "8px" }}>
          <Typography
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: "none",
              color: trello.text,
              fontWeight: 700,
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              mr: "8px",
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "4px",
                bgcolor: trello.brand,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: trello.textInverse,
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              T
            </Box>
            Trello
          </Typography>
          <Button component={RouterLink} to="/" sx={navButtonSx}>
            Boards
          </Button>
          {hasRole("admin") && (
            <Button component={RouterLink} to="/admin" sx={navButtonSx}>
              Admin
            </Button>
          )}

          <Box sx={{ flex: 1, display: "flex", justifyContent: "center", px: "16px" }}>
            <InputBase
              placeholder="Search"
              sx={{
                width: "100%",
                maxWidth: 640,
                height: 32,
                px: "12px",
                fontSize: 14,
                color: trello.text,
                bgcolor: trello.surfaceRaised,
                border: `1px solid ${trello.borderInput}`,
                borderRadius: "6px",
                "&:focus-within": { borderColor: trello.borderFocused },
              }}
            />
          </Box>

          <Button variant="contained" onClick={() => navigate("/?create=1")}>
            Create
          </Button>
          <Avatar
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            sx={{
              bgcolor: "#00A3BF",
              color: "#FFFFFF",
              cursor: "pointer",
              ml: "4px",
            }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Menu
            anchorEl={menuAnchor}
            open={!!menuAnchor}
            onClose={() => setMenuAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ px: "12px", py: "8px" }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.name}
              </Typography>
              <Typography variant="caption">{user?.email}</Typography>
            </Box>
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
};
