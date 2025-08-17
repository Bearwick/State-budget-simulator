import Box from "@mui/material/Box";
import GitHubIcon from "@mui/icons-material/GitHub";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        bgcolor: "primary.dark",
        color: "primary.contrastText",
        height: "8rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack direction="row" spacing={4} alignItems="center">
        <Link
          href="https://github.com/Bearwick"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          underline="hover"
          sx={{ display: "flex", alignItems: "center" }}
          aria-label="GitHub"
        >
          <GitHubIcon fontSize="large" />
          <Box component="span" sx={{ ml: 1 }}>
            Edvard Bjørnevik
          </Box>
        </Link>
      </Stack>
    </Box>
  );
};
