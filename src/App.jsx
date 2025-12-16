import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AppBar, Toolbar, Typography, Button, Box, Stack, TextField, InputAdornment } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Swal from 'sweetalert2';

const Novedades = React.lazy(() => import('./pages/Novedades'));
const Eventos = React.lazy(() => import('./pages/Eventos'));
const Reclamos = React.lazy(() => import('./pages/Reclamos'));
const Paqueteria = React.lazy(() => import('./pages/Paqueteria'));

const menuItems = [
  { label: 'Novedades', path: '/novedades', color: '#4caf50', text: '#fff' },
  { label: 'Eventos', path: '/eventos', color: '#e57373' },
  { label: 'Reclamos', path: '/reclamos', color: '#ffd600', text: '#333' },
  { label: 'Paquetería', path: '/paqueteria', color: '#4caf50', text: '#fff' },
];

function getSectionColor(pathname) {
  if (pathname.startsWith('/novedades')) return { bg: '#4caf50', text: '#fff' };
  if (pathname.startsWith('/eventos')) return { bg: '#e57373', text: '#fff' };
  if (pathname.startsWith('/reclamos')) return { bg: '#ffd600', text: '#333' };
  if (pathname.startsWith('/paqueteria')) return { bg: '#4caf50', text: '#fff' };
  return { bg: '#1976d2', text: '#fff' };
}

function getSectionTitle(pathname) {
  if (pathname.startsWith('/novedades')) return 'Novedades';
  if (pathname.startsWith('/eventos')) return 'Registro de eventos';
  if (pathname.startsWith('/reclamos')) return 'Registro de reclamos';
  if (pathname.startsWith('/paqueteria')) return 'Gestión de paquetería';
  return 'Registro';
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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session'));
    if (session && session.username) {
      setUser(session.username);
    }
  }, []);

  // Escuchar evento para limpiar filtro de fecha
  useEffect(() => {
    const handleLimpiarFiltro = (event) => {
      setSearchDate('');
      setSearchUser('');
      setSearchPropietario('');
    };
    
    window.addEventListener('limpiarFiltroFecha', handleLimpiarFiltro);
    
    return () => {
      window.removeEventListener('limpiarFiltroFecha', handleLimpiarFiltro);
    };
  }, []);

  const handleLogin = (username) => {
    setUser(username);
    navigate('/novedades');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('session');
    navigate('/login');
  };

  // Filtros globales para las páginas de registro
  const [searchDate, setSearchDate] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [searchPropietario, setSearchPropietario] = useState('');
  // Para mostrar snackbar de copiado
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Función para copiar novedades del día (se pasa como prop)
  const handleCopyDay = (novedades, showSearchUser) => {
    const fechaCopia = searchDate || new Date().toISOString().slice(0, 10);
    const turnosOrden = ['Mañana', 'Tarde', 'Noche'];
    const novedadesDia = novedades
      .filter(item => item.fecha === fechaCopia)
      .sort((a, b) => turnosOrden.indexOf(a.turno) - turnosOrden.indexOf(b.turno));
    let texto = `Fecha: ${fechaCopia}\n`;
    let html = `<b>Fecha: ${fechaCopia}</b><br/>`;
    const cleanTags = (str) => str ? str.replace(/\[(yellow|green|blue|orange|pink)\](.*?)\[\/\1\]/g, '$2') : '';
    const parseHighlight = (str) => str ? str.replace(/\[(yellow|green|blue|orange|pink)\](.*?)\[\/\1\]/g, (match, tag, content) => {
      const colorMap = { yellow: '#fff59d', green: '#a5d6a7', blue: '#81d4fa', orange: '#ffcc80', pink: '#f8bbd0' };
      const color = colorMap[tag] || '#fff59d';
      return `<span style=\\"background:${color};padding:2px 4px;border-radius:3px\\">${content}</span>`;
    }) : '';
    turnosOrden.forEach(turno => {
      const nov = novedadesDia.find(n => n.turno === turno);
      if (nov) {
        const novedadTxt = cleanTags(nov.novedadHtml || nov.novedad || '');
        const novedadHtml = parseHighlight(nov.novedadHtml || nov.novedad || '');
        texto += `${turno} - Cubre: ${nov.conserje ? nov.conserje.charAt(0).toUpperCase() + nov.conserje.slice(1) : '-'}: ${novedadTxt}\n`;
        html += `<b>${turno}</b> - Cubre: <b>${nov.conserje ? nov.conserje.charAt(0).toUpperCase() + nov.conserje.slice(1) : '-'}</b>: ${novedadHtml}`;
        if (nov.file && typeof nov.file === 'string' && nov.file.startsWith('data:image')) {
          html += `<br/><img src=\\"${nov.file}\\" alt=\\"adjunto\\" style=\\"max-width:300px;display:block;margin:10px 0;border-radius:8px;box-shadow:0 2px 8px 0 rgba(60,60,60,0.10);\\" />`;
        }
        html += '<br/>';
      } else {
        texto += `${turno} - Cubre: -: (sin novedad)\n`;
        html += `<b>${turno}</b> - Cubre: <b>-</b>: (sin novedad)<br/>`;
      }
    });
    if (navigator.clipboard && window.ClipboardItem) {
      const blobHtml = new Blob([html.trim()], { type: 'text/html' });
      const blobText = new Blob([texto.trim()], { type: 'text/plain' });
      navigator.clipboard.write([
        new window.ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText
        })
      ]).then(() => {
        setSnackbar({ open: true, message: '¡Novedades copiadas con color!', severity: 'success' });
      }, () => {
        setSnackbar({ open: true, message: 'No se pudo copiar en formato enriquecido', severity: 'warning' });
      });
    } else {
      navigator.clipboard.writeText(texto.trim());
      setSnackbar({ open: true, message: '¡Novedades copiadas!', severity: 'success' });
    }
  };

  // Mostrar menú solo si está logueado y en una sección de registro
  const showMenu = user && ['/novedades', '/eventos', '/reclamos', '/paqueteria'].some(p => location.pathname.startsWith(p));
  const sectionColor = getSectionColor(location.pathname);
  const sectionTitle = getSectionTitle(location.pathname);
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', overflowX: 'hidden', position: 'relative', pt: !isAuthPage ? '200px' : 0 }}>
      {isAuthPage && <AnimatedBackground />}
      {!isAuthPage && (
        <AppBar position="fixed" elevation={2} sx={{ mb: 0, borderRadius: 0, width: '100%', bgcolor: sectionColor.bg, color: sectionColor.text, transition: 'background 0.3s', zIndex: 1200 }}>
          <Toolbar sx={{ flexDirection: 'column', alignItems: 'stretch', py: 2, px: { xs: 1, md: 4 }, minHeight: 0 }}>
            {/* Fila superior: filtro a la izquierda, menú y cerrar sesión a la derecha */}
            <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              {/* Filtro a la izquierda */}
              {showMenu && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    justifyContent: 'flex-start',
                    gap: { xs: 2, sm: 2.5 },
                    bgcolor: 'rgba(255,255,255,0.97)',
                    boxShadow: '0 2px 16px 0 rgba(60,60,60,0.10)',
                    borderRadius: 4,
                    px: { xs: 2, sm: 4 },
                    py: { xs: 2, sm: 1.5 },
                    minHeight: 56,
                    maxWidth: 600,
                  }}
                >
                  <TextField
                    size="small"
                    label="Filtrar por fecha"
                    type="date"
                    value={searchDate}
                    onChange={e => setSearchDate(e.target.value)}
                    InputLabelProps={{ shrink: true, sx: { fontSize: 15, color: '#388e3c', fontWeight: 500, letterSpacing: 0.2 } }}
                    sx={{
                      bgcolor: '#f7faf7',
                      borderRadius: 2.5,
                      minWidth: 120,
                      maxWidth: 160,
                      border: '1.5px solid #e0e0e0',
                      boxShadow: '0 1px 4px 0 rgba(67,160,71,0.04)',
                      '& .MuiInputBase-root': { fontSize: 15, height: 40 },
                      '& .MuiInputLabel-root': { fontSize: 15 },
                      '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#43a047', boxShadow: '0 0 0 2px #43a04722' },
                    }}
                    inputProps={{ style: { fontSize: 15, height: 40, padding: '10px 12px' } }}
                  />
                  {location.pathname.startsWith('/novedades') || location.pathname.startsWith('/reclamos') ? (
                    <TextField
                      size="small"
                      label="Buscar por usuario"
                      value={searchUser}
                      onChange={e => setSearchUser(e.target.value)}
                      InputLabelProps={{ sx: { fontSize: 15, color: '#388e3c', fontWeight: 500, letterSpacing: 0.2 } }}
                      sx={{
                        bgcolor: '#f7faf7',
                        borderRadius: 2.5,
                        minWidth: 120,
                        maxWidth: 160,
                        border: '1.5px solid #e0e0e0',
                        boxShadow: '0 1px 4px 0 rgba(67,160,71,0.04)',
                        '& .MuiInputBase-root': { fontSize: 15, height: 40 },
                        '& .MuiInputLabel-root': { fontSize: 15 },
                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#43a047', boxShadow: '0 0 0 2px #43a04722' },
                      }}
                      inputProps={{ style: { fontSize: 15, height: 40, padding: '10px 12px' } }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ mr: 0.5, color: sectionColor.bg, fontSize: 20 }} /></InputAdornment>,
                        style: { fontSize: 15 },
                      }}
                    />
                  ) : (
                    <TextField
                      size="small"
                      label={location.pathname.startsWith('/paqueteria') ? 'Buscar por destinatario' : 'Buscar por propietario'}
                      value={searchPropietario}
                      onChange={e => setSearchPropietario(e.target.value)}
                      InputLabelProps={{ sx: { fontSize: 15, color: '#388e3c', fontWeight: 500, letterSpacing: 0.2 } }}
                      sx={{
                        bgcolor: '#f7faf7',
                        borderRadius: 2.5,
                        minWidth: 120,
                        maxWidth: 160,
                        border: '1.5px solid #e0e0e0',
                        boxShadow: '0 1px 4px 0 rgba(67,160,71,0.04)',
                        '& .MuiInputBase-root': { fontSize: 15, height: 40 },
                        '& .MuiInputLabel-root': { fontSize: 15 },
                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#43a047', boxShadow: '0 0 0 2px #43a04722' },
                      }}
                      inputProps={{ style: { fontSize: 15, height: 40, padding: '10px 12px' } }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ mr: 0.5, color: sectionColor.bg, fontSize: 20 }} /></InputAdornment>,
                        style: { fontSize: 15 },
                      }}
                    />
                  )}
                  <Button
                    variant="contained"
                    startIcon={<ContentCopyIcon sx={{ fontSize: 20 }} />}
                    onClick={() => window.dispatchEvent(new CustomEvent('copyNovedadesDelDia'))}
                    sx={{
                      fontWeight: 600,
                      fontSize: 15,
                      borderRadius: 2.5,
                      bgcolor: sectionColor.bg,
                      color: sectionColor.text,
                      boxShadow: '0 1px 4px 0 rgba(67,160,71,0.08)',
                      px: 3,
                      py: 1.1,
                      minWidth: 150,
                      height: 40,
                      '&:hover': { bgcolor: sectionColor.bg, opacity: 0.93 },
                      transition: 'box-shadow 0.2s',
                    }}
                  >
                    Novedades
                  </Button>
                  {(searchDate || searchUser || searchPropietario) && (
                    <Button
                      variant="outlined"
                      startIcon={<ClearIcon sx={{ fontSize: 18 }} />}
                      onClick={() => {
                        setSearchDate('');
                        setSearchUser('');
                        setSearchPropietario('');
                        Swal.fire({
                          title: 'Filtro limpiado',
                          text: 'Se han limpiado todos los filtros',
                          icon: 'info',
                          background: '#f3f8ff',
                          color: '#2196f3',
                          confirmButtonColor: '#2196f3',
                          confirmButtonText: 'Entendido',
                          timer: 1500,
                          timerProgressBar: true
                        });
                      }}
                      sx={{
                        fontWeight: 600,
                        fontSize: 14,
                        borderRadius: 2.5,
                        borderColor: '#ff9800',
                        color: '#ff9800',
                        px: 2,
                        py: 1.1,
                        minWidth: 120,
                        height: 40,
                        '&:hover': { 
                          borderColor: '#f57c00', 
                          color: '#f57c00',
                          bgcolor: '#fff3e0'
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </Box>
              )}
              {/* Menú y cerrar sesión a la derecha */}
              <Box display="flex" alignItems="center" gap={2}>
                {showMenu && (
                  <Stack direction="row" spacing={2} flex={0} justifyContent="flex-end" alignItems="center">
                    {menuItems.map(item => (
                      <Button
                        key={item.path}
                        component={RouterLink}
                        to={item.path}
                        variant="contained"
                        sx={{
                          fontWeight: 700,
                          fontSize: 18,
                          bgcolor: item.color,
                          color: item.text || '#fff',
                          borderColor: item.color,
                          boxShadow: '0 1px 6px 0 rgba(60,60,60,0.07)',
                          minWidth: 120,
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          transition: 'background 0.2s',
                          opacity: location.pathname.startsWith(item.path) ? 1 : 0.85,
                          '&:hover': {
                            bgcolor: item.color,
                            color: item.text || '#fff',
                            opacity: 1,
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                    <Button
                      variant="contained"
                      onClick={() => window.dispatchEvent(new CustomEvent('exportarDatos'))}
                      sx={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#fff',
                        bgcolor: '#7e57c2', // violeta
                        px: 2.5,
                        py: 0.8,
                        borderRadius: 2,
                        boxShadow: '0 2px 10px 0 rgba(126,87,194,0.35)',
                        '&:hover': { bgcolor: '#6a44b0' }
                      }}
                    >
                      Exportar
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => window.dispatchEvent(new CustomEvent('importarDatos'))}
                      sx={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#fff',
                        bgcolor: '#8bc34a', // verde manzana
                        px: 2.5,
                        py: 0.8,
                        borderRadius: 2,
                        boxShadow: '0 2px 10px 0 rgba(139,195,74,0.35)',
                        '&:hover': { bgcolor: '#7cb342' }
                      }}
                    >
                      Importar
                    </Button>
                  </Stack>
                )}
                {user && (
                  <Button onClick={handleLogout} sx={{ fontSize: 18, fontWeight: 600, color: sectionColor.text, px: 2, py: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.10)', ml: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' } }}>
                    Cerrar sesión
                  </Button>
                )}
              </Box>
            </Box>
            {/* Título debajo, centrado */}
            <Box width="100%" display="flex" justifyContent="center" alignItems="center" mb={2} mt={1}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  letterSpacing: 1,
                  color: sectionColor.text,
                  textAlign: 'center',
                  textDecoration: location.pathname.startsWith('/novedades') ? 'underline' : 'none',
                  textDecorationThickness: location.pathname.startsWith('/novedades') ? '0.14em' : undefined,
                  textUnderlineOffset: location.pathname.startsWith('/novedades') ? 6 : undefined,
                }}
              >
                {sectionTitle}
              </Typography>
            </Box>
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
                <Novedades
                  user={user}
                  onLogout={handleLogout}
                  searchDate={searchDate}
                  searchUser={searchUser}
                  handleCopyDay={handleCopyDay}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/eventos"
            element={
              <ProtectedRoute>
                <Eventos
                  user={user}
                  onLogout={handleLogout}
                  searchDate={searchDate}
                  searchPropietario={searchPropietario}
                  handleCopyDay={handleCopyDay}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reclamos"
            element={
              <ProtectedRoute>
                <Reclamos
                  user={user}
                  onLogout={handleLogout}
                  searchDate={searchDate}
                  searchUser={searchUser}
                  handleCopyDay={handleCopyDay}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/paqueteria"
            element={
              <ProtectedRoute>
                <Paqueteria
                  user={user}
                  onLogout={handleLogout}
                  searchDate={searchDate}
                  searchPropietario={searchPropietario}
                  handleCopyDay={handleCopyDay}
                />
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
