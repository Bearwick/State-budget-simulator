import Stack from '@mui/material/Stack';
import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  TwitterIcon,
  LinkedinIcon,
  EmailIcon,
} from 'react-share';
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
import Button from '@mui/material/Button';
import { useBudgetContext } from '../context/BudgetContext';
import { useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export const BudgetSimulatorPage = () => {
  const { data, loading, error, updated } = useBudgetContext();
  const [localData, setLocalData] = useState<typeof data | null>(null);
  const [newInntekt, setNewInntekt] = useState({ label: '', value: 0 });
  const [newUtgift, setNewUtgift] = useState({ label: '', value: 0 });
  const [newUtgiftError, setNewUtgiftError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const addNewInntekt = () => {
    if (!localData || !newInntekt.label) return;
    const newCode = `INNT.NEW_${Date.now()}`;
    const newItem = { code: newCode, label: newInntekt.label, value: newInntekt.value };
    const updatedData = [...localData, newItem];
    setLocalData(updatedData);
    localStorage.setItem('budgetSimulatorData', JSON.stringify(updatedData));
    setNewInntekt({ label: '', value: 0 });
  };

  const addNewUtgift = () => {
    if (!localData) return;
    if (!newUtgift.label.trim()) {
      setNewUtgiftError('Navn på utgift må fylles ut');
      return;
    }
    const newCode = `UTG.NEW_${Date.now()}`;
    const newItem = { code: newCode, label: newUtgift.label, value: newUtgift.value };
    const updatedData = [...localData, newItem];
    setLocalData(updatedData);
    localStorage.setItem('budgetSimulatorData', JSON.stringify(updatedData));
    setNewUtgift({ label: '', value: 0 });
    setNewUtgiftError('');
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

  const computeTotal = (rows: typeof data | null | undefined, totalCode: string) => {
    if (!rows) return 0;
    return rows
      .filter((i) => i.code !== totalCode)
      .reduce((sum, i) => {
        if (i.code.startsWith('INNT.NEW_') || i.code.startsWith('UTG.NEW_')) {
          return sum + i.value;
        } else {
          return sum + i.value * 1_000_000;
        }
      }, 0);
  };

  const totalInntekterMillioner = computeTotal(inntekter, 'INNT.IALT');
  const totalUtgifterMillioner = computeTotal(utgifter, 'UTG.IALT');
  const differenceMrd = (totalInntekterMillioner - totalUtgifterMillioner) / 1000;

  const cMillioner = localData?.find((i) => i.code === 'OF_PETROL_FOND')?.value ?? 0;
  const cMrd = cMillioner / 1000;

  const formattedDifference = differenceMrd.toLocaleString('no-NO', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const formattedC = cMrd.toLocaleString('no-NO', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <Stack spacing={6} sx={{ p: 2 }} alignItems="center">
      <Stack>
        <Typography variant="h4" gutterBottom align="center">
          Lag ditt alternative statsbudsjett
        </Typography>
        <Typography variant="body1" align="center">
          Her kan du justere inntekter og utgifter for å se hvordan forskjellige prioriteringer
          påvirker statsbudsjettet.
        </Typography>
        <Typography maxWidth={'40rem'} variant="body2" align="center" color="text.secondary">
          NB! Totalene for A og B overstiger de faktiske tallene i statsbudsjettet sett på forrige
          side på grunn av enkelte poster. Hvis du oppdager feil, vet hvilke poster som skal
          eksluderes fra summeringen, eller vil hjelpe til med å forbedre simulatoren, legg til et
          issue på{' '}
          <Link href="https://github.com/Bearwick" target="_blank" rel="noopener noreferrer">
            Github
          </Link>
          .
        </Typography>

        {error && (
          <Typography color="error">
            En feil har oppstått: kunne ikke hente statsbudsjettet
          </Typography>
        )}
      </Stack>

      {!loading && localData && (
        <Stack paddingBottom={4}>
          <Stack width="100%" maxWidth="md" justifyContent="flex-end" mb={1}>
            <Typography textAlign={'right'} color="text.secondary" variant="body2">
              Sist oppdatert: {updated ? new Date(updated).toLocaleDateString('no-NO') : 'N/A'}
            </Typography>
          </Stack>
          <Stack maxWidth="md" width="100%" alignItems="center" mb={2}>
            <Accordion sx={{ width: '100%', maxWidth: 'md' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Inntekter</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {isMobile ? (
                  <Stack>
                    {inntekter.map((item) => {
                      const isTotal = item.code === 'INNT.IALT';
                      return (
                        <Paper key={item.code} sx={{ p: 1, mb: 1, width: '100%' }}>
                          <Typography variant="subtitle2">{item.label}</Typography>
                          {isTotal ? (
                            <Typography fontWeight="bold">
                              {computeTotal(inntekter, 'INNT.IALT').toLocaleString('no-NO')} kr
                            </Typography>
                          ) : (
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              justifyContent="center"
                            >
                              {item.code.startsWith('INNT.NEW_') && (
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={() => {
                                    if (!localData) return;
                                    const updatedData = localData.filter(
                                      (i) => i.code !== item.code
                                    );
                                    setLocalData(updatedData);
                                    localStorage.setItem(
                                      'budgetSimulatorData',
                                      JSON.stringify(updatedData)
                                    );
                                  }}
                                >
                                  Slett
                                </Button>
                              )}
                              <TextField
                                type="number"
                                value={
                                  item.code.startsWith('INNT.NEW_')
                                    ? item.value
                                    : Math.round(item.value * 1_000_000)
                                }
                                onChange={(e) =>
                                  handleValueChange(
                                    item.code,
                                    item.code.startsWith('INNT.NEW_')
                                      ? Number(e.target.value)
                                      : Number(e.target.value) / 1_000_000
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
                            </Stack>
                          )}
                        </Paper>
                      );
                    })}
                  </Stack>
                ) : (
                  <TableContainer component={Paper}>
                    <Table>
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
                                  <Typography fontWeight="bold" variant="subtitle1">
                                    {computeTotal(inntekter, 'INNT.IALT').toLocaleString('no-NO')}{' '}
                                    kr
                                  </Typography>
                                ) : (
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    justifyContent="center"
                                  >
                                    {item.code.startsWith('INNT.NEW_') && (
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => {
                                          if (!localData) return;
                                          const updatedData = localData.filter(
                                            (i) => i.code !== item.code
                                          );
                                          setLocalData(updatedData);
                                          localStorage.setItem(
                                            'budgetSimulatorData',
                                            JSON.stringify(updatedData)
                                          );
                                        }}
                                      >
                                        Slett
                                      </Button>
                                    )}
                                    <TextField
                                      type="number"
                                      value={
                                        item.code.startsWith('INNT.NEW_')
                                          ? item.value
                                          : Math.round(item.value * 1_000_000)
                                      }
                                      onChange={(e) =>
                                        handleValueChange(
                                          item.code,
                                          item.code.startsWith('INNT.NEW_')
                                            ? Number(e.target.value)
                                            : Number(e.target.value) / 1_000_000
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
                                  </Stack>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" useFlexGap>
                  <TextField
                    size="small"
                    placeholder="Ny inntekt"
                    value={newInntekt.label}
                    onChange={(e) => setNewInntekt({ ...newInntekt, label: e.target.value })}
                  />
                  <TextField
                    size="small"
                    type="number"
                    placeholder="Verdi"
                    value={newInntekt.value}
                    onChange={(e) =>
                      setNewInntekt({ ...newInntekt, value: Number(e.target.value) })
                    }
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">kr</InputAdornment>,
                      },
                    }}
                  />
                  <Button variant="contained" size="small" onClick={addNewInntekt}>
                    Legg til
                  </Button>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
          <Stack maxWidth="md" width="100%" alignItems="center" mb={2}>
            <Accordion sx={{ width: '100%', maxWidth: 'md' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Utgifter</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {isMobile ? (
                  <Stack>
                    {utgifter.map((item) => {
                      const isTotal = item.code === 'UTG.IALT';
                      const isNewRow = item.code.startsWith('UTG.NEW_');
                      return (
                        <Paper key={item.code} sx={{ p: 1, mb: 1, width: '100%' }}>
                          <Typography variant="subtitle2">{item.label}</Typography>
                          {isTotal ? (
                            <Typography fontWeight="bold">
                              {computeTotal(utgifter, 'UTG.IALT').toLocaleString('no-NO')} kr
                            </Typography>
                          ) : (
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              justifyContent="center"
                            >
                              {isNewRow && (
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={() => {
                                    if (!localData) return;
                                    const updatedData = localData.filter(
                                      (i) => i.code !== item.code
                                    );
                                    setLocalData(updatedData);
                                    localStorage.setItem(
                                      'budgetSimulatorData',
                                      JSON.stringify(updatedData)
                                    );
                                  }}
                                >
                                  Slett
                                </Button>
                              )}
                              <TextField
                                type="number"
                                value={isNewRow ? item.value : Math.round(item.value * 1_000_000)}
                                onChange={(e) =>
                                  handleValueChange(
                                    item.code,
                                    isNewRow
                                      ? Number(e.target.value)
                                      : Number(e.target.value) / 1_000_000
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
                            </Stack>
                          )}
                        </Paper>
                      );
                    })}
                  </Stack>
                ) : (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableBody>
                        {utgifter.map((item) => {
                          const isTotal = item.code === 'UTG.IALT';
                          const isNewRow = item.code.startsWith('UTG.NEW_');
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
                                  <Typography fontWeight="bold" variant="subtitle1">
                                    {computeTotal(utgifter, 'UTG.IALT').toLocaleString('no-NO')} kr
                                  </Typography>
                                ) : (
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    justifyContent="flex-end"
                                  >
                                    {isNewRow && (
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => {
                                          if (!localData) return;
                                          const updatedData = localData.filter(
                                            (i) => i.code !== item.code
                                          );
                                          setLocalData(updatedData);
                                          localStorage.setItem(
                                            'budgetSimulatorData',
                                            JSON.stringify(updatedData)
                                          );
                                        }}
                                      >
                                        Slett
                                      </Button>
                                    )}
                                    <TextField
                                      type="number"
                                      value={
                                        isNewRow ? item.value : Math.round(item.value * 1_000_000)
                                      }
                                      onChange={(e) =>
                                        handleValueChange(
                                          item.code,
                                          isNewRow
                                            ? Number(e.target.value)
                                            : Number(e.target.value) / 1_000_000
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
                                  </Stack>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" useFlexGap>
                  <TextField
                    size="small"
                    placeholder="Ny utgift"
                    value={newUtgift.label}
                    onChange={(e) => setNewUtgift({ ...newUtgift, label: e.target.value })}
                    error={!!newUtgiftError}
                    helperText={newUtgiftError}
                  />
                  <TextField
                    size="small"
                    type="number"
                    placeholder="Verdi"
                    value={newUtgift.value}
                    onChange={(e) => setNewUtgift({ ...newUtgift, value: Number(e.target.value) })}
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">kr</InputAdornment>,
                      },
                    }}
                  />
                  <Button variant="contained" size="small" onClick={addNewUtgift}>
                    Legg til
                  </Button>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
          <Stack maxWidth="md" width="100%" alignItems="center" mb={2}>
            <Accordion sx={{ width: '100%', maxWidth: 'md' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Balanse og finansiering</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography textAlign={'left'}>
                  <strong>Merk:</strong> Differansen mellom inntekter (A) og utgifter (B) er
                  <strong> {formattedDifference} mrd. kr</strong>, men budsjettsaldoen (C) er
                  <strong> {formattedC} mrd. kr</strong> (uten brukerendringer).
                </Typography>
                <Typography textAlign={'left'} paddingBottom={2}>
                  Årsaken er at enkelte poster (bl.a. petroleumsinntekter og utlån) føres særskilt,
                  og ikke inngår i A og B.
                </Typography>
                {isMobile ? (
                  <Stack>
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
                        <Paper key={item.code} sx={{ p: 1, mb: 1, width: '100%' }}>
                          <Typography variant="subtitle2">{item.label}</Typography>
                          {isTotal ? (
                            <Typography fontWeight="bold">
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
                                handleValueChange(item.code, Number(e.target.value) / 1_000_000)
                              }
                              size="small"
                              slotProps={{
                                input: {
                                  endAdornment: <InputAdornment position="end">kr</InputAdornment>,
                                },
                              }}
                            />
                          )}
                        </Paper>
                      );
                    })}
                  </Stack>
                ) : (
                  <TableContainer component={Paper}>
                    <Table>
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
                )}
              </AccordionDetails>
            </Accordion>
          </Stack>
          <Stack
            mt={2}
            width="100%"
            display={'flex'}
            flexDirection={'row'}
            justifyContent="flex-end"
          >
            <Button
              sx={{ width: '10rem' }}
              variant="contained"
              color="secondary"
              onClick={resetToFetchedData}
            >
              Start på nytt
            </Button>
          </Stack>
          <Stack direction="row" spacing={2} mt={2} alignItems="center" justifyContent="center">
            <FacebookShareButton url={window.location.href}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <FacebookMessengerShareButton
              url={window.location.href}
              appId="521270401588372" //finne selv
              title={`Se mitt alternative statsbudsjett`}
            >
              <FacebookMessengerIcon size={32} round />
            </FacebookMessengerShareButton>
            <TwitterShareButton
              url={window.location.href}
              title={`Se mitt alternative statsbudsjett: Inntekter: ${totalInntekterMillioner.toLocaleString('no-NO')} kr, Utgifter: ${totalUtgifterMillioner.toLocaleString('no-NO')} kr.`}
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton
              url={window.location.href}
              title={`Mitt alternative statsbudsjett`}
              summary={`Inntekter: ${totalInntekterMillioner.toLocaleString('no-NO')} kr, Utgifter: ${totalUtgifterMillioner.toLocaleString('no-NO')} kr.`}
            >
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <EmailShareButton
              url={window.location.href}
              subject="Mitt alternative statsbudsjett"
              body={`Se mitt alternative statsbudsjett: Inntekter: ${totalInntekterMillioner.toLocaleString('no-NO')} kr, Utgifter: ${totalUtgifterMillioner.toLocaleString('no-NO')} kr.`}
            >
              <EmailIcon size={32} round />
            </EmailShareButton>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
