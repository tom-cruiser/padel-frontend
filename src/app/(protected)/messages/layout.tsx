'use client';

import { Container, Box } from '@mui/material';
import Footer from '@/components/Footer';

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="xl" sx={{ mt: 4, flex: 1 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
}
