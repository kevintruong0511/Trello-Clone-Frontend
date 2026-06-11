import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAppSelector } from "../redux/hooks";

export const ProtectedRoute = () => {
  const { accessToken, initialized } = useAppSelector((s) => s.auth);

  if (!initialized) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export const RequireRole = ({ role }: { role: string }) => {
  const user = useAppSelector((s) => s.auth.user);
  return user?.roles.includes(role) ? <Outlet /> : <Navigate to="/" replace />;
};
