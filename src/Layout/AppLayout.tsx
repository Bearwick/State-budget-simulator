import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import { AppBarHeader } from "./AppBar";

export const AppLayout = () => {
  return (
    <Stack>
      <AppBarHeader />
      <Box sx={{ pt: 8 }}>
        <Outlet />
      </Box>
    </Stack>
  );
};
