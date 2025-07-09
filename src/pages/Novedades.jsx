import React from 'react';
import RegistroGenerico from './RegistroGenerico';

const Novedades = ({ user, onLogout }) => (
  <RegistroGenerico
    user={user}
    onLogout={onLogout}
    storageKeyPrefix="novedades_"
    titulo="Novedades"
    color="primary"
  />
);

export default Novedades; 