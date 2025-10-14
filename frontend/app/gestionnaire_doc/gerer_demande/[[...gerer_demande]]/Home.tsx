'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Demande {
  _id: string;
  nomDemandeur: string;
  prenomsDemandeur: string;
  typeDocument: string;
  dateDemande: string;
  etatDemande: string;
  numeroIdentification: string;  
}

const HomeCC = () => {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentDemande, setCurrentDemande] = useState<Demande | null>(null);
  const [signature, setSignature] = useState('');

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      const response = await axios.get<Demande[]>('http://localhost:4002/api/get/dm/extrait');
      setDemandes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
    }
  };

  const openModal = (demande: Demande) => {
    setCurrentDemande(demande);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSignature('');
  };

  const handleTraiterDemande = async () => {
    if (!currentDemande) return;

    try {
      const response = await axios.put(`http://localhost:4002/api/traiter/dm/${currentDemande._id}`, {
        signatureOfficierEtatCivil: signature,
        numeroIdentification: currentDemande.numeroIdentification, // Utilisation du numeroIdentification ici
      });
      toast.success('Demande traitée avec succès!');
      closeModal();
      fetchDemandes();
    } catch (error) {
      console.error('Erreur lors du traitement de la demande:', error);
      toast.error('Erreur lors du traitement de la demande.');
    }
  };

  const handleDownloadPDF = async (demandeId: string, etatDemande: string) => {
    if (etatDemande !== 'terminé') {
      toast.error('Document non traité');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4002/api/dm/${demandeId}/pdf`, {
        responseType: 'blob',
      });
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(pdfBlob, `Demande-${demandeId}.pdf`);
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF', error);
      toast.error('Erreur lors du téléchargement du PDF.');
    }
  };

  const handleRejectDemande = async (demandeId: string) => {
    try {
      const response = await axios.delete(`http://localhost:4002/api/reject/dm/${demandeId}`);
      toast.success('Demande rejetée avec succès!');
      fetchDemandes();
    } catch (error) {
      console.error('Erreur lors du rejet de la demande:', error);
      toast.error('Erreur lors du rejet de la demande.');
    }
  };

  return (
    <div className='home h-screen text-black w-[100%]'>
      <div className='ml-80 text-black text-4xl'>
        Page demande Document
      </div>
      <div className='home mt-8'>
        <h2 className='text-2xl font-bold mb-4'>Liste des Demandes</h2>
        <ul className='space-y-4'>
          {demandes.map((demande) => (
            <li key={demande._id} className='border p-4 rounded-md'>
              <div>
                <h3 className='text-xl font-semibold'>{demande.nomDemandeur} {demande.prenomsDemandeur}</h3>
                <p>{demande.typeDocument}</p>
                <p>Date de demande: {new Date(demande.dateDemande).toLocaleDateString()}</p>
                <p>État: {demande.etatDemande}</p>
                <p>Numéro d`Identification: {demande.numeroIdentification}</p> {/* Affichage du numéro d'identification */}
              </div>
              <div>
                <button
                  className='bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md'
                  onClick={() => openModal(demande)}
                >
                  Traiter Demande
                </button>
                <button
                  className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md ml-4'
                  onClick={() => handleDownloadPDF(demande._id, demande.etatDemande)}
                >
                  Télécharger PDF
                </button>
                <button
                  className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md ml-4'
                  onClick={() => handleRejectDemande(demande._id)}
                >
                  Rejeter Demande
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modifier la Signature"
        className="modal text-black"
        overlayClassName="overlay"
      >
        <h2>Modifier la Signature</h2>
        <input
          type="text"
          placeholder="Nouvelle Signature"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4'
          onClick={handleTraiterDemande}
        >
          Confirmer
        </button>
        <button
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md mt-4 ml-4'
          onClick={closeModal}
        >
          Annuler
        </button>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default HomeCC;
