import { Box, CssBaseline, Paper, Stack, ThemeProvider, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { lightTheme } from "../../theme/theme";

export const AuthLayout = ({ title, children }: { title: string; children: ReactNode }) => (
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#FAFBFC",
        px: "16px",
      }}
    >
      <Paper
        sx={{
          width: 400,
          maxWidth: "100%",
          p: "32px 40px",
          boxShadow: "0 8px 12px rgba(9,30,66,0.15), 0 0 1px rgba(9,30,66,0.31)",
          borderRadius: "3px",
        }}
      >
        <Stack alignItems="center" sx={{ mb: "24px" }}>
          <Stack direction="row" alignItems="center" spacing="8px" sx={{ mb: "16px" }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "6px",
                bgcolor: "#0C66E4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              T
            </Box>
            <Typography sx={{ fontSize: 28, fontWeight: 700, color: "#172B4D" }}>
              Trello
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#172B4D" }}>
            {title}
          </Typography>
        </Stack>
        {children}
      </Paper>
    </Box>
  </ThemeProvider>
);
