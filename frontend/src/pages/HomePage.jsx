import React from 'react';
import { Box, Typography } from '@mui/material';

export default function HomePage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant="h3" color="text.secondary">
        Welcome to Book Review!
      </Typography>
    </Box>
  );
}