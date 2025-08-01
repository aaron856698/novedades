import React from 'react';
import RegistroGenerico from './RegistroGenerico';

const Novedades = ({ user, onLogout, searchDate, searchUser, handleCopyDay }) => (
  <RegistroGenerico
    user={user}
    onLogout={onLogout}
    storageKeyPrefix="novedades_"
    titulo="Novedades"
    color="primary"
    showSearchUser={true}
    searchDate={searchDate}
    searchUser={searchUser}
    handleCopyDay={handleCopyDay}
  />
);

export default Novedades; 