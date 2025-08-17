import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { paths } from "../Routes/paths";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <Stack>
      <Typography>Regjeringens statsbudsjett</Typography>
      <Button component={Link} to={paths.BUDGET_SIMULATOR}>
        Lag ditt statsbudsjett
      </Button>
    </Stack>
  );
};
