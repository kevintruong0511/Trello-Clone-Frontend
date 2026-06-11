import { createTheme } from "@mui/material/styles";

const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'";

/** Atlassian dark mode tokens (design.md section 5) */
export const trello = {
  surface: "#1D2125",
  surfaceRaised: "#22272B",
  surfaceOverlay: "#282E33",
  surfaceSunken: "#161A1D",
  bgNeutral: "#2C333A",
  bgNeutralHover: "#3A434B",
  text: "#B6C2CF",
  textSubtle: "#8C9BAB",
  textSubtlest: "#738496",
  textDisabled: "#586473",
  textInverse: "#1D2125",
  brand: "#579DFF",
  brandHover: "#85B8FF",
  brandPressed: "#388BFF",
  brandSelectedBg: "rgba(87,157,255,0.16)",
  border: "rgba(166,197,226,0.16)",
  borderInput: "#738496",
  borderFocused: "#85B8FF",
  danger: "#F87168",
  dangerText: "#FD9891",
  success: "#4BCE97",
  successText: "#7EE2B8",
  warning: "#F5CD47",
  listBg: "#101204",
  cardBg: "#22272B",
  cardHover: "#282E33",
  navBg: "#1D2125",
  shadowCard: "0 1px 1px rgba(3,4,4,0.5), 0 0 1px rgba(3,4,4,0.5)",
  shadowOverlay: "0 8px 12px rgba(3,4,4,0.36), 0 0 1px rgba(3,4,4,0.5)",
};

export const LABEL_COLORS = [
  "#F2D600",
  "#70B500",
  "#FF9F1A",
  "#EB5A46",
  "#00C2E0",
  "#C377E0",
  "#FF78CB",
  "#51E898",
  "#0079BF",
  "#C4C9CC",
];

/** Gradient + solid board backgrounds (CSS background values) */
export const BOARD_BACKGROUNDS = [
  "linear-gradient(135deg, #E09CC6 0%, #8D5Bb6 55%, #4E2A84 100%)",
  "linear-gradient(135deg, #FF7EB9 0%, #B04632 100%)",
  "linear-gradient(135deg, #00C2E0 0%, #0079BF 100%)",
  "linear-gradient(135deg, #579DFF 0%, #6E5DC6 100%)",
  "linear-gradient(135deg, #51E898 0%, #1F845A 100%)",
  "linear-gradient(135deg, #F5CD47 0%, #D29034 100%)",
  "#0079BF",
  "#89609E",
  "#838C91",
  "#1D2125",
];

export const bgStyle = (background?: string | null) => ({
  background: background ?? BOARD_BACKGROUNDS[3],
});

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: trello.brand, dark: trello.brandPressed, contrastText: trello.textInverse },
    secondary: { main: trello.textSubtle },
    error: { main: trello.danger },
    success: { main: trello.success },
    warning: { main: trello.warning },
    background: { default: trello.surface, paper: trello.surfaceRaised },
    text: {
      primary: trello.text,
      secondary: trello.textSubtle,
      disabled: trello.textDisabled,
    },
    divider: trello.border,
    action: {
      hover: "rgba(161,189,217,0.08)",
      selected: trello.brandSelectedBg,
      disabledBackground: trello.bgNeutral,
    },
  },
  typography: {
    fontFamily: FONT,
    h1: { fontSize: 24, fontWeight: 600, lineHeight: "28px" },
    h2: { fontSize: 20, fontWeight: 600, lineHeight: "24px" },
    h3: { fontSize: 14, fontWeight: 600, lineHeight: "16px" },
    subtitle1: { fontSize: 16, fontWeight: 600, lineHeight: "20px" },
    body1: { fontSize: 14, fontWeight: 400, lineHeight: "20px" },
    body2: { fontSize: 14, fontWeight: 400, lineHeight: "20px" },
    caption: { fontSize: 12, fontWeight: 400, lineHeight: "16px", color: trello.textSubtlest },
    button: { fontSize: 14, fontWeight: 500, textTransform: "none" },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: trello.surface },
        "::-webkit-scrollbar": { width: 8, height: 8 },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(166,197,226,0.3)",
          borderRadius: 8,
        },
        "::-webkit-scrollbar-track": { backgroundColor: "transparent" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: 32,
          padding: "6px 12px",
          borderRadius: 3,
          fontWeight: 500,
        },
        containedPrimary: {
          backgroundColor: trello.brand,
          color: trello.textInverse,
          fontWeight: 600,
          "&:hover": { backgroundColor: trello.brandHover },
          "&:active": { backgroundColor: trello.brandPressed },
        },
        outlined: {
          color: trello.text,
          borderColor: trello.borderInput,
          "&:hover": {
            backgroundColor: "rgba(161,189,217,0.08)",
            borderColor: trello.borderInput,
          },
        },
        text: {
          color: trello.text,
          "&:hover": { backgroundColor: "rgba(161,189,217,0.08)" },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: trello.textSubtle,
          borderRadius: 6,
          "&:hover": { backgroundColor: "rgba(161,189,217,0.12)" },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundImage: "none",
        },
        outlined: {
          border: `1px solid ${trello.border}`,
          boxShadow: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          backgroundColor: trello.surfaceRaised,
          fontSize: 14,
          color: trello.text,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: trello.borderInput },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: trello.textSubtle },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: trello.borderFocused,
            borderWidth: 2,
          },
        },
        input: {
          padding: "8px 12px",
          "&::placeholder": { color: trello.textSubtlest, opacity: 1 },
        },
        inputMultiline: { padding: 0 },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: 14, fontWeight: 500, color: trello.textSubtle },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: trello.surfaceOverlay,
          borderRadius: 12,
          padding: 24,
          boxShadow: trello.shadowOverlay,
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: trello.navBg,
          color: trello.text,
          borderBottom: `1px solid ${trello.border}`,
          backgroundImage: "none",
        },
      },
    },
    MuiToolbar: {
      defaultProps: { variant: "dense" },
      styleOverrides: {
        dense: { minHeight: 48 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 14,
          padding: "8px 12px",
          "&:hover": { backgroundColor: "rgba(161,189,217,0.08)" },
        },
      },
    },
    MuiSelect: {
      styleOverrides: { select: { fontSize: 14 } },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, fontSize: 14 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { fontSize: 14, color: trello.text, borderColor: trello.border },
        head: { fontWeight: 600, color: trello.textSubtle, fontSize: 12 },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: { width: 28, height: 28, fontSize: 12, fontWeight: 600 },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: { color: trello.brand },
      },
    },
  },
});

/** Light theme for auth pages (Atlassian id.atlassian.com style) */
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0C66E4", dark: "#0055CC", contrastText: "#FFFFFF" },
    background: { default: "#FAFBFC", paper: "#FFFFFF" },
    text: { primary: "#172B4D", secondary: "#44546F" },
    error: { main: "#CA3521" },
  },
  typography: {
    fontFamily: FONT,
    body1: { fontSize: 14, lineHeight: "20px" },
    body2: { fontSize: 14, lineHeight: "20px" },
    caption: { fontSize: 12, lineHeight: "16px" },
    button: { fontSize: 14, fontWeight: 600, textTransform: "none" },
  },
  shape: { borderRadius: 3 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { minHeight: 40, borderRadius: 3, fontWeight: 600 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          fontSize: 14,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#8590A2" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#388BFF",
            borderWidth: 2,
          },
        },
        input: { padding: "10px 12px" },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: 13, fontWeight: 600, color: "#44546F" },
      },
    },
  },
});
