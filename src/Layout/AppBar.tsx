import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { paths } from "../Routes/paths";

export const AppBarHeader = () => {
  return (
    <AppBar
      sx={{
        backgroundColor: "#ffffff",
      }}
      position="fixed"
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Typography
          variant="h6"
          component={Link}
          to={paths.HOME}
          sx={{
            textDecoration: "none",
            color: "black",
            fontWeight: "bold",
          }}
        >
          Statsbudsjettsimulator
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
