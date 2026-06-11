import { useState, type FormEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { AuthLayout } from "./AuthLayout";
import { register } from "../../services/auth";
import { apiErrorMessage } from "../../utils/apiError";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err: any) {
      setError(apiErrorMessage(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign up to continue">
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing="16px">
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
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
            helperText="At least 8 characters"
          />
          {error && (
            <Typography variant="caption" role="alert">
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" disabled={loading} fullWidth>
            {loading ? "Creating..." : "Create account"}
          </Button>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link component={RouterLink} to="/login" color="inherit">
              Log in
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
};
