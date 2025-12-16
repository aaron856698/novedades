import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Link, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const u = (username || '').trim();
    const normKey = (s) => (s || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
    const p1 = (password || '').trim();
    const p2 = (confirm || '').trim();
    if (!u || !p1) {
      setError('Completa todos los campos');
      return;
    }
    if (p1 !== p2) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      let users = JSON.parse(localStorage.getItem('users') || '{}');
      if (!users || typeof users !== 'object' || Array.isArray(users)) { users = {}; }
      const keyNormalized = normKey(u);
      const exists = Object.keys(users).some(k => normKey(k) === keyNormalized);
      if (exists) {
        setError('El usuario ya existe');
        return;
      }
      users[keyNormalized] = { password: p1 };
      localStorage.setItem('users', JSON.stringify(users));
      setSuccess('¡Usuario registrado! Ahora puedes iniciar sesión.');
      setError('');
      setUsername('');
      setPassword('');
      setConfirm('');
      if (typeof Swal !== 'undefined') {
        if (document.activeElement) { try { document.activeElement.blur(); } catch (_) {} }
        Swal.fire({
          title: 'Usuario registrado',
          text: 'Ahora puedes iniciar sesión',
          icon: 'success',
          background: '#f8fff5',
          color: '#43a047',
          confirmButtonColor: '#43a047',
          confirmButtonText: 'Ir a iniciar sesión',
          focusConfirm: true,
          didOpen: (popup) => { try { popup.focus(); } catch (_) {} }
        }).then(() => {
          navigate('/login');
        });
      } else {
        navigate('/login');
      }
    } catch (e) {
      setError('No se pudo guardar el usuario en este navegador');
      if (typeof Swal !== 'undefined') {
        if (document.activeElement) { try { document.activeElement.blur(); } catch (_) {} }
        Swal.fire({
          title: 'Error al registrar',
          text: 'No se pudo guardar el usuario. Revisa permisos de almacenamiento.',
          icon: 'error',
          background: '#fff6f6',
          color: '#e57373',
          confirmButtonColor: '#e57373',
          confirmButtonText: 'Entendido',
          focusConfirm: true,
          didOpen: (popup) => { try { popup.focus(); } catch (_) {} }
        });
      }
    }
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
