import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, TextField, Paper, IconButton, List, ListItem, ListItemText, MenuItem, Select, InputLabel, FormControl, Divider, Stack, InputAdornment, useTheme, Chip, Snackbar, Alert, Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const turnos = ["Mañana", "Tarde", "Noche"];
const conserjes = ["aaron", "maria", "lisa", "martin", "sebastian", "guardia"];
const turnoColors = { "Mañana": '#81d4fa', "Tarde": '#ffd54f', "Noche": '#9575cd' };
const conserjeColors = { aaron: '#43a047', maria: '#e57373', lisa: '#ba68c8', martin: '#ffd600', sebastian: '#00bcd4', guardia: '#8d6e63' };

const sectionStyles = {
  primary: {
    main: '#43a047', bg: '#f8fff5', icon: <AnnouncementIcon fontSize="large" sx={{ color: '#43a047', mr: 1 }} />,
  },
  secondary: {
    main: '#e57373', bg: '#fff6f6', icon: <EventNoteIcon fontSize="large" sx={{ color: '#e57373', mr: 1 }} />,
  },
  error: {
    main: '#ffd600', bg: '#fffef6', icon: <ReportProblemIcon fontSize="large" sx={{ color: '#ffd600', mr: 1 }} />,
  },
  info: {
    main: '#ba68c8', bg: '#faf6ff', icon: <BookOnlineIcon fontSize="large" sx={{ color: '#ba68c8', mr: 1 }} />,
  },
};

function migrateItem(item) {
  if (typeof item === 'string') {
    return { novedad: item, fecha: '', turno: '', conserje: '', file: null, fileName: '', user: '' };
  }
  return { ...item, file: item.file || null, fileName: item.fileName || '', user: item.user || '' };
}

const RegistroGenerico = ({ user, onLogout, storageKeyPrefix, titulo, color, extraFields }) => {
  const [novedad, setNovedad] = useState('');
  const [novedades, setNovedades] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [fecha, setFecha] = useState('');
  const [turno, setTurno] = useState('');
  const [conserje, setConserje] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [search, setSearch] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const textareaRef = useRef(null);
  const theme = useTheme();

  // Estados para campos extra
  const [extra, setExtra] = useState({});

  const section = sectionStyles[color] || sectionStyles.primary;
  const fondoGeneral = '#fffde7';

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem(`${storageKeyPrefix}${user}`) || '[]');
    data = data.map(migrateItem);
    setNovedades(data);
    if (data.some(item => typeof item !== 'string')) {
      localStorage.setItem(`${storageKeyPrefix}${user}`, JSON.stringify(data));
    }
  }, [user, storageKeyPrefix]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [novedad]);

  useEffect(() => {
    if (extraFields) {
      const initial = {};
      Object.keys(extraFields).forEach(key => {
        initial[key] = extraFields[key].value || '';
      });
      setExtra(initial);
    }
  }, [extraFields]);

  useEffect(() => {
    // Forzar overflow-x: hidden en body y html
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.width = '100vw';
    document.documentElement.style.width = '100vw';
    return () => {
      document.body.style.overflowX = '';
      document.documentElement.style.overflowX = '';
      document.body.style.width = '';
      document.documentElement.style.width = '';
    };
  }, []);

  const handleNovedadChange = (e) => {
    let value = e.target.value.replace(/,\s?/g, '\n');
    setNovedad(value);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFile(ev.target.result);
        setFileName(f.name);
      };
      reader.readAsDataURL(f);
    }
  };

  const handleExtraChange = (key, value) => {
    setExtra(prev => ({ ...prev, [key]: value }));
    if (extraFields && extraFields[key] && typeof extraFields[key].onChange === 'function') {
      extraFields[key].onChange(value);
    }
  };

  const saveNovedades = (data) => {
    setNovedades(data);
    localStorage.setItem(`${storageKeyPrefix}${user}` , JSON.stringify(data));
  };

  const handleAdd = () => {
    if (!novedad.trim() || !fecha || !turno || !conserje) return;
    // Validar campos extra si existen
    if (extraFields) {
      for (const key of Object.keys(extraFields)) {
        if (!extra[key] || extra[key].toString().trim() === '') return;
      }
    }
    const nueva = { novedad, fecha, turno, conserje, file, fileName, user, ...extra };
    if (editIndex !== null) {
      const updated = [...novedades];
      updated[editIndex] = nueva;
      saveNovedades(updated);
      setSnackbar({ open: true, message: 'Registro editado correctamente', severity: 'info' });
      setEditIndex(null);
    } else {
      saveNovedades([...novedades, nueva]);
      setSnackbar({ open: true, message: '¡Registro agregado!', severity: 'success' });
    }
    setNovedad('');
    setFecha('');
    setTurno('');
    setConserje('');
    setFile(null);
    setFileName('');
    if (extraFields) {
      const reset = {};
      Object.keys(extraFields).forEach(key => { reset[key] = ''; });
      setExtra(reset);
    }
  };

  const handleEdit = (idx) => {
    const item = novedades[idx];
    setNovedad(item.novedad);
    setFecha(item.fecha);
    setTurno(item.turno);
    setConserje(item.conserje);
    setFile(item.file || null);
    setFileName(item.fileName || '');
    setEditIndex(idx);
    if (extraFields) {
      const newExtra = {};
      Object.keys(extraFields).forEach(key => {
        newExtra[key] = item[key] || '';
      });
      setExtra(newExtra);
    }
  };

  const handleDelete = (idx) => {
    const updated = novedades.filter((_, i) => i !== idx);
    saveNovedades(updated);
    setSnackbar({ open: true, message: 'Registro eliminado', severity: 'warning' });
    setNovedad('');
    setFecha('');
    setTurno('');
    setConserje('');
    setFile(null);
    setFileName('');
    setEditIndex(null);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbar({ open: true, message: '¡Novedad copiada!', severity: 'success' });
  };

  // Filtro por texto, fecha y usuario (quién cubre)
  const novedadesFiltradas = novedades.filter(item => {
    if (!item || typeof item !== 'object') return false;
    const matchTexto = search.trim() === '' || item.novedad.toLowerCase().includes(search.toLowerCase());
    const matchFecha = searchDate === '' || item.fecha === searchDate;
    const matchUser = searchUser.trim() === '' || (item.conserje && item.conserje.toLowerCase().includes(searchUser.toLowerCase()));
    return matchTexto && matchFecha && matchUser;
  });

  return (
    <Box sx={{ bgcolor: fondoGeneral, minHeight: '100vh', transition: 'background 0.3s', overflowX: 'hidden', width: '100vw', maxWidth: '100vw', p: 0, m: 0 }}>
      <Snackbar open={snackbar.open} autoHideDuration={2500} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ fontSize: 18 }}>{snackbar.message}</Alert>
      </Snackbar>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'stretch', md: 'stretch' }}
        justifyContent="center"
        width="100vw"
        minHeight="calc(100vh - 64px)"
        maxWidth="100vw"
        px={{ xs: 1, md: 4 }}
        py={4}
        gap={4}
        sx={{ boxSizing: 'border-box', overflowX: 'hidden', width: '100vw', maxWidth: '100vw', p: 0, m: 0 }}
      >
        {/* Formulario */}
        <Paper
          component={motion.div}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          elevation={8}
          sx={{
            p: 6,
            minWidth: { xs: '100%', md: 340 },
            maxWidth: 420,
            width: { xs: '100%', md: 400 },
            borderRadius: 5,
            height: { md: '100%' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            position: { md: 'sticky' },
            top: { md: 32 },
            alignSelf: { md: 'flex-start' },
            boxSizing: 'border-box',
            bgcolor: section.bg,
            boxShadow: '0 8px 32px 0 rgba(60,60,60,0.10)',
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            {section.icon}
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 900, color: section.main, fontFamily: 'Montserrat, Roboto, Arial', letterSpacing: 1 }}>
              Agregar {titulo.slice(0, -1).toLowerCase()}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Campos extra personalizados */}
            {extraFields && Object.entries(extraFields).map(([key, field]) => (
              field.options ? (
                <FormControl fullWidth key={key}>
                  <InputLabel id={`${key}-label`}>{field.label}</InputLabel>
                  <Select
                    labelId={`${key}-label`}
                    value={extra[key] || ''}
                    label={field.label}
                    onChange={e => handleExtraChange(key, e.target.value)}
                    inputProps={{ style: { fontSize: 18 } }}
                    sx={field.selectProps?.sx}
                    MenuProps={field.selectProps?.MenuProps}
                  >
                    {field.options.map(opt => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  key={key}
                  label={field.label}
                  fullWidth
                  value={extra[key] || ''}
                  onChange={e => handleExtraChange(key, e.target.value)}
                  inputProps={{ style: { fontSize: 18 } }}
                  sx={{ bgcolor: '#fff', borderRadius: 2 }}
                />
              )
            ))}
            <TextField
              label={titulo.slice(0, -1)}
              fullWidth
              value={novedad}
              onChange={handleNovedadChange}
              autoFocus
              inputProps={{ style: { fontSize: 20, minHeight: 60, lineHeight: 1.4 }, ref: textareaRef, as: 'textarea', rows: 2 }}
              multiline
              minRows={2}
              maxRows={8}
              sx={{
                bgcolor: '#fff',
                borderRadius: 2,
                fontFamily: 'inherit',
                fontWeight: 500,
                boxShadow: '0 2px 8px 0 rgba(60,60,60,0.04)',
                transition: 'box-shadow 0.2s',
                '&:focus-within': { boxShadow: `0 0 0 2px ${section.main}33` },
              }}
            />
            <TextField
              label="Fecha"
              type="date"
              fullWidth
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ style: { fontSize: 18 } }}
              sx={{ bgcolor: '#fff', borderRadius: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel id="turno-label">Turno</InputLabel>
              <Select
                labelId="turno-label"
                value={turno}
                label="Turno"
                onChange={e => setTurno(e.target.value)}
                inputProps={{ style: { fontSize: 18 } }}
                sx={{ bgcolor: '#fff', borderRadius: 2 }}
              >
                {turnos.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="conserje-label">Quién cubre</InputLabel>
              <Select
                labelId="conserje-label"
                value={conserje}
                label="Quién cubre"
                onChange={e => setConserje(e.target.value)}
                inputProps={{ style: { fontSize: 18 } }}
                sx={{ bgcolor: '#fff', borderRadius: 2 }}
              >
                {conserjes.map(c => <MenuItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</MenuItem>)}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color={color || 'primary'}
              size="large"
              onClick={handleAdd}
              sx={{
                fontSize: 20,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 700,
                bgcolor: section.main,
                boxShadow: '0 0 0 0 rgba(67,160,71,0.7)',
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%': { boxShadow: '0 0 0 0 rgba(67,160,71,0.7)' },
                  '70%': { boxShadow: '0 0 0 12px rgba(67,160,71,0)' },
                  '100%': { boxShadow: '0 0 0 0 rgba(67,160,71,0)' },
                },
                '&:hover': { bgcolor: section.main, opacity: 0.9 },
              }}
            >
              {editIndex !== null ? 'Guardar' : 'Agregar'}
            </Button>
            <Box mt={1} display="flex" alignItems="center" gap={1}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<AttachFileIcon />}
                sx={{ borderRadius: 2, fontWeight: 600 }}
              >
                Adjuntar archivo
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {fileName && <Typography variant="body2" color="text.secondary">{fileName}</Typography>}
            </Box>
          </Box>
        </Paper>
        {/* Lista de novedades */}
        <Paper
          component={motion.div}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          elevation={8}
          sx={{
            p: 4,
            flex: 1,
            minWidth: { xs: '100%', md: 0 },
            maxHeight: { xs: 'none', md: 'calc(100vh - 120px)' },
            height: { md: '100%' },
            overflowY: 'auto',
            borderRadius: 5,
            bgcolor: section.bg,
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            boxShadow: '0 8px 32px 0 rgba(60,60,60,0.10)',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2} alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              {section.icon}
              <Typography variant="h4" sx={{ fontWeight: 900, color: section.main, fontFamily: 'Montserrat, Roboto, Arial', letterSpacing: 1 }}>
                {titulo} ({novedadesFiltradas.length})
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                size="small"
                label="Filtrar por fecha"
                type="date"
                value={searchDate}
                onChange={e => setSearchDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 160, boxShadow: '0 2px 8px 0 rgba(60,60,60,0.04)' }}
                inputProps={{ style: { fontSize: 16 } }}
              />
              <TextField
                size="small"
                label="Buscar por usuario"
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 160, boxShadow: '0 2px 8px 0 rgba(60,60,60,0.04)' }}
                inputProps={{ style: { fontSize: 16 } }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ mr: 1, color: section.main }} /></InputAdornment>,
                  style: { fontSize: 16 },
                }}
              />
            </Stack>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <List sx={{ flex: 1 }}>
            {novedadesFiltradas.map((item, idx) => (
              <React.Fragment key={idx}>
                <ListItem
                  component={motion.div}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  secondaryAction={
                    <>
                      <IconButton edge="end" aria-label="copy" onClick={() => handleCopy(item.novedad)}>
                        <ContentCopyIcon fontSize="large" />
                      </IconButton>
                      <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(idx)}>
                        <EditIcon fontSize="large" />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(idx)}>
                        <DeleteIcon fontSize="large" />
                      </IconButton>
                    </>
                  }
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    bgcolor: '#fff',
                    boxShadow: 2,
                    p: 3,
                    alignItems: 'flex-start',
                    wordBreak: 'break-word',
                    minHeight: 80,
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: '0 4px 24px 0 rgba(60,60,60,0.13)' },
                    borderLeft: `8px solid ${turnoColors[item.turno] || '#bdbdbd'}`,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <Chip
                      label={item.turno}
                      sx={{ bgcolor: turnoColors[item.turno] || '#bdbdbd', color: '#333', fontWeight: 700, fontSize: 16 }}
                    />
                    <Chip
                      label={item.conserje ? item.conserje.charAt(0).toUpperCase() + item.conserje.slice(1) : '-'}
                      sx={{ bgcolor: conserjeColors[item.conserje] || '#bdbdbd', color: '#fff', fontWeight: 700, fontSize: 16 }}
                    />
                    <Avatar sx={{ bgcolor: '#eee', color: '#333', fontWeight: 700, width: 32, height: 32, fontSize: 18 }}>
                      {item.user ? item.user.charAt(0).toUpperCase() : user.charAt(0).toUpperCase()}
                    </Avatar>
                  </Stack>
                  <ListItemText
                    primary={<>
                      <Typography variant="h6" sx={{ fontWeight: 700, wordBreak: 'break-word', whiteSpace: 'pre-line', mb: 1, fontSize: 22, fontFamily: 'Montserrat, Roboto, Arial' }}>
                        {item.novedad}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 18, mt: 1 }}>
                        Fecha: <b>{item.fecha || '-'}</b> | Turno: <b>{item.turno || '-'}</b> | Cubre: <b>{item.conserje ? item.conserje.charAt(0).toUpperCase() + item.conserje.slice(1) : '-'}</b>
                        {/* Mostrar campos extra si existen */}
                        {extraFields && Object.entries(extraFields).map(([key, field]) => (
                          <span key={key}> | {field.label}: <b>{item[key] || '-'}</b></span>
                        ))}
                      </Typography>
                      {item.file && (
                        <Box mt={2}>
                          {item.file.startsWith('data:image') ? (
                            <img src={item.file} alt={item.fileName} style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, boxShadow: '0 2px 8px 0 rgba(60,60,60,0.10)' }} />
                          ) : (
                            <a href={item.file} download={item.fileName} style={{ color: section.main, fontWeight: 700 }}>
                              <AttachFileIcon sx={{ verticalAlign: 'middle', mr: 1 }} />{item.fileName}
                            </a>
                          )}
                        </Box>
                      )}
                    </>}
                  />
                </ListItem>
                {idx < novedadesFiltradas.length - 1 && <Divider sx={{ my: 2, borderColor: section.main, opacity: 0.2 }} />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default RegistroGenerico; 