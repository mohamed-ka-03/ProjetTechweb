'use client'
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState('');

  const setEmailAndPersist = (newEmail) => {
    setEmail(newEmail);
    // Optionnel: Stocker l'email dans localStorage/sessionStorage pour la persistance
    localStorage.setItem('email', newEmail);
  };

  return (
    <AuthContext.Provider value={{ email, setEmail: setEmailAndPersist }}>
      {children}
    </AuthContext.Provider>
  );
};