import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useBudgetContext } from '../context/BudgetContext';

export const BudgetSimulatorPage = () => {
  const { data, loading, error } = useBudgetContext();
  return (
    <Stack>
      <Typography>Lag ditt eget statsbudsjett</Typography>
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
    </Stack>
  );
};
