import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link as RouterLink, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AppBar, Toolbar, Typography, Button, Box, Stack } from '@mui/material';

const Novedades = React.lazy(() => import('./pages/Novedades'));
const Eventos = React.lazy(() => import('./pages/Eventos'));
const Reclamos = React.lazy(() => import('./pages/Reclamos'));
const Reservas = React.lazy(() => import('./pages/Reservas'));

const menuItems = [
  { label: 'Novedades', path: '/novedades', color: '#43a047' },
  { label: 'Eventos', path: '/eventos', color: '#e57373' },
  { label: 'Reclamos', path: '/reclamos', color: '#ffd600', text: '#333' },
  { label: 'Reservas', path: '/reservas', color: '#ba68c8' },
];

function getSectionColor(pathname) {
  if (pathname.startsWith('/novedades')) return { bg: '#43a047', text: '#fff' };
  if (pathname.startsWith('/eventos')) return { bg: '#e57373', text: '#fff' };
  if (pathname.startsWith('/reclamos')) return { bg: '#ffd600', text: '#333' };
  if (pathname.startsWith('/reservas')) return { bg: '#ba68c8', text: '#fff' };
  return { bg: '#1976d2', text: '#fff' };
}

// Fondo animado de luces suaves
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

function App() {
  const [user, setUser] = useState(null);
  const navigate = useLocation(); // useNavigate is removed, useLocation is kept

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session'));
    if (session && session.username) {
      setUser(session.username);
    }
  }, []);

  const handleLogin = (username) => {
    setUser(username);
    // navigate('/novedades'); // This line is removed as per the edit hint
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('session');
    navigate('/login');
  };

  // Mostrar menú solo si está logueado y en una sección de registro
  const showMenu = user && ['/novedades', '/eventos', '/reclamos', '/reservas'].some(p => navigate.pathname.startsWith(p));
  const sectionColor = getSectionColor(navigate.pathname);
  const isAuthPage = navigate.pathname === '/login' || navigate.pathname === '/register';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', overflowX: 'hidden', position: 'relative' }}>
      {isAuthPage && <AnimatedBackground />}
      {!isAuthPage && (
        <AppBar position="static" elevation={2} sx={{ mb: 0, borderRadius: 0, width: '100%', bgcolor: sectionColor.bg, color: sectionColor.text, transition: 'background 0.3s' }}>
          <Toolbar sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
            <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: 1, color: sectionColor.text }}>
                Registro de eventos
              </Typography>
              {user && (
                <Button onClick={handleLogout} sx={{ fontSize: 18, fontWeight: 600, color: sectionColor.text }}>
                  Cerrar sesión
                </Button>
              )}
            </Box>
            {showMenu && (
              <Stack direction="row" spacing={2} mt={2} width="100%" justifyContent="center">
                {menuItems.map(item => (
                  <Button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    variant={navigate.pathname.startsWith(item.path) ? 'contained' : 'outlined'}
                    sx={{
                      fontWeight: 700,
                      fontSize: 18,
                      bgcolor: navigate.pathname.startsWith(item.path) ? item.color : 'transparent',
                      color: navigate.pathname.startsWith(item.path) ? (item.text || '#fff') : (item.color || sectionColor.bg),
                      borderColor: item.color,
                      '&:hover': {
                        bgcolor: item.color,
                        color: item.text || '#fff',
                        borderColor: item.color,
                        opacity: 0.9,
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
            )}
          </Toolbar>
        </AppBar>
      )}
      <React.Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          {/* Redirigir la raíz al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/novedades"
            element={
              <ProtectedRoute>
                <Novedades user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/eventos"
            element={
              <ProtectedRoute>
                <Eventos user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reclamos"
            element={
              <ProtectedRoute>
                <Reclamos user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservas"
            element={
              <ProtectedRoute>
                <Reservas user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </React.Suspense>
    </Box>
  );
}

export default App;
