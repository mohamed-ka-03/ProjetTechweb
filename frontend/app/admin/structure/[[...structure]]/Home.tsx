'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';

interface Structure {
  id: string;
  nomStructure: string;
  address: string;
}

export default function HomeS() {
  const [structureList, setStructureList] = useState<Structure[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nomStructure: '',
    address: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStructureId, setUpdateStructureId] = useState<string | null>(null);

  useEffect(() => {
    fetchStructures();
  }, []);

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
      if (isUpdating && updateStructureId) {
        // Effectuer une mise à jour de la structure existante
        const response = await axios.put(`http://localhost:4002/api/update/structure/${updateStructureId}`, formData);
        const updatedStructure = response.data as Structure;
        setStructureList((prevStructureList) =>
          prevStructureList.map((structure) => (structure.id === updateStructureId ? updatedStructure : structure))
        );
        setMessage('Structure mise à jour avec succès');
        setUpdateStructureId(null);
        setIsUpdating(false);
      } else {
        // Effectuer une création d'une nouvelle structure
        const response = await axios.post('http://localhost:4002/api/create/structure', formData);
        const newStructure = response.data as Structure;
        setStructureList((prevStructureList) => [...prevStructureList, newStructure]);
        setMessage('Structure ajoutée avec succès');
      }
      // Réinitialiser le formulaire après l'opération
      setFormData({
        nomStructure: '',
        address: '',
      });
    } catch (error) {
      console.error('Erreur lors de la manipulation de la structure:', error);
      setMessage('Erreur lors de la manipulation de la structure');
    }
  }

  async function onDelete(structureId: string) {
    try {
      await axios.delete(`http://localhost:4002/api/delete/structure/${structureId}`);
      setStructureList((prevStructureList) => prevStructureList.filter((structure) => structure.id !== structureId));
      setMessage('Structure supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de la structure:', error);
      setMessage('Erreur lors de la suppression de la structure');
    }
  }

  function onUpdate(structureId: string) {
    // Récupérer la structure à mettre à jour et pré-remplir le formulaire
    const structureToUpdate = structureList.find((structure) => structure.id === structureId);
    if (structureToUpdate) {
      setFormData({
        nomStructure: structureToUpdate.nomStructure,
        address: structureToUpdate.address,
      });
      setUpdateStructureId(structureId);
      setIsUpdating(true);
    }
  }

  return (
    <div className='home h-screen w-[100%]'>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black mb-2">Gestion des Structures</h2>
        <table className="w-full border border-gray-400 text-black bg-white shadow">
          <thead>
            <tr>
              <th className="border px-1 py-2">ID Structure</th>
              <th className="border px-1 py-2">Nom Structure</th>
              <th className="border px-1 py-2">Adresse</th>
              <th className="border px-1 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {structureList.map((structure) => (
              <tr key={structure.id}>
                <td className="border px-1 py-2">{structure.id}</td>
                <td className="border px-1 py-2">{structure.nomStructure}</td>
                <td className="border px-1 py-2">{structure.address}</td>
                <td className="border px-1 py-2">
                  <button
                    onClick={() => onUpdate(structure.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(structure.id)}
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
          placeholder="Nom du Structure"
          name="nomStructure"
          value={formData.nomStructure}
          onChange={(e) => setFormData({ ...formData, nomStructure: e.target.value })}
          required
        />
        <input
          className="border border-gray-400 p-2 mb-2 rounded-md w-full"
          type="text"
          placeholder="Adresse"
          name="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
        <button
          className={`bg-${isUpdating ? 'blue' : 'gray'}-900 hover:bg-${isUpdating ? 'blue' : 'gray'}-700 text-white font-bold py-2 px-4 rounded-md w-full`}
          type="submit"
        >
          {isUpdating ? 'Modifier' : 'Ajouter'}
        </button>
      </form>
      {message && <p className="text-blue-900 ml-96 mt-2">{message}</p>}
    </div>
  );
}
