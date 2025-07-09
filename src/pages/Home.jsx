import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ bgcolor: '#fff' }}
    >
      <Paper elevation={6} sx={{ p: 8, bgcolor: 'background.paper', minWidth: 500, textAlign: 'center', borderRadius: 4 }}>
        <Typography variant="h2" color="primary" gutterBottom sx={{ fontWeight: 900, fontSize: { xs: 40, md: 64 } }}>
          Novedades
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ fontSize: { xs: 18, md: 28 } }}>
          Tu espacio profesional para anotar y gestionar novedades de forma segura y local.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Home; 