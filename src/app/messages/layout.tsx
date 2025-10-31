'use client';

import { MessagesNav } from '@/components/messages/MessagesNav';
import { Container, Box } from '@mui/material';

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <MessagesNav />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {children}
      </Container>
    </Box>
  );
}