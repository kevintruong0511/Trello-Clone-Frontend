import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { DashboardPage } from "./pages/boards/DashboardPage";
import { BoardPage } from "./pages/board/BoardPage";
import { AdminPage } from "./pages/admin/AdminPage";
import { MainLayout } from "./layouts/MainLayout";
import { ProtectedRoute, RequireRole } from "./routes/ProtectedRoute";
import { bootstrapSession } from "./services/auth";

export const App = () => {
  useEffect(() => {
    void bootstrapSession();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/boards/:id" element={<BoardPage />} />
          <Route element={<RequireRole role="admin" />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
