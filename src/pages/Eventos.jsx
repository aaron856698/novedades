import React from 'react';
import RegistroGenerico from './RegistroGenerico';
import { Autocomplete, TextField, InputAdornment } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

const unidades = [
  'ph1','ph2','ph3','ph4','ph5',
  '101','102','103','104','105','106',
  '201','202','203','204','205','206',
  '301','302','303','304','305','306',
  '401','402','403','404','405','406',
  'H1','H2','H3','H4','H5','H6',
];

const Eventos = ({ user, onLogout }) => {
  const [unidad, setUnidad] = React.useState('');
  return (
    <RegistroGenerico
      user={user}
      onLogout={onLogout}
      storageKeyPrefix="eventos_"
      titulo="Eventos"
      color="secondary"
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
                        <HomeIcon sx={{ color: '#e57373', mr: 1 }} />
                      </InputAdornment>
                    ),
                    style: { fontSize: 18, fontWeight: 700, background: '#ffebee', borderRadius: 8 },
                  }}
                  sx={{
                    bgcolor: '#ffebee',
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: 18,
                    boxShadow: '0 2px 8px 0 rgba(229,115,115,0.10)',
                  }}
                />
              )}
              sx={{ mb: 1 }}
            />
          )
        }
      }}
    />
  );
};

export default Eventos; 