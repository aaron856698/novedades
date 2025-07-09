import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Completa todos los campos');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username]) {
      setError('El usuario ya existe');
      return;
    }
    users[username] = { password };
    localStorage.setItem('users', JSON.stringify(users));
    setSuccess('¡Usuario registrado! Ahora puedes iniciar sesión.');
    setError('');
    setUsername('');
    setPassword('');
    setConfirm('');
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
    >
      <Paper elevation={4} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Registro
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            fullWidth
            margin="normal"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <TextField
            label="Repetir contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          {success && <Typography color="success.main" variant="body2">{success}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Registrarse
          </Button>
        </form>
        <Typography align="center" sx={{ mt: 2 }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login">Inicia sesión</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register; 