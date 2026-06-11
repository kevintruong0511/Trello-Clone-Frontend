import { useState, type FormEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { AuthLayout } from "./AuthLayout";
import { login } from "../../services/auth";
import { apiErrorMessage } from "../../utils/apiError";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(apiErrorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Log in to continue">
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing="16px">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          {error && (
            <Typography variant="caption" role="alert">
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" disabled={loading} fullWidth>
            {loading ? "Logging in..." : "Log in"}
          </Button>
          <Typography variant="body2">
            No account?{" "}
            <Link component={RouterLink} to="/register" color="inherit">
              Register
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
};
