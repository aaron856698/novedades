import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedBackground = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        width: 800,
        height: 800,
        top: '-200px',
        left: '-200px',
        background: 'radial-gradient(circle at 30% 30%, #b388ff 0%, transparent 70%)',
        filter: 'blur(80px)',
        animation: 'move1 12s linear infinite alternate',
        '@keyframes move1': {
          '0%': { left: '-200px', top: '-200px' },
          '100%': { left: '60vw', top: '40vh' },
        },
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        width: 600,
        height: 600,
        bottom: '-150px',
        right: '-150px',
        background: 'radial-gradient(circle at 70% 70%, #81d4fa 0%, transparent 70%)',
        filter: 'blur(80px)',
        animation: 'move2 14s linear infinite alternate',
        '@keyframes move2': {
          '0%': { right: '-150px', bottom: '-150px' },
          '100%': { right: '50vw', bottom: '30vh' },
        },
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        width: 500,
        height: 500,
        top: '60vh',
        left: '60vw',
        background: 'radial-gradient(circle at 80% 20%, #ffd600 0%, transparent 70%)',
        filter: 'blur(80px)',
        animation: 'move3 16s linear infinite alternate',
        '@keyframes move3': {
          '0%': { left: '60vw', top: '60vh' },
          '100%': { left: '10vw', top: '10vh' },
        },
      }}
    />
  </Box>
);

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username] && users[username].password === password) {
      localStorage.setItem('session', JSON.stringify({ username }));
      
      // SweetAlert2 personalizado para login exitoso
      Swal.fire({
        title: '¡Bienvenido!',
        text: `Hola ${username}, has iniciado sesión correctamente`,
        icon: 'success',
        background: '#f8fff5',
        color: '#43a047',
        confirmButtonColor: '#43a047',
        confirmButtonText: 'Continuar',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        customClass: {
          title: 'swal2-title-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      }).then(() => {
        onLogin(username);
      });
    } else {
      // SweetAlert2 para error de login
      Swal.fire({
        title: 'Error de autenticación',
        text: 'Usuario o contraseña incorrectos',
        icon: 'error',
        background: '#fff6f6',
        color: '#e57373',
        confirmButtonColor: '#e57373',
        confirmButtonText: 'Intentar de nuevo'
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'transparent',
      }}
    >
      <AnimatedBackground />
      <Paper
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        elevation={10}
        sx={{
          p: { xs: 3, md: 8 },
          borderRadius: 6,
          minWidth: { xs: '95vw', sm: 420, md: 500 },
          maxWidth: 520,
          width: '100%',
          boxShadow: '0 12px 48px 0 rgba(60,60,60,0.13)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 1,
          backdropFilter: 'blur(2px)',
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 900,
            fontFamily: 'Montserrat, Roboto, Arial',
            color: '#5f4bb6',
            mb: 3,
            letterSpacing: 1,
          }}
        >
          Iniciar sesión
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Usuario"
            fullWidth
            margin="normal"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            sx={{
              bgcolor: '#f5f7fa',
              borderRadius: 2,
              input: { fontSize: 20 },
              mb: 2,
            }}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            sx={{
              bgcolor: '#f5f7fa',
              borderRadius: 2,
              input: { fontSize: 20 },
              mb: 2,
            }}
          />
          <Button
            type="submit"
            fullWidth
            sx={{
              mt: 3,
              mb: 2,
              py: 1.7,
              fontWeight: 700,
              fontSize: 20,
              borderRadius: 3,
              background: 'linear-gradient(90deg, #5f4bb6 0%, #6a82fb 100%)',
              color: '#fff',
              boxShadow: '0 4px 16px 0 rgba(60,60,60,0.10)',
              transition: 'background 0.2s',
              '&:hover': {
                background: 'linear-gradient(90deg, #6a82fb 0%, #5f4bb6 100%)',
                opacity: 0.95,
              },
            }}
          >
            ENTRAR
          </Button>
        </form>
        <Typography align="center" sx={{ mt: 2, fontSize: 18 }}>
          ¿No tienes cuenta?{' '}
          <Link href="/register" sx={{ color: '#5f4bb6', fontWeight: 700 }}>
            Regístrate
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login; 