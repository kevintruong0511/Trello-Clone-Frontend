import { Link as RouterLink, Navigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { lightTheme } from "../../theme/theme";
import { useAppSelector } from "../../redux/hooks";

const BLUE = "#0C66E4";
const NAVY = "#0C3953";
const INK = "#172B4D";
const SUBTLE = "#44546F";

const NAV_LINKS = ["Features", "Solutions", "Plans", "Pricing", "Resources"];

const Logo = ({ light = false }: { light?: boolean }) => (
  <Stack direction="row" alignItems="center" spacing="8px">
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: "6px",
        bgcolor: light ? "#FFFFFF" : BLUE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: light ? BLUE : "#FFFFFF",
        fontWeight: 800,
        fontSize: 16,
      }}
    >
      T
    </Box>
    <Typography sx={{ fontSize: 24, fontWeight: 800, color: light ? "#FFFFFF" : NAVY }}>
      Trello
    </Typography>
  </Stack>
);

const TopNav = () => (
  <Box
    component="header"
    sx={{
      position: "sticky",
      top: 0,
      zIndex: 10,
      bgcolor: "#FFFFFF",
      borderBottom: "1px solid #DFE1E6",
    }}
  >
    <Container maxWidth="lg">
      <Stack direction="row" alignItems="center" sx={{ height: 64, gap: "8px" }}>
        <RouterLink to="/" style={{ textDecoration: "none" }}>
          <Logo />
        </RouterLink>
        <Stack direction="row" sx={{ ml: "16px", display: { xs: "none", md: "flex" } }}>
          {NAV_LINKS.map((l) => (
            <Button
              key={l}
              sx={{
                color: SUBTLE,
                fontWeight: 600,
                px: "12px",
                "&:hover": { bgcolor: "#F4F5F7", color: INK },
              }}
            >
              {l}
            </Button>
          ))}
        </Stack>
        <Box sx={{ flex: 1 }} />
        <Button
          component={RouterLink}
          to="/login"
          sx={{
            color: INK,
            fontWeight: 600,
            "&:hover": { bgcolor: "#F4F5F7" },
          }}
        >
          Log in
        </Button>
        <Button
          component={RouterLink}
          to="/register"
          variant="contained"
          sx={{ bgcolor: BLUE, fontWeight: 700, px: "16px", "&:hover": { bgcolor: "#0055CC" } }}
        >
          Get started
        </Button>
      </Stack>
    </Container>
  </Box>
);

const BoardMockup = () => {
  const list = (title: string, cards: string[]) => (
    <Box
      sx={{
        width: 200,
        flexShrink: 0,
        bgcolor: "#F1F2F4",
        borderRadius: "8px",
        p: "8px",
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: INK, px: "4px", mb: "8px" }}>
        {title}
      </Typography>
      <Stack spacing="8px">
        {cards.map((c) => (
          <Box
            key={c}
            sx={{
              bgcolor: "#FFFFFF",
              borderRadius: "6px",
              p: "8px 10px",
              fontSize: 13,
              color: INK,
              boxShadow: "0 1px 1px rgba(9,30,66,.25)",
            }}
          >
            {c}
          </Box>
        ))}
      </Stack>
    </Box>
  );

  return (
    <Box
      sx={{
        borderRadius: "12px",
        p: "16px",
        background: "linear-gradient(135deg, #0079BF 0%, #5BA4CF 100%)",
        boxShadow: "0 20px 40px rgba(9,30,66,.25)",
      }}
    >
      <Stack direction="row" spacing="12px" sx={{ overflow: "hidden" }}>
        {list("To Do", ["Design landing page", "Research trello.com", "Sketch wireframes"])}
        {list("Doing", ["Build top navigation", "Wire up auth flow"])}
        {list("Done", ["Set up project", "Theme + design tokens"])}
      </Stack>
    </Box>
  );
};

const Hero = () => (
  <Box
    sx={{
      background: "linear-gradient(180deg, #FFFFFF 0%, #E4F0F6 100%)",
      py: { xs: "48px", md: "80px" },
    }}
  >
    <Container maxWidth="lg">
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="center"
        spacing={{ xs: "40px", md: "48px" }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: { xs: 36, md: 48 },
              fontWeight: 800,
              lineHeight: 1.1,
              color: NAVY,
              mb: "20px",
            }}
          >
            Capture, organize, and tackle your to-dos from anywhere.
          </Typography>
          <Typography sx={{ fontSize: 18, color: SUBTLE, mb: "32px", maxWidth: 520 }}>
            Escape the clutter and chaos. Unleash your team's productivity with boards,
            lists, and cards. Get started for free.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing="12px">
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              sx={{
                bgcolor: BLUE,
                fontWeight: 700,
                fontSize: 16,
                minHeight: 48,
                px: "24px",
                "&:hover": { bgcolor: "#0055CC" },
              }}
            >
              Sign up - it's free!
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              sx={{
                color: INK,
                borderColor: "#8590A2",
                fontWeight: 600,
                fontSize: 16,
                minHeight: 48,
                px: "24px",
                "&:hover": { borderColor: INK, bgcolor: "#FFFFFF" },
              }}
            >
              Log in
            </Button>
          </Stack>
        </Box>
        <Box sx={{ flex: 1, width: "100%" }}>
          <BoardMockup />
        </Box>
      </Stack>
    </Container>
  </Box>
);

const FEATURES = [
  {
    icon: "🗂",
    title: "Boards",
    body: "Trello boards keep tasks organized and work moving forward. See everything at a glance.",
  },
  {
    icon: "📋",
    title: "Lists",
    body: "The different stages of a task. Start as simple as To Do, Doing, or Done.",
  },
  {
    icon: "🃏",
    title: "Cards",
    body: "Cards represent tasks and ideas. Add checklists, due dates, labels, and more.",
  },
];

const Features = () => (
  <Container maxWidth="lg" sx={{ py: { xs: "48px", md: "80px" } }}>
    <Typography
      sx={{ fontSize: 32, fontWeight: 800, color: NAVY, textAlign: "center", mb: "12px" }}
    >
      A productivity powerhouse
    </Typography>
    <Typography
      sx={{ fontSize: 18, color: SUBTLE, textAlign: "center", mb: "48px", maxWidth: 640, mx: "auto" }}
    >
      Simple, flexible, and powerful. All it takes are boards, lists, and cards to get a
      clear view of who's doing what and what needs to get done.
    </Typography>
    <Stack direction={{ xs: "column", md: "row" }} spacing="24px">
      {FEATURES.map((f) => (
        <Box
          key={f.title}
          sx={{
            flex: 1,
            bgcolor: "#FFFFFF",
            border: "1px solid #DFE1E6",
            borderRadius: "12px",
            p: "32px",
            textAlign: "center",
          }}
        >
          <Box sx={{ fontSize: 40, mb: "16px" }}>{f.icon}</Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: INK, mb: "8px" }}>
            {f.title}
          </Typography>
          <Typography sx={{ fontSize: 15, color: SUBTLE, lineHeight: 1.5 }}>{f.body}</Typography>
        </Box>
      ))}
    </Stack>
  </Container>
);

const CtaBand = () => (
  <Box sx={{ background: `linear-gradient(135deg, ${NAVY} 0%, #026AA7 100%)`, py: "64px" }}>
    <Container maxWidth="md" sx={{ textAlign: "center" }}>
      <Typography sx={{ fontSize: 32, fontWeight: 800, color: "#FFFFFF", mb: "16px" }}>
        Get started with Trello today
      </Typography>
      <Typography sx={{ fontSize: 18, color: "rgba(255,255,255,0.85)", mb: "32px" }}>
        Join thousands of teams that organize their work with boards, lists, and cards.
      </Typography>
      <Button
        component={RouterLink}
        to="/register"
        variant="contained"
        sx={{
          bgcolor: "#FFFFFF",
          color: BLUE,
          fontWeight: 700,
          fontSize: 16,
          minHeight: 48,
          px: "32px",
          "&:hover": { bgcolor: "#E4F0F6" },
        }}
      >
        Sign up - it's free!
      </Button>
    </Container>
  </Box>
);

const Footer = () => (
  <Box sx={{ bgcolor: NAVY, py: "32px" }}>
    <Container maxWidth="lg">
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        justifyContent="space-between"
        spacing="16px"
      >
        <Logo light />
        <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
          A Trello clone built for learning. Not affiliated with Atlassian.
        </Typography>
      </Stack>
    </Container>
  </Box>
);

export const LandingPage = () => {
  const { accessToken, initialized } = useAppSelector((s) => s.auth);
  if (initialized && accessToken) return <Navigate to="/boards" replace />;

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "#FFFFFF" }}>
        <TopNav />
        <Hero />
        <Features />
        <CtaBand />
        <Footer />
      </Box>
    </ThemeProvider>
  );
};
