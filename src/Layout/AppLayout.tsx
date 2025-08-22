import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import { AppBarHeader } from './AppBar';
import { Footer } from './Footer';
import Stack from '@mui/material/Stack';

export const AppLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <AppBarHeader />
      <Stack flexGrow={1} sx={{ mt: '4rem' }}>
        <Outlet />
      </Stack>
      <Footer />
    </Box>
  );
};
