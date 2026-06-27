import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/landing/LandingPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { DashboardPage } from "./pages/boards/DashboardPage";
import { BoardPage } from "./pages/board/BoardPage";
import { AdminPage } from "./pages/admin/AdminPage";
import { MainLayout } from "./layouts/MainLayout";
import { ProtectedRoute, RequireRole } from "./routes/ProtectedRoute";
import { bootstrapSession } from "./services/auth";

export const App = () => {
  // Restore the user session on app mount before rendering routes.
  useEffect(() => {
    void bootstrapSession();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/boards" element={<DashboardPage />} />
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
