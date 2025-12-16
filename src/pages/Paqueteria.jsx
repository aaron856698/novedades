import React, { useState, useEffect } from 'react';
import RegistroGenerico from './RegistroGenerico';
import { Autocomplete, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const unidades = [
  'ph1','ph2','ph3','ph4','ph5',
  '101','102','103','104','105','106',
  '201','202','203','204','205','206',
  '301','302','303','304','305','306',
  '401','402','403','404','405','406',
  'H1','H2','H3','H4','H5','H6',
];

const estados = ['Pendiente', 'Recibido', 'Entregado'];

const Paqueteria = ({ user, onLogout }) => {
  const [unidad, setUnidad] = useState('');
  const [destinatario, setDestinatario] = useState('');
  const [tracking, setTracking] = useState('');
  const [estado, setEstado] = useState('Pendiente');
  const [recibidoPor, setRecibidoPor] = useState('');
  const [horaRecibida, setHoraRecibida] = useState('');
  const [horaEntregada, setHoraEntregada] = useState('');

  // Si no hay hora de entrega, automáticamente poner estado como Pendiente
  useEffect(() => {
    if (!horaEntregada || horaEntregada.trim() === '') {
      setEstado('Pendiente');
    }
  }, [horaEntregada]);

  return (
    <RegistroGenerico
      user={user}
      onLogout={onLogout}
      storageKeyPrefix="paqueteria_"
      titulo="Paquetería"
      color="success"
      propietarioLabel="Destinatario"
      hideConserje={true}
      extraFields={{
        unidad: {
          label: 'Unidad',
          value: unidad,
          onChange: setUnidad,
          render: ({ value, onChange }) => (
            <Autocomplete
              options={unidades}
              value={value}
              onChange={(_, newValue) => onChange(newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Unidad"
                  required
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon sx={{ color: '#4caf50', mr: 1 }} />
                      </InputAdornment>
                    ),
                    style: { fontSize: 18, fontWeight: 700, background: '#e8f5e9', borderRadius: 8 },
                  }}
                  sx={{ bgcolor: '#e8f5e9', borderRadius: 2, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px 0 rgba(76,175,80,0.15)' }}
                />
              )}
              sx={{ mb: 1 }}
            />
          )
        },
        propietario: {
          label: 'Destinatario',
          value: destinatario,
          onChange: setDestinatario,
          render: ({ value, onChange }) => (
            <TextField
              label="Destinatario"
              fullWidth
              value={value}
              onChange={(e) => onChange(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#4caf50', mr: 1 }} />
                  </InputAdornment>
                ),
                style: { fontSize: 18, fontWeight: 700, background: '#e8f5e9', borderRadius: 8 },
              }}
              sx={{ bgcolor: '#e8f5e9', borderRadius: 2, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px 0 rgba(76,175,80,0.15)' }}
            />
          )
        },
        tracking: {
          label: 'Nº de seguimiento',
          value: tracking,
          onChange: setTracking,
          render: ({ value, onChange }) => (
            <TextField
              label="Nº de seguimiento"
              fullWidth
              value={value}
              onChange={(e) => onChange(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalShippingIcon sx={{ color: '#4caf50', mr: 1 }} />
                  </InputAdornment>
                ),
                style: { fontSize: 18, fontWeight: 700, background: '#e8f5e9', borderRadius: 8 },
              }}
              sx={{ bgcolor: '#e8f5e9', borderRadius: 2, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px 0 rgba(76,175,80,0.15)' }}
            />
          )
        },
        estado: {
          label: 'Estado',
          value: estado,
          onChange: setEstado,
          render: ({ value, onChange }) => (
            <FormControl fullWidth>
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select 
                labelId="estado-label" 
                value={value} 
                label="Estado" 
                onChange={e => onChange(e.target.value)} 
                sx={{ 
                  bgcolor: '#fff', 
                  borderRadius: 2,
                  fontSize: 18,
                  fontWeight: 600,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4caf50',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4caf50',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4caf50',
                    borderWidth: 2,
                  },
                }}
              >
                {estados.map(e => <MenuItem key={e} value={e} sx={{ fontSize: 18, fontWeight: 600 }}>{e}</MenuItem>)}
              </Select>
            </FormControl>
          )
        },
        recibidoPor: {
          label: 'Recibido por',
          value: recibidoPor,
          onChange: setRecibidoPor,
          render: ({ value, onChange }) => (
            <TextField
              label="Recibido por"
              fullWidth
              value={value}
              onChange={(e) => onChange(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#4caf50', mr: 1 }} />
                  </InputAdornment>
                ),
                style: { fontSize: 18, fontWeight: 700, background: '#e8f5e9', borderRadius: 8 },
              }}
              sx={{ bgcolor: '#e8f5e9', borderRadius: 2, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px 0 rgba(76,175,80,0.15)' }}
            />
          )
        },
        horaRecibida: {
          label: 'Hora recibida',
          value: horaRecibida,
          onChange: setHoraRecibida,
          render: ({ value, onChange }) => (
            <TextField
              label="Hora recibida"
              type="time"
              fullWidth
              value={value}
              onChange={(e) => onChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeIcon sx={{ color: '#4caf50', mr: 1 }} />
                  </InputAdornment>
                ),
                style: { fontSize: 18, fontWeight: 700, background: '#e8f5e9', borderRadius: 8 },
              }}
              sx={{ bgcolor: '#e8f5e9', borderRadius: 2, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px 0 rgba(76,175,80,0.15)' }}
            />
          )
        },
        horaEntregada: {
          label: 'Hora entregada',
          value: horaEntregada,
          onChange: setHoraEntregada,
          render: ({ value, onChange }) => (
            <TextField
              label="Hora entregada"
              type="time"
              fullWidth
              value={value}
              onChange={(e) => onChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CheckCircleIcon sx={{ color: '#4caf50', mr: 1 }} />
                  </InputAdornment>
                ),
                style: { fontSize: 18, fontWeight: 700, background: '#e8f5e9', borderRadius: 8 },
              }}
              sx={{ bgcolor: '#e8f5e9', borderRadius: 2, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px 0 rgba(76,175,80,0.15)' }}
            />
          )
        },
      }}
    />
  );
};

export default Paqueteria;
