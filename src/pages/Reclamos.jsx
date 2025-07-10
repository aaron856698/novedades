import React from 'react';
import RegistroGenerico from './RegistroGenerico';

const Reclamos = ({ user, onLogout }) => (
  <RegistroGenerico
    user={user}
    onLogout={onLogout}
    storageKeyPrefix="reclamos_"
    titulo="Reclamos"
    color="error"
    showSearchUser={true}
  />
);

export default Reclamos; 