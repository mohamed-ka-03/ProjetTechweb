'use client'
import React, { useEffect, useState } from 'react';

export default function HomeCP() {
  // Étape 1: Créer un état local pour stocker l'email
  const [email, setEmail] = useState('');

  // Étape 2: Utiliser useEffect pour lire l'email depuis le localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('email'); // Assurez-vous que la clé 'email' est correcte
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'au montage du composant

  // Étape 3: Afficher l'email dans le JSX
  return (
    <div className='home h-screen w-[100%]'>
      <div className='ml-80 text-black text-4xl'>
        Page Profile <p>Email: {email}</p>
      </div>
    </div>
  );
}