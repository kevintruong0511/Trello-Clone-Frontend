import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import * as adminApi from "../../services/admin";
import { useAppSelector } from "../../redux/hooks";

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <Paper variant="outlined" sx={{ p: "24px" }}>
    <Typography variant="h1" component="div" sx={{ fontSize: 40, lineHeight: "44px" }}>
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Paper>
);

const UsersTab = () => {
  const me = useAppSelector((s) => s.auth.user);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<adminApi.AdminUser[]>([]);

  const load = useCallback(
    () => adminApi.listUsers(search || undefined).then((d) => setUsers(d.users)),
    [search],
  );
  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Box>
      <TextField
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: "16px", width: 320 }}
      />
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Roles</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => {
            const isSelf = u.id === me?.id;
            const isAdmin = u.roles.includes("admin");
            return (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.roles.join(", ")}</TableCell>
                <TableCell>{u.status}</TableCell>
                <TableCell align="right">
                  {!isSelf && (
                    <Stack direction="row" spacing="8px" justifyContent="flex-end">
                      <Button
                        size="small"
                        color="inherit"
                        onClick={async () => {
                          await adminApi.setUserRole(u.id, isAdmin ? "user" : "admin");
                          await load();
                        }}
                      >
                        {isAdmin ? "Demote" : "Promote"}
                      </Button>
                      <Button
                        size="small"
                        color="inherit"
                        onClick={async () => {
                          await adminApi.setUserBan(u.id, u.status === "active");
                          await load();
                        }}
                      >
                        {u.status === "active" ? "Ban" : "Unban"}
                      </Button>
                      <Button
                        size="small"
                        color="inherit"
                        onClick={async () => {
                          if (confirm(`Delete user ${u.email}?`)) {
                            await adminApi.deleteUser(u.id);
                            await load();
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};

const BoardsTab = () => {
  const [boards, setBoards] = useState<adminApi.AdminBoard[]>([]);
  const load = useCallback(
    () => adminApi.listAllBoards().then((d) => setBoards(d.boards)),
    [],
  );
  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Owner</TableCell>
          <TableCell>Members</TableCell>
          <TableCell>Cards</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {boards.map((b) => (
          <TableRow key={b.id}>
            <TableCell>{b.title}</TableCell>
            <TableCell>{b.owner.email}</TableCell>
            <TableCell>{b._count.members}</TableCell>
            <TableCell>{b._count.cards}</TableCell>
            <TableCell align="right">
              <Button
                size="small"
                color="inherit"
                onClick={async () => {
                  if (confirm(`Delete board "${b.title}"?`)) {
                    await adminApi.deleteAnyBoard(b.id);
                    await load();
                  }
                }}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const StatsTab = () => {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof adminApi.getStats>> | null>(
    null,
  );
  useEffect(() => {
    void adminApi.getStats().then(setStats);
  }, []);
  if (!stats) return null;
  return (
    <Grid container spacing="20px">
      <Grid item xs={6} md={3}>
        <StatCard label="Total users" value={stats.users} />
      </Grid>
      <Grid item xs={6} md={3}>
        <StatCard label="Active users" value={stats.activeUsers} />
      </Grid>
      <Grid item xs={6} md={3}>
        <StatCard label="Boards" value={stats.boards} />
      </Grid>
      <Grid item xs={6} md={3}>
        <StatCard label="Cards" value={stats.cards} />
      </Grid>
    </Grid>
  );
};

const ActivityTab = () => {
  const [rows, setRows] = useState<adminApi.AuditRow[]>([]);
  useEffect(() => {
    void adminApi.getActivity().then(setRows);
  }, []);
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Time</TableCell>
          <TableCell>Action</TableCell>
          <TableCell>Actor</TableCell>
          <TableCell>Target</TableCell>
          <TableCell>IP</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell>
              <Typography variant="caption">
                {new Date(r.createdAt).toLocaleString()}
              </Typography>
            </TableCell>
            <TableCell>{r.action}</TableCell>
            <TableCell>
              <Typography variant="caption">{r.actorId ?? "-"}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="caption">{r.targetId ?? "-"}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="caption">{r.ipAddress ?? "-"}</Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const AdminPage = () => {
  const [tab, setTab] = useState(0);
  return (
    <Container maxWidth="lg" sx={{ py: "32px" }}>
      <Typography variant="h2" component="h1" sx={{ mb: "16px" }}>
        Admin dashboard
      </Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: "16px" }}>
        <Tab label="Stats" />
        <Tab label="Users" />
        <Tab label="Boards" />
        <Tab label="Activity" />
      </Tabs>
      <Paper sx={{ p: "16px" }}>
        {tab === 0 && <StatsTab />}
        {tab === 1 && <UsersTab />}
        {tab === 2 && <BoardsTab />}
        {tab === 3 && <ActivityTab />}
      </Paper>
    </Container>
  );
};
