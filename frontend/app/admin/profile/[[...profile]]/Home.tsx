'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';

interface Profile {
  id: string;
  email: string;
  mdp: string;
  fonction: string;
  structure: string;
}

interface Structure {
  id: string;
  nomStructure: string;
  address: string;
}

export default function HomeCP() {
  const [profileList, setProfileList] = useState<Profile[]>([]);
  const [structureList, setStructureList] = useState<Structure[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    mdp: '',
    fonction: '',
    structure: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProfileId, setUpdateProfileId] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
    fetchStructures();
  }, []);

  async function fetchProfiles() {
    try {
      const response = await axios.get<Profile[]>('http://localhost:4002/api/get/profile');
      const data = response.data;
      setProfileList(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des profils:', error);
    }
  }

  async function fetchStructures() {
    try {
      const response = await axios.get<Structure[]>('http://localhost:4002/api/get/structure');
      const data = response.data;
      setStructureList(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des structures:', error);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (isUpdating && updateProfileId) {
        // Effectuer une mise à jour
        const response = await axios.put(`http://localhost:4002/api/update/profile/${updateProfileId}`, formData);
        const updatedProfile = response.data as Profile;
        setProfileList((prevProfileList) =>
          prevProfileList.map((profile) => (profile.id === updateProfileId ? updatedProfile : profile))
        );
        setMessage('Profil mis à jour avec succès');
        setUpdateProfileId(null);
        setIsUpdating(false);
      } else {
        // Effectuer une création
        const response = await axios.post('http://localhost:4002/api/create/profile', formData);
        const newProfile = response.data as Profile;
        setProfileList((prevProfileList) => [...prevProfileList, newProfile]);
        setMessage('Profil ajouté avec succès');
      }
      // Réinitialiser le formulaire après l'opération
      setFormData({
        email: '',
        mdp: '',
        fonction: '',
        structure: '',
      });
    } catch (error) {
      console.error('Erreur lors de la manipulation du profil:', error);
      setMessage('Erreur lors de la manipulation du profil');
    }
  }

  async function onDelete(profileId: string) {
    try {
      await axios.delete(`http://localhost:4002/api/delete/profile/${profileId}`);
      setProfileList((prevProfileList) => prevProfileList.filter((profile) => profile.id !== profileId));
      setMessage('Profil supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du profil:', error);
      setMessage('Erreur lors de la suppression du profil');
    }
  }

  function onUpdate(profileId: string) {
    // Récupérer le profil à mettre à jour et remplir le formulaire
    const profileToUpdate = profileList.find((profile) => profile.id === profileId);
    if (profileToUpdate) {
      setFormData({
        email: profileToUpdate.email,
        mdp: profileToUpdate.mdp,
        fonction: profileToUpdate.fonction,
        structure: profileToUpdate.structure,
      });
      setUpdateProfileId(profileId);
      setIsUpdating(true);
    }
  }

  return (
    <div className='home h-screen w-[100%]'>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black mb-2">Gestion des Profils</h2>
        <table className="w-full border border-gray-400 text-black bg-white shadow">
          <thead>
            <tr>
              <th className="border px-1 py-2">ID Profil</th>
              <th className="border px-1 py-2">Email</th>
              <th className="border px-1 py-2">Mot de passe</th>
              <th className="border px-1 py-2">Fonction</th>
              <th className="border px-1 py-2">Structure</th>
              <th className="border px-1 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profileList.map((profile) => (
              <tr key={profile.id}>
                <td className="border px-1 py-2">{profile.id}</td>
                <td className="border px-1 py-2">{profile.email}</td>
                <td className="border px-1 py-2">{profile.mdp}</td>
                <td className="border px-1 py-2">{profile.fonction}</td>
                <td className="border px-1 py-2">{profile.structure}</td>
                <td className="border px-1 py-2">
                  <button
                    onClick={() => onUpdate(profile.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(profile.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form onSubmit={onSubmit} className="border text-black bg-gray-200 border-gray-600 w-[50%] ml-[25%] shadow-md rounded-md p-4">
        <input
          className="border border-gray-400 p-2 mb-2 rounded-md w-full"
          type="text"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          className="border border-gray-400 p-2 mb-2 rounded-md w-full"
          type="text"
          placeholder="Mot de passe"
          value={formData.mdp}
          onChange={(e) => setFormData({ ...formData, mdp: e.target.value })}
          required
        />
       <select
          className="border border-gray-400 p-2 mb-2 rounded-md w-full"
          value={formData.fonction}
          onChange={(e) => setFormData({ ...formData, fonction: e.target.value })}
          required
        >
          <option value="">Sélectionnez une fonction</option>
         
            <option   value="citoyen"> Citoyen</option>
            <option   value="gerant"> Gerant Administratif</option>
            <option   value="admin">Administrateur</option> 

          
        </select>
        <select
          className="border border-gray-400 p-2 mb-2 rounded-md w-full"
          value={formData.structure}
          onChange={(e) => setFormData({ ...formData, structure: e.target.value })}
          required
        >
          <option value="">Sélectionnez une structure</option>
          {structureList.map((structure) => (
            <option key={structure.id} value={structure.nomStructure}>{structure.nomStructure}</option>
          ))}
        </select>
        <button
          className={`bg-${isUpdating ? 'blue' : 'gray'}-900 hover:bg-${isUpdating ? 'blue' : 'gray'}-700 text-white font-bold py-2 px-4 rounded-md w-full`}
          type="submit"
        >
          {isUpdating ? 'Modifier' : 'Ajouter'}
        </button>
      </form>
      {message && <p className="text-red-500 mt-2">{message}</p>}
    </div>
  );
}
