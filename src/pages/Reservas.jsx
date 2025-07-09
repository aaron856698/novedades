import React, { useState } from 'react';
import RegistroGenerico from './RegistroGenerico';

const unidades = [
  'ph1','ph2','ph3','ph4','ph5',
  '101','102','103','104','105','106',
  '201','202','203','204','205','206',
  '301','302','303','304','305','306',
  '401','402','403','404','405','406',
];
const amenities = ['sum','sauna','pileta','sala de adultos','peluqueria'];

const Reservas = ({ user, onLogout }) => {
  const [unidad, setUnidad] = useState('');
  const [propietario, setPropietario] = useState('');
  const [horario, setHorario] = useState('');
  const [amenity, setAmenity] = useState('');

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
          options: unidades,
          selectProps: {
            sx: {
              bgcolor: '#f3e5f5',
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 18,
              boxShadow: '0 2px 8px 0 rgba(186,104,200,0.10)',
              '& .MuiSelect-select': {
                color: '#6a1b9a',
                fontWeight: 700,
              },
            },
            MenuProps: {
              PaperProps: {
                sx: {
                  bgcolor: '#ede7f6',
                  color: '#4a148c',
                  fontWeight: 700,
                  borderRadius: 2,
                }
              }
            }
          }
        },
        propietario: {
          label: 'Nombre de propietario',
          value: propietario,
          onChange: setPropietario,
        },
        horario: {
          label: 'Horario',
          value: horario,
          onChange: setHorario,
        },
        amenity: {
          label: 'Amenity',
          value: amenity,
          onChange: setAmenity,
          options: amenities,
        },
      }}
    />
  );
};

export default Reservas; 