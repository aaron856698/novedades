import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, TextField, Paper, IconButton, List, ListItem, ListItemText, MenuItem, Select, InputLabel, FormControl, Divider, Stack, InputAdornment, useTheme, Chip, Avatar
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
import PersonIcon from '@mui/icons-material/Person';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const turnos = ["Mañana", "Tarde", "Noche"];
const conserjes = ["aaron", "maria", "lisa", "martin", "sebastian", "guardia", "fredy", "gaston", "enzo", "emiliano"];
const turnoColors = { "Mañana": '#81d4fa', "Tarde": '#ffd54f', "Noche": '#9575cd' };
const conserjeColors = { aaron: '#43a047', maria: '#e57373', lisa: '#ba68c8', martin: '#ffd600', sebastian: '#00bcd4', guardia: '#8d6e63', fredy: '#ff6b6b', gaston: '#4ecdc4', enzo: '#95e1d3', emiliano: '#f38181' };

const highlightColors = [
  { name: 'AMA', color: '#fff59d' },
  { name: 'VER', color: '#a5d6a7' },
  { name: 'CEL', color: '#81d4fa' },
  { name: 'NAR', color: '#ffcc80' },
  { name: 'ROS', color: '#f8bbd0' },
];

const sectionStyles = {
  primary: {
    main: '#2196f3', bg: '#f3f8ff', icon: <AnnouncementIcon fontSize="large" sx={{ color: '#2196f3', mr: 1 }} />,
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
  success: {
    main: '#4caf50', bg: '#e8f5e9', icon: <BookOnlineIcon fontSize="large" sx={{ color: '#4caf50', mr: 1 }} />,
  },
};

function migrateItem(item) {
  if (typeof item === 'string') {
    return { novedad: item, fecha: '', turno: '', conserje: '', file: null, fileName: '', user: '' };
  }
  return { ...item, file: item.file || null, fileName: item.fileName || '', user: item.user || '' };
}

const colorTags = {
  '#fff59d': 'yellow',
  '#a5d6a7': 'green',
  '#81d4fa': 'blue',
  '#ffcc80': 'orange',
  '#f8bbd0': 'pink',
};
const colorMap = {
  yellow: '#fff59d',
  green: '#a5d6a7',
  blue: '#81d4fa',
  orange: '#ffcc80',
  pink: '#f8bbd0',
};

const RegistroGenerico = ({ user, onLogout, storageKeyPrefix, titulo, color, extraFields, hideConserje, showSearchUser, searchDate, searchUser, searchPropietario, handleCopyDay, propietarioLabel }) => {
  const [novedad, setNovedad] = useState('');
  const [novedadHtml, setNovedadHtml] = useState('');
  const [novedades, setNovedades] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [fecha, setFecha] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [search, setSearch] = useState('');
  const textareaRef = useRef(null);
  const listRef = useRef(null);
  const theme = useTheme();

  // Estados para campos extra
  const [extra, setExtra] = useState({});
  const [turno, setTurno] = useState('');
  const [conserje, setConserje] = useState('');
  // 1. Agregar estado para lightbox de imagen
  const [lightboxImg, setLightboxImg] = useState(null);

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

  // Escuchar el evento de copiar novedades del día
  useEffect(() => {
    const handleCopyEvent = () => {
      handleCopyDayInternal();
    };
    
    window.addEventListener('copyNovedadesDelDia', handleCopyEvent);
    
    return () => {
      window.removeEventListener('copyNovedadesDelDia', handleCopyEvent);
    };
  }, [searchDate, novedades]); // Dependencias para que se actualice cuando cambien los datos

  const handleNovedadChange = (e) => {
    let value = e.target.value.replace(/,\s?/g, '\n');
    setNovedad(value);
    setNovedadHtml(value); // Por defecto, sin HTML
  };

  // Resaltar selección
  const handleHighlight = (color) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === end) return;
    // Permitir múltiples resaltados: solo envolver la selección actual
    const before = novedad.slice(0, start);
    const selected = novedad.slice(start, end);
    const after = novedad.slice(end);
    const tag = colorTags[color];
    const withTag = `${before}[${tag}]${selected}[/${tag}]${after}`;
    setNovedad(withTag);
    setNovedadHtml(withTag);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = before.length + (`[${tag}]${selected}[/${tag}]`).length;
    }, 0);
  };

  // Parsear marcadores a HTML para mostrar en la lista
  function parseHighlight(text) {
    if (!text) return '';
    return text.replace(/\[(yellow|green|blue|orange|pink)\](.*?)\[\/\1\]/g, (match, tag, content) => {
      const color = colorMap[tag] || '#fff59d';
      return `<span style="background:${color};padding:2px 4px;border-radius:3px">${content}</span>`;
    });
  }

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
    if (!novedadHtml.trim() || !fecha || !turno || (!hideConserje && !conserje)) {
      // SweetAlert2 para campos faltantes
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos requeridos',
        icon: 'warning',
        background: '#fffef6',
        color: '#ffd600',
        confirmButtonColor: '#ffd600',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    
    // Validar campos extra si existen
    if (extraFields) {
      for (const key of Object.keys(extraFields)) {
        if (!extra[key] || extra[key].toString().trim() === '') {
          Swal.fire({
            title: 'Campos incompletos',
            text: `Por favor completa el campo: ${extraFields[key].label}`,
            icon: 'warning',
            background: '#fffef6',
            color: '#ffd600',
            confirmButtonColor: '#ffd600',
            confirmButtonText: 'Entendido'
          });
          return;
        }
      }
    }
    
    const nueva = { novedadHtml, fecha, file, fileName, user, turno, conserje, ...extra };
    if (editIndex !== null) {
      const updated = [...novedades];
      updated[editIndex] = nueva;
      saveNovedades(updated);
      
      // SweetAlert2 para edición exitosa
      Swal.fire({
        title: '¡Registro actualizado!',
        text: 'La novedad ha sido editada correctamente',
        icon: 'success',
        background: '#f3f8ff',
        color: '#2196f3',
        confirmButtonColor: '#2196f3',
        confirmButtonText: 'Perfecto',
        timer: 2000,
        timerProgressBar: true
      });
      
      setEditIndex(null);
    } else {
      saveNovedades([...novedades, nueva]);
      
      // Verificar si hay un filtro de fecha activo y si la nueva novedad no coincide
      if (searchDate && searchDate !== '' && fecha !== searchDate) {
        // Disparar evento para limpiar el filtro
        window.dispatchEvent(new CustomEvent('limpiarFiltroFecha', { 
          detail: { 
            nuevaFecha: fecha,
            filtroActivo: searchDate 
          } 
        }));
        
        Swal.fire({
          title: '¡Novedad agregada!',
          text: `La novedad ha sido guardada para la fecha ${fecha}. El filtro se ha limpiado para mostrar todas las novedades.`,
          icon: 'success',
          background: '#f3f8ff',
          color: '#2196f3',
          confirmButtonColor: '#2196f3',
          confirmButtonText: 'Excelente',
          timer: 3000,
          timerProgressBar: true
        });
      } else {
        // SweetAlert2 para agregado exitoso normal
        Swal.fire({
          title: '¡Novedad agregada!',
          text: 'La novedad ha sido guardada correctamente',
          icon: 'success',
          background: '#f3f8ff',
          color: '#2196f3',
          confirmButtonColor: '#2196f3',
          confirmButtonText: 'Excelente',
          timer: 2000,
          timerProgressBar: true
        });
      }
    }
    
    setNovedad('');
    setNovedadHtml('');
    setFecha('');
    setFile(null);
    setFileName('');
    setTurno('');
    setConserje('');
    if (extraFields) {
      const reset = {};
      Object.keys(extraFields).forEach(key => { reset[key] = ''; });
      setExtra(reset);
    }
  };

  const handleEdit = (idx) => {
    const item = novedades[idx];
    setNovedad(item.novedadHtml ? item.novedadHtml.replace(/<[^>]+>/g, '') : item.novedad);
    setNovedadHtml(item.novedadHtml || item.novedad || '');
    setFecha(item.fecha);
    setFile(item.file || null);
    setFileName(item.fileName || '');
    setTurno(item.turno || '');
    setConserje(item.conserje || '');
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
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede revertir.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#fffef6',
      color: '#ffd600',
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = novedades.filter((_, i) => i !== idx);
        saveNovedades(updated);
        Swal.fire({
          title: '¡Registro eliminado!',
          text: 'La novedad ha sido eliminada.',
          icon: 'success',
          background: '#f8fff5',
          color: '#dc3545',
          confirmButtonColor: '#dc3545',
          confirmButtonText: 'Entendido',
          timer: 2000,
          timerProgressBar: true
        });
        setNovedad('');
        setNovedadHtml('');
        setFecha('');
        setFile(null);
        setFileName('');
        setTurno('');
        setConserje('');
        setEditIndex(null);
      }
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      title: '¡Novedad copiada!',
      text: 'La novedad ha sido copiada al portapapeles.',
      icon: 'success',
      background: '#f3f8ff',
      color: '#2196f3',
      confirmButtonColor: '#2196f3',
      confirmButtonText: 'Excelente',
      timer: 2000,
      timerProgressBar: true
    });
  };

  // Filtro por texto, fecha, usuario (quién cubre) y propietario
  const novedadesFiltradas = novedades.filter(item => {
    if (!item || typeof item !== 'object') return false;
    
    // Filtro por fecha - si searchDate está vacío, mostrar todas las fechas
    const matchFecha = !searchDate || searchDate === '' || item.fecha === searchDate;
    
    // Si showSearchUser está activo, filtrar por conserje (quién cubre)
    const matchUser = !showSearchUser || !searchUser || searchUser.trim() === '' || (item.conserje && item.conserje.toLowerCase().includes(searchUser.toLowerCase()));
    
    // Filtro por propietario
    const matchPropietario = !searchPropietario || searchPropietario.trim() === '' || (item.propietario && item.propietario.toLowerCase().includes(searchPropietario.toLowerCase()));
    
    return matchFecha && matchUser && matchPropietario;
  });

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [novedadesFiltradas.length]);

  const handleExport = () => {
    try {
      const key = `${storageKeyPrefix}${user}`;
      const raw = localStorage.getItem(key);
      const items = raw ? JSON.parse(raw) : novedades;
      const payload = {
        section: storageKeyPrefix,
        user,
        timestamp: new Date().toISOString(),
        items,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${titulo.toLowerCase()}_${user}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      if (typeof Swal !== 'undefined') {
        Swal.fire({ title: 'Exportación lista', text: 'Se descargó la copia de seguridad', icon: 'success', background: '#f3f8ff', color: '#2196f3', confirmButtonColor: '#2196f3', confirmButtonText: 'Entendido' });
      }
    } catch (_) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({ title: 'Error al exportar', text: 'No se pudo generar el archivo', icon: 'error', background: '#fff6f6', color: '#e57373', confirmButtonColor: '#e57373', confirmButtonText: 'Intentar de nuevo' });
      }
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const items = Array.isArray(data) ? data : data && data.items ? data.items : null;
        if (!items) {
          if (typeof Swal !== 'undefined') {
            Swal.fire({ title: 'Archivo inválido', text: 'No se encontraron datos para importar', icon: 'error', background: '#fff6f6', color: '#e57373', confirmButtonColor: '#e57373', confirmButtonText: 'Entendido' });
          }
          e.target.value = '';
          return;
        }
        const key = `${storageKeyPrefix}${user}`;
        localStorage.setItem(key, JSON.stringify(items));
        setNovedades(items);
        if (typeof Swal !== 'undefined') {
          Swal.fire({ title: 'Importación exitosa', text: 'Se restauraron las novedades', icon: 'success', background: '#f8fff5', color: '#43a047', confirmButtonColor: '#43a047', confirmButtonText: 'Perfecto' });
        }
      } catch (_) {
        if (typeof Swal !== 'undefined') {
          Swal.fire({ title: 'Error al importar', text: 'No se pudo leer el archivo', icon: 'error', background: '#fff6f6', color: '#e57373', confirmButtonColor: '#e57373', confirmButtonText: 'Intentar de nuevo' });
        }
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  // Copiar novedades del día filtrado
  const handleCopyDayInternal = () => {
    const fechaCopia = searchDate || new Date().toISOString().slice(0, 10);
    const turnosOrden = ['Mañana', 'Tarde', 'Noche'];
    const novedadesDia = novedades
      .filter(item => item.fecha === fechaCopia)
      .sort((a, b) => turnosOrden.indexOf(a.turno) - turnosOrden.indexOf(b.turno));
    let texto = `Fecha: ${fechaCopia}\n`;
    let html = `<b>Fecha: ${fechaCopia}</b><br/>`;
    // Función para limpiar los tags de color
    const cleanTags = (str) => str ? str.replace(/\[(yellow|green|blue|orange|pink)\](.*?)\[\/\1\]/g, '$2') : '';
    // Función para parsear a HTML
    const parseHighlight = (str) => str ? str.replace(/\[(yellow|green|blue|orange|pink)\](.*?)\[\/\1\]/g, (match, tag, content) => {
      const color = colorMap[tag] || '#fff59d';
      return `<span style=\"background:${color};padding:2px 4px;border-radius:3px\">${content}</span>`;
    }) : '';
    turnosOrden.forEach(turno => {
      const nov = novedadesDia.find(n => n.turno === turno);
      if (nov) {
        const novedadTxt = cleanTags(nov.novedadHtml || nov.novedad || '');
        const novedadHtml = parseHighlight(nov.novedadHtml || nov.novedad || '');
        texto += `${turno} - Cubre: ${nov.conserje ? nov.conserje.charAt(0).toUpperCase() + nov.conserje.slice(1) : '-'}: ${novedadTxt}\n`;
        html += `<b>${turno}</b> - Cubre: <b>${nov.conserje ? nov.conserje.charAt(0).toUpperCase() + nov.conserje.slice(1) : '-'}</b>: ${novedadHtml}`;
        // Si hay imagen adjunta, incluirla en el HTML
        if (nov.file && typeof nov.file === 'string' && nov.file.startsWith('data:image')) {
          html += `<br/><img src=\"${nov.file}\" alt=\"adjunto\" style=\"max-width:300px;display:block;margin:10px 0;border-radius:8px;box-shadow:0 2px 8px 0 rgba(60,60,60,0.10);\" />`;
        }
        html += '<br/>';
      } else {
        texto += `${turno} - Cubre: -: (sin novedad)\n`;
        html += `<b>${turno}</b> - Cubre: <b>-</b>: (sin novedad)<br/>`;
      }
    });
    // Copiar ambos formatos
    if (navigator.clipboard && window.ClipboardItem) {
      const blobHtml = new Blob([html.trim()], { type: 'text/html' });
      const blobText = new Blob([texto.trim()], { type: 'text/plain' });
      navigator.clipboard.write([
        new window.ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText
        })
      ]).then(() => {
        Swal.fire({
          title: '¡Novedades copiadas con color!',
          text: 'Las novedades han sido copiadas al portapapeles en formato enriquecido.',
          icon: 'success',
          background: '#f3f8ff',
          color: '#2196f3',
          confirmButtonColor: '#2196f3',
          confirmButtonText: 'Excelente',
          timer: 2000,
          timerProgressBar: true
        });
      }, () => {
        Swal.fire({
          title: 'No se pudo copiar en formato enriquecido',
          text: 'Las novedades han sido copiadas al portapapeles en formato de texto plano.',
          icon: 'warning',
          background: '#fffef6',
          color: '#ffd600',
          confirmButtonColor: '#ffd600',
          confirmButtonText: 'Entendido'
        });
      });
    } else {
      // Fallback solo texto plano
      navigator.clipboard.writeText(texto.trim());
      Swal.fire({
        title: '¡Novedades copiadas!',
        text: 'Las novedades han sido copiadas al portapapeles en formato de texto plano.',
        icon: 'success',
        background: '#f3f8ff',
        color: '#2196f3',
        confirmButtonColor: '#2196f3',
        confirmButtonText: 'Excelente',
        timer: 2000,
        timerProgressBar: true
      });
    }
  };

  return (
    <Box sx={{ bgcolor: fondoGeneral, height: 'calc(100vh - 200px)', transition: 'background 0.3s', overflowX: 'hidden', width: '100vw', maxWidth: '100vw', p: 0, m: 0 }}>
      {/* <Snackbar open={snackbar.open} autoHideDuration={2500} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ fontSize: 18 }}>{snackbar.message}</Alert>
      </Snackbar> */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'stretch', md: 'stretch' }}
        justifyContent="center"
        width="100vw"
        height="100%"
        maxWidth="100vw"
        px={{ xs: 1, md: 4 }}
        py={4}
        gap={4}
        sx={{ boxSizing: 'border-box', overflowX: 'hidden', width: '100vw', maxWidth: '100vw', p: 0, m: 0 }}
      >
        {/* Formulario */}
        <Paper
          component={motion.div}
          initial={{ opacity: 0, x: -40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
          elevation={8}
          sx={{
            p: 6,
            minWidth: { xs: '100%', md: 340 },
            maxWidth: 420,
            width: { xs: '100%', md: 400 },
            borderRadius: 5,
            height: 'calc(100vh - 280px)',
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
            overflowY: 'auto',
            background: `linear-gradient(135deg, ${section.bg} 0%, ${section.bg}dd 100%)`,
            border: `1px solid ${section.main}20`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: `0 12px 48px 0 ${section.main}25`,
            },
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
              field.render
                ? (
                  <div key={key}>
                    {field.render({
                      value: extra[key] || '',
                      onChange: v => handleExtraChange(key, v),
                    })}
                  </div>
                )
                : field.options ? (
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
            {/* Resaltador */}
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography variant="body2" color="text.secondary">Resaltar:</Typography>
              {highlightColors.map(opt => (
                <Button key={opt.color} size="small" onClick={() => handleHighlight(opt.color)} sx={{ minWidth: 0, bgcolor: opt.color, color: '#333', border: '1px solid #bbb', px: 2.5, py: 0.5, borderRadius: 3, fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>
                  {opt.name}
                </Button>
              ))}
            </Box>
            <TextField
              label={titulo.slice(0, -1)}
              fullWidth
              value={novedad}
              onChange={handleNovedadChange}
              autoFocus
              inputProps={{ style: { fontSize: 20, minHeight: 60, lineHeight: 1.4 }, as: 'textarea', rows: 2 }}
              inputRef={textareaRef}
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
            {!hideConserje && (
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
            )}
            <Button
              component={motion.button}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
                boxShadow: `0 4px 16px 0 ${section.main}40`,
                background: `linear-gradient(135deg, ${section.main} 0%, ${section.main}dd 100%)`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover': { 
                  bgcolor: section.main,
                  boxShadow: `0 6px 24px 0 ${section.main}60`,
                  '&::before': {
                    left: '100%',
                  },
                },
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
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          elevation={8}
          sx={{
            p: 4,
            flex: 1,
            minWidth: { xs: '100%', md: 0 },
            height: 'calc(100vh - 280px)',
            overflowY: 'auto',
            borderRadius: 5,
            bgcolor: section.bg,
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            boxShadow: '0 8px 32px 0 rgba(60,60,60,0.10)',
            background: `linear-gradient(135deg, ${section.bg} 0%, ${section.bg}dd 100%)`,
            border: `1px solid ${section.main}20`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: `0 12px 48px 0 ${section.main}25`,
            },
          }}
          ref={listRef}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2} alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              {section.icon}
              {/* 3. Mejorar el estilo visual del título principal (h4): */}
              <Typography variant="h4" sx={{ fontWeight: 900, color: section.main, fontFamily: 'Montserrat, Roboto, Arial', letterSpacing: 1, fontSize: { xs: 32, md: 40 }, textShadow: '0 2px 12px #0001', mb: 1, mt: 1, textAlign: 'center', lineHeight: 1.1 }}>
                {titulo} ({novedadesFiltradas.length})
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" width="100%" maxWidth={600}>
              <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExport} sx={{ borderRadius: 2, fontWeight: 600 }}>
                Exportar
              </Button>
              <Button component="label" variant="outlined" startIcon={<FileUploadIcon />} sx={{ borderRadius: 2, fontWeight: 600 }}>
                Importar
                <input type="file" hidden accept="application/json" onChange={handleImportFile} />
              </Button>
            </Stack>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <List sx={{ flex: 1 }}>
            {novedadesFiltradas.map((item, idx) => (
              <React.Fragment key={idx}>
                <ListItem
                  component={motion.div}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: idx * 0.05,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  whileHover={{ 
                    y: -4,
                    transition: { duration: 0.2 }
                  }}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton 
                        edge="end" 
                        aria-label="copy" 
                        onClick={() => handleCopy(item.novedad)}
                        sx={{
                          transition: 'all 0.2s',
                          '&:hover': { 
                            bgcolor: section.main + '15',
                            transform: 'scale(1.1)',
                            color: section.main
                          }
                        }}
                      >
                        <ContentCopyIcon fontSize="large" />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="edit" 
                        onClick={() => handleEdit(idx)}
                        sx={{
                          transition: 'all 0.2s',
                          '&:hover': { 
                            bgcolor: '#2196f315',
                            transform: 'scale(1.1)',
                            color: '#2196f3'
                          }
                        }}
                      >
                        <EditIcon fontSize="large" />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        onClick={() => handleDelete(idx)}
                        sx={{
                          transition: 'all 0.2s',
                          '&:hover': { 
                            bgcolor: '#f4433615',
                            transform: 'scale(1.1)',
                            color: '#f44336'
                          }
                        }}
                      >
                        <DeleteIcon fontSize="large" />
                      </IconButton>
                    </Box>
                  }
                  sx={{
                    mb: 3,
                    borderRadius: 4,
                    bgcolor: '#fff',
                    boxShadow: '0 2px 12px 0 rgba(60,60,60,0.08)',
                    p: 3,
                    alignItems: 'flex-start',
                    wordBreak: 'break-word',
                    minHeight: 80,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderLeft: `6px solid ${turnoColors[item.turno] || '#bdbdbd'}`,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(135deg, ${section.main}08 0%, transparent 100%)`,
                      opacity: 0,
                      transition: 'opacity 0.3s',
                    },
                    '&:hover': { 
                      boxShadow: `0 8px 32px 0 ${section.main}20`,
                      transform: 'translateY(-4px)',
                      '&::before': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <Chip
                      component={motion.div}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      label={item.turno}
                      sx={{ 
                        bgcolor: turnoColors[item.turno] || '#bdbdbd', 
                        color: '#333', 
                        fontWeight: 700, 
                        fontSize: 16,
                        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)',
                        }
                      }}
                    />
                    <Chip
                      component={motion.div}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      label={item.conserje ? item.conserje.charAt(0).toUpperCase() + item.conserje.slice(1) : '-'}
                      sx={{ 
                        bgcolor: conserjeColors[item.conserje] || '#bdbdbd', 
                        color: '#fff', 
                        fontWeight: 700, 
                        fontSize: 16,
                        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)',
                        }
                      }}
                    />
                    <Avatar 
                      component={motion.div}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      sx={{ 
                        bgcolor: section.main + '20', 
                        color: section.main, 
                        fontWeight: 700, 
                        width: 36, 
                        height: 36, 
                        fontSize: 18,
                        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)',
                        transition: 'all 0.2s',
                      }}
                    >
                      {item.user ? item.user.charAt(0).toUpperCase() : user.charAt(0).toUpperCase()}
                    </Avatar>
                  </Stack>
                  <ListItemText
                    primary={<>
                      <Typography variant="h6" sx={{ fontWeight: 700, wordBreak: 'break-word', whiteSpace: 'pre-line', mb: 1, fontSize: 22, fontFamily: 'Montserrat, Roboto, Arial' }}>
                        <span dangerouslySetInnerHTML={{ __html: parseHighlight(item.novedadHtml || item.novedad) }} />
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 18, mt: 1 }}>
                        Fecha: <b>{item.fecha || '-'}</b> | Turno: <b>{item.turno || '-'}</b> | Cubre: <b>{item.conserje ? item.conserje.charAt(0).toUpperCase() + item.conserje.slice(1) : '-'}</b>
                        {/* Mostrar campos extra si existen */}
                        {extraFields && Object.entries(extraFields).map(([key, field]) => {
                          // Excluir propietario, horaRecibida y horaEntregada (se muestran aparte)
                          if (key === 'propietario' || key === 'horaRecibida' || key === 'horaEntregada') return null;
                          return <span key={key}> | {field.label}: <b>{item[key] || '-'}</b></span>;
                        })}
                      </Typography>
                      {/* Mostrar horas de forma destacada si existen */}
                      {(item.horaRecibida || item.horaEntregada) && (
                        <Box mt={1} display="flex" gap={2} flexWrap="wrap">
                          {item.horaRecibida && (
                            <Chip
                              icon={<AccessTimeIcon />}
                              label={`Hora recibida: ${item.horaRecibida}`}
                              sx={{
                                bgcolor: '#e3f2fd',
                                color: '#1976d2',
                                fontWeight: 700,
                                fontSize: 14,
                                height: 32,
                                '& .MuiChip-icon': { color: '#1976d2' }
                              }}
                            />
                          )}
                          {item.horaEntregada && (
                            <Chip
                              icon={<CheckCircleIcon />}
                              label={`Hora entregada: ${item.horaEntregada}`}
                              sx={{
                                bgcolor: '#e8f5e9',
                                color: '#2e7d32',
                                fontWeight: 700,
                                fontSize: 14,
                                height: 32,
                                '& .MuiChip-icon': { color: '#2e7d32' }
                              }}
                            />
                          )}
                        </Box>
                      )}
                      {/* Mostrar propietario/destinatario en una línea separada y más prolija */}
                      {item.propietario && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 16, mt: 0.5, ml: 0, fontStyle: 'italic', display: 'block' }}>
                          {propietarioLabel || 'Propietario'}: <b>{item.propietario}</b>
                        </Typography>
                      )}
                      {/* Mostrar información adicional de paquetería de forma destacada */}
                      {(item.unidad || item.tracking || item.estado || item.recibidoPor) && (
                        <Box mt={1.5} display="flex" gap={1.5} flexWrap="wrap">
                          {item.unidad && (
                            <Chip
                              icon={<HomeIcon />}
                              label={`Unidad: ${item.unidad}`}
                              size="small"
                              sx={{
                                bgcolor: section.main + '15',
                                color: section.main,
                                fontWeight: 600,
                                fontSize: 13,
                                '& .MuiChip-icon': { color: section.main }
                              }}
                            />
                          )}
                          {item.tracking && (
                            <Chip
                              icon={<LocalShippingIcon />}
                              label={`Tracking: ${item.tracking}`}
                              size="small"
                              sx={{
                                bgcolor: section.main + '15',
                                color: section.main,
                                fontWeight: 600,
                                fontSize: 13,
                                '& .MuiChip-icon': { color: section.main }
                              }}
                            />
                          )}
                          {item.estado && (
                            <Chip
                              label={`Estado: ${item.estado}`}
                              size="small"
                              sx={{
                                bgcolor: item.estado === 'Entregado' ? '#4caf50' : item.estado === 'Recibido' ? '#2196f3' : '#ff9800',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: 13,
                              }}
                            />
                          )}
                          {item.recibidoPor && (
                            <Chip
                              icon={<PersonIcon />}
                              label={`Recibido por: ${item.recibidoPor}`}
                              size="small"
                              sx={{
                                bgcolor: section.main + '15',
                                color: section.main,
                                fontWeight: 600,
                                fontSize: 13,
                                '& .MuiChip-icon': { color: section.main }
                              }}
                            />
                          )}
                        </Box>
                      )}
                      {item.file && (
                        <Box mt={2}>
                          {item.file.startsWith('data:image') ? (
                            <img
                              src={item.file}
                              alt={item.fileName}
                              style={{
                                maxWidth: 120,
                                maxHeight: 120,
                                borderRadius: 8,
                                boxShadow: '0 2px 8px 0 rgba(60,60,60,0.10)',
                                cursor: 'pointer',
                                transition: 'transform 0.25s cubic-bezier(.4,2,.6,1)',
                              }}
                              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
                              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                              onClick={() => setLightboxImg(item.file)}
                            />
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
      {/* Lightbox modal para imagen grande */}
      {lightboxImg && (
        <Box
          onClick={() => setLightboxImg(null)}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.75)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <img
            src={lightboxImg}
            alt="Adjunto grande"
            style={{
              width: '50vw',
              height: '50vh',
              objectFit: 'contain',
              borderRadius: 16,
              boxShadow: '0 8px 32px 0 rgba(60,60,60,0.25)',
              transition: 'transform 0.3s cubic-bezier(.4,2,.6,1)',
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default RegistroGenerico; 
