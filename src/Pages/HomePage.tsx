import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { paths } from '../Routes/paths';
import { Link as RouterLink } from 'react-router-dom';
import { useBudgetData } from '../hooks/useBudgetData';
import { useBudgetContext } from '../context/BudgetContext';

export const HomePage = () => {
  useBudgetData();
  const { data, loading, error } = useBudgetContext();

  // Group data
  let inntekter: typeof data = [];
  let utgifter: typeof data = [];
  let balanse: typeof data = [];
  if (data) {
    inntekter = data.filter((item) => item.code.startsWith('INNT'));
    utgifter = data.filter((item) => item.code.startsWith('UTG'));
    balanse = data.filter((item) => !item.code.startsWith('INNT') && !item.code.startsWith('UTG'));
  }

  return (
    <Stack spacing={2} sx={{ p: 2 }} alignItems="center">
      <Typography variant="h4" gutterBottom align="center">
        Regjeringens statsbudsjett
      </Typography>
      <Typography variant="body1" align="center">
        Dette viser dagens regjeringens statsbudsjett hentet fra{' '}
        <Link href="https://www.ssb.no/statbank/table/10487" target="_blank" rel="noopener">
          Statistisk sentralbyrå (SSB)
        </Link>
        .
      </Typography>

      {error && (
        <Typography color="error">
          En feil har oppstått: kunne ikke hente statsbudsjettet
        </Typography>
      )}

      {!loading && data && (
        <>
          <Stack maxWidth="md" width="100%" alignItems="center" mb={2}>
            <Accordion sx={{ width: '100%', maxWidth: 'md' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Inntekter</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      {inntekter.map((item) => (
                        <TableRow key={item.code}>
                          <TableCell>{item.label}</TableCell>
                          <TableCell align="right">
                            {(item.value * 1_000_000).toLocaleString('no-NO')} kr
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Stack>
          <Stack maxWidth="md" width="100%" alignItems="center" mb={2}>
            <Accordion sx={{ width: '100%', maxWidth: 'md' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Utgifter</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      {utgifter.map((item) => (
                        <TableRow key={item.code}>
                          <TableCell>{item.label}</TableCell>
                          <TableCell align="right">
                            {(item.value * 1_000_000).toLocaleString('no-NO')} kr
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Stack>
          <Stack maxWidth="md" width="100%" alignItems="center" mb={2}>
            <Accordion sx={{ width: '100%', maxWidth: 'md' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Balanse og finansiering</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      {balanse.map((item) => (
                        <TableRow key={item.code}>
                          <TableCell>{item.label}</TableCell>
                          <TableCell align="right">
                            {(item.value * 1_000_000).toLocaleString('no-NO')} kr
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </>
      )}

      <Stack alignItems="center">
        <Button
          component={RouterLink}
          to={paths.BUDGET_SIMULATOR}
          variant="contained"
          color="primary"
          size="medium"
        >
          Lag ditt statsbudsjett
        </Button>
      </Stack>
    </Stack>
  );
};
