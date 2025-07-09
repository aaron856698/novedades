import React from 'react';
import RegistroGenerico from './RegistroGenerico';

const Eventos = ({ user, onLogout }) => (
  <RegistroGenerico
    user={user}
    onLogout={onLogout}
    storageKeyPrefix="eventos_"
    titulo="Eventos"
    color="secondary"
  />
);

export default Eventos; 