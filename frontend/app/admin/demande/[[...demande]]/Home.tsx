'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';

interface Demande {
  _id: string;
  nomDemandeur: string;
  prenomsDemandeur: string;
  typeDocument: string;
  dateDemande: string;
  etatDemande: string;
  numeroIdentification: string;
  cni: string;
  dateDelivrance: string;
  lieuDelivrance: string;
}

export default function HomeD() {
  const [demandeList, setDemandeList] = useState<Demande[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nomDemandeur: '',
    prenomsDemandeur: '',
    typeDocument: '',
    dateDemande: '',
    etatDemande: '',
    numeroIdentification: '',
    cni: '',
    dateDelivrance: '',
    lieuDelivrance: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateDemandeId, setUpdateDemandeId] = useState<string | null>(null);

  useEffect(() => {
    fetchDemandes();
  }, []);

  async function fetchDemandes() {
    try {
      const response = await axios.get<Demande[]>('http://localhost:4002/api/get/demande');
      const data = response.data;
      setDemandeList(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (isUpdating && updateDemandeId) {
        // Effectuer une mise à jour de la demande existante
        const response = await axios.put(`http://localhost:4002/api/update/demande/${updateDemandeId}`, formData);
        const updatedDemande = response.data as Demande;
        setDemandeList((prevDemandeList) =>
          prevDemandeList.map((demande) => (demande._id === updateDemandeId ? updatedDemande : demande))
        );
        setMessage('Demande mise à jour avec succès');
        setUpdateDemandeId(null);
        setIsUpdating(false);
      } else {
        // Effectuer une création d'une nouvelle demande
        const response = await axios.post('http://localhost:4002/api/create/demande', formData);
        const newDemande = response.data as Demande;
        setDemandeList((prevDemandeList) => [...prevDemandeList, newDemande]);
        setMessage('Demande ajoutée avec succès');
      }
      // Réinitialiser le formulaire après l'opération
      setFormData({
        nomDemandeur: '',
        prenomsDemandeur: '',
        typeDocument: '',
        dateDemande: '',
        etatDemande: '',
        numeroIdentification: '',
        cni: '',
        dateDelivrance: '',
        lieuDelivrance: '',
      });
    } catch (error) {
      console.error('Erreur lors de la manipulation de la demande:', error);
      setMessage('Erreur lors de la manipulation de la demande');
    }
  }

  async function onDelete(demandeId: string) {
    try {
      await axios.delete(`http://localhost:4002/api/delete/demande/${demandeId}`);
      setDemandeList((prevDemandeList) => prevDemandeList.filter((demande) => demande._id !== demandeId));
      setMessage('Demande supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de la demande:', error);
      setMessage('Erreur lors de la suppression de la demande');
    }
  }

  function onUpdate(demandeId: string) {
    // Récupérer la demande à mettre à jour et pré-remplir le formulaire
    const demandeToUpdate = demandeList.find((demande) => demande._id === demandeId);
    if (demandeToUpdate) {
      setFormData({
        nomDemandeur: demandeToUpdate.nomDemandeur,
        prenomsDemandeur: demandeToUpdate.prenomsDemandeur,
        typeDocument: demandeToUpdate.typeDocument,
        dateDemande: demandeToUpdate.dateDemande,
        etatDemande: demandeToUpdate.etatDemande,
        numeroIdentification: demandeToUpdate.numeroIdentification,
        cni: demandeToUpdate.cni,
        dateDelivrance: demandeToUpdate.dateDelivrance,
        lieuDelivrance: demandeToUpdate.lieuDelivrance,
      });
      setUpdateDemandeId(demandeId);
      setIsUpdating(true);
    }
  }

  return (
    <div className='home h-screen w-[100%]'>
      <div className="home  mb-8">
        <h2 className="text-2xl font-bold text-black mb-2">Gestion des Demandes</h2>
        <table className="w-full border border-gray-400 text-black bg-white shadow">
          <thead>
            <tr>
              <th className="border px-1 py-2">ID Demande</th>
              <th className="border px-1 py-2">Nom Demandeur</th>
              <th className="border px-1 py-2">Prénoms Demandeur</th>
              <th className="border px-1 py-2">Type Document</th>
              <th className="border px-1 py-2">Date Demande</th>
              <th className="border px-1 py-2">Etat Demande</th>
              <th className="border px-1 py-2">Numéro Identification</th>
   
              <th className="border px-1 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {demandeList.map((demande) => (
              <tr key={demande._id}>
                <td className="border px-1 py-2">{demande._id}</td>
                <td className="border px-1 py-2">{demande.nomDemandeur}</td>
                <td className="border px-1 py-2">{demande.prenomsDemandeur}</td>
                <td className="border px-1 py-2">{demande.typeDocument}</td>
                <td className="border px-1 py-2">{new Date(demande.dateDemande).toLocaleDateString()}</td>
                <td className="border px-1 py-2">{demande.etatDemande}</td>
                <td className="border px-1 py-2">{demande.numeroIdentification}</td>
 
                <td className="border px-1 py-2">
                  <button
                    onClick={() => onUpdate(demande._id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(demande._id)}
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
          placeholder="Nom du Demandeur"
          name="nomDemandeur"
          value={formData.nomDemandeur}
          onChange={(e) => setFormData({ ...formData, nomDemandeur: e.target.value })}
          required
        />
        <input
          className="border border-gray-400 p-2 mb-2 rounded-md w-full"
          type="text"
          placeholder="Prénoms du Demandeur"
          name="prenomsDemandeur"
          value={formData.prenomsDemandeur}
          onChange={(e) => setFormData({ ...formData, prenomsDemandeur: e.target.value })}
          required
        />
        <input
          className="border border-gray-400 p-2 mb-2 rounded-md w-full"
          type="text"
          placeholder="Type de Document"
          name="typeDocument"
          value={formData.typeDocument}
          onChange={(e) => setFormData({ ...formData, typeDocument: e.target.value })}
          required
        />
        <input
          className="border border-gray-400 p-2 mb-2 rounded-md w-full"
          type="date"
          placeholder="Date de la Demande"
          name="dateDemande"
          value={formData.dateDemande}
          onChange={(e) => setFormData({ ...formData, dateDemande: e.target.value })}
          required
        />
        <input
          className="border border-gray-400 p-2 mb-2 rounded-md w-full"
          type="text"
          placeholder="Etat de la Demande"
          name="etatDemande"
          value={formData.etatDemande}
          onChange={(e) => setFormData({ ...formData, etatDemande: e.target.value })}
          required
        />
        <input
          className="border border-gray-400 p-2 mb-2 rounded-md w-full"
          type="text"
          placeholder="Numéro d'Identification"
          name="numeroIdentification"
          value={formData.numeroIdentification}
          onChange={(e) => setFormData({ ...formData, numeroIdentification: e.target.value })}
          required
        />
        <input
          className="border border-gray-400 p-2 mb-2 rounded-md w-full"
          type="text"
          placeholder="CNI"
          name="cni"
          value={formData.cni}
          onChange={(e) => setFormData({ ...formData, cni: e.target.value })}
          required
        />
        <input
          className="border border-gray-400 p-2 mb-2 rounded-md w-full"
          type="date"
          placeholder="Date de Délivrance"
          name="dateDelivrance"
          value={formData.dateDelivrance}
          onChange={(e) => setFormData({ ...formData, dateDelivrance: e.target.value })}
          required
        />
        <input
          className="border border-gray-400 p-2 mb-2 rounded-md w-full"
          type="text"
          placeholder="Lieu de Délivrance"
          name="lieuDelivrance"
          value={formData.lieuDelivrance}
          onChange={(e) => setFormData({ ...formData, lieuDelivrance: e.target.value })}
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
