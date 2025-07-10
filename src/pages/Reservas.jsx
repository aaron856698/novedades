import React, { useState } from 'react';
import RegistroGenerico from './RegistroGenerico';
import { Autocomplete, TextField, InputAdornment } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';

const unidades = [
  'ph1','ph2','ph3','ph4','ph5',
  '101','102','103','104','105','106',
  '201','202','203','204','205','206',
  '301','302','303','304','305','306',
  '401','402','403','404','405','406',
  'H1','H2','H3','H4','H5','H6',
];
const amenities = ['sum','sauna','pileta','sala de adultos','peluqueria'];
const headers = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

const Reservas = ({ user, onLogout }) => {
  const [unidad, setUnidad] = useState('');
  const [propietario, setPropietario] = useState('');
  
  return (
    <RegistroGenerico
      user={user}
      onLogout={onLogout}
      storageKeyPrefix="reservas_"
      titulo="Reservas"
      color="info"
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
                        <HomeIcon sx={{ color: '#6a1b9a', mr: 1 }} />
                      </InputAdornment>
                    ),
                    style: { fontSize: 18, fontWeight: 700, background: '#f3e5f5', borderRadius: 8 },
                  }}
                  sx={{
                    bgcolor: '#f3e5f5',
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: 18,
                    boxShadow: '0 2px 8px 0 rgba(186,104,200,0.10)',
                  }}
                />
              )}
              sx={{ mb: 1 }}
            />
          )
        },
        propietario: {
          label: 'Nombre de Propietario',
          value: propietario,
          onChange: setPropietario,
          render: ({ value, onChange }) => (
            <TextField
              label="Nombre de Propietario"
              fullWidth
              value={value}
              onChange={(e) => onChange(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#6a1b9a', mr: 1 }} />
                  </InputAdornment>
                ),
                style: { fontSize: 18, fontWeight: 700, background: '#f3e5f5', borderRadius: 8 },
              }}
              sx={{
                bgcolor: '#f3e5f5',
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 18,
                boxShadow: '0 2px 8px 0 rgba(186,104,200,0.10)',
              }}
            />
          )
        }
      }}
      hideConserje={true}
    />
  );
};

export default Reservas; 