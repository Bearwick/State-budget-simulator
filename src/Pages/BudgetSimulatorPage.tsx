import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useBudgetContext } from '../context/BudgetContext';
import { useEffect, useState } from 'react';

export const BudgetSimulatorPage = () => {
  const { data, loading, error } = useBudgetContext();
  const [localData, setLocalData] = useState<typeof data | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('budgetSimulatorData');
    if (storedData) {
      setLocalData(JSON.parse(storedData));
    } else if (data) {
      setLocalData(data);
    }
  }, [data]);

  const handleValueChange = (code: string, newValue: number) => {
    if (!localData) return;
    const newData = localData.map((item) =>
      item.code === code ? { ...item, value: newValue } : item
    );
    setLocalData(newData);
    localStorage.setItem('budgetSimulatorData', JSON.stringify(newData));
  };

  const resetToFetchedData = () => {
    if (data) {
      setLocalData(data);
      localStorage.removeItem('budgetSimulatorData');
    }
  };

  const inntekter = localData?.filter((item) => item.code.startsWith('INNT')) || [];
  const utgifter = localData?.filter((item) => item.code.startsWith('UTG')) || [];
  const balanse =
    localData?.filter((item) => !item.code.startsWith('INNT') && !item.code.startsWith('UTG')) ||
    [];

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Stack spacing={2} sx={{ p: 2 }} alignItems="center">
        <Typography variant="h4" gutterBottom align="center">
          Lag ditt alternative statsbudsjett
        </Typography>
        <Typography variant="body1" align="center">
          Her kan du endre på de inntektene og utgiftene du tenker trenger mer eller mindre penger.
        </Typography>

        {error && (
          <Typography color="error">
            En feil har oppstått: kunne ikke hente statsbudsjettet
          </Typography>
        )}

        {!loading && localData && (
          <>
            <Stack maxWidth="md" width="100%" alignItems="center" mb={2}>
              <Accordion sx={{ width: '100%', maxWidth: 'md' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Inntekter</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableBody>
                        {inntekter.map((item) => {
                          const isTotal = item.code === 'INNT.IALT';
                          return (
                            <TableRow key={item.code}>
                              <TableCell>
                                {isTotal ? (
                                  <Typography fontWeight="bold" variant="subtitle1">
                                    {item.label}
                                  </Typography>
                                ) : (
                                  item.label
                                )}
                              </TableCell>
                              <TableCell align="right">
                                {isTotal ? (
                                  <Typography
                                    fontWeight="bold"
                                    variant="subtitle1"
                                    paddingRight={1.75}
                                  >
                                    {Math.round(
                                      inntekter
                                        .filter((i) => i.code !== 'INNT.IALT')
                                        .reduce((sum, i) => sum + i.value, 0) * 1_000_000
                                    ).toLocaleString('no-NO')}{' '}
                                    kr
                                  </Typography>
                                ) : (
                                  <TextField
                                    type="number"
                                    value={Math.round(item.value * 1_000_000)}
                                    onChange={(e) =>
                                      handleValueChange(
                                        item.code,
                                        Number(e.target.value) / 1_000_000
                                      )
                                    }
                                    size="small"
                                    slotProps={{
                                      input: {
                                        endAdornment: (
                                          <InputAdornment position="end">kr</InputAdornment>
                                        ),
                                      },
                                    }}
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
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
                    <Table size="small">
                      <TableBody>
                        {utgifter.map((item) => {
                          const isTotal = item.code === 'UTG.IALT';
                          return (
                            <TableRow key={item.code}>
                              <TableCell>
                                {isTotal ? (
                                  <Typography fontWeight="bold" variant="subtitle1">
                                    {item.label}
                                  </Typography>
                                ) : (
                                  item.label
                                )}
                              </TableCell>
                              <TableCell align="right">
                                {isTotal ? (
                                  <Typography
                                    fontWeight="bold"
                                    variant="subtitle1"
                                    paddingRight={1.75}
                                  >
                                    {Math.round(
                                      utgifter
                                        .filter((i) => i.code !== 'UTG.IALT')
                                        .reduce((sum, i) => sum + i.value, 0) * 1_000_000
                                    ).toLocaleString('no-NO')}{' '}
                                    kr
                                  </Typography>
                                ) : (
                                  <TextField
                                    type="number"
                                    value={Math.round(item.value * 1_000_000)}
                                    onChange={(e) =>
                                      handleValueChange(
                                        item.code,
                                        Number(e.target.value) / 1_000_000
                                      )
                                    }
                                    size="small"
                                    slotProps={{
                                      input: {
                                        endAdornment: (
                                          <InputAdornment position="end">kr</InputAdornment>
                                        ),
                                      },
                                    }}
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
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
                    <Table size="small">
                      <TableBody>
                        {balanse.map((item) => {
                          const isTotal = item.code === 'OFL' || item.code === 'FIN_BEHOV';

                          const C = localData?.find((i) => i.code === 'OF_PETROL_FOND');
                          const D = localData?.find((i) => i.code === 'PETROL_FOND');
                          const F = localData?.find((i) => i.code === 'UTLAN');
                          const G = localData?.find((i) => i.code === 'AVDRAG');

                          const computedE = C && D ? C.value - D.value : null;

                          let displayValue: number | null = null;

                          if (item.code === 'OFL' && computedE !== null) {
                            displayValue = computedE * 1_000_000;
                          } else if (item.code === 'FIN_BEHOV' && F && G && computedE !== null) {
                            displayValue = (F.value + G.value - computedE) * 1_000_000;
                          }

                          return (
                            <TableRow key={item.code}>
                              <TableCell>
                                {isTotal ? <Typography>{item.label}</Typography> : item.label}
                              </TableCell>
                              <TableCell align={'right'}>
                                {isTotal ? (
                                  <Typography paddingRight={1.75}>
                                    {(displayValue !== null
                                      ? Math.round(displayValue)
                                      : Math.round(item.value * 1_000_000)
                                    ).toLocaleString('no-NO')}{' '}
                                    kr
                                  </Typography>
                                ) : (
                                  <TextField
                                    type="number"
                                    value={Math.round(item.value * 1_000_000)}
                                    onChange={(e) =>
                                      handleValueChange(
                                        item.code,
                                        Number(e.target.value) / 1_000_000
                                      )
                                    }
                                    size="small"
                                    slotProps={{
                                      input: {
                                        endAdornment: (
                                          <InputAdornment position="end">kr</InputAdornment>
                                        ),
                                      },
                                    }}
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            </Stack>
            <Stack alignItems="center" mt={2}>
              <Button variant="contained" color="secondary" onClick={resetToFetchedData}>
                Start på nytt
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  );
};
