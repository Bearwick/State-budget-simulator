import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { paths } from '../Routes/paths';
import { Link } from 'react-router-dom';
import { useBudgetData } from '../hooks/useBudgetData';

export const HomePage = () => {
  const { data, loading, error } = useBudgetData();
  return (
    <Stack>
      <Typography>Regjeringens statsbudsjett</Typography>

      {error && (
        <Typography color="error">
          En feil har oppstått: kunne ikke hente statsbudsjettet
        </Typography>
      )}

      {!loading &&
        data &&
        data.map((item) => (
          <Typography key={item.code}>
            {item.label}: {item.value.toLocaleString('no-NO')}
          </Typography>
        ))}

      <Button component={Link} to={paths.BUDGET_SIMULATOR}>
        Lag ditt statsbudsjett
      </Button>
    </Stack>
  );
};
