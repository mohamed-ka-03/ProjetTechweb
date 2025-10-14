'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Document {
  id: string;
  nomDocument: string;
  typeDocument: string;
  champsDynamiques?: { label: string; valeur: string[] }[];
}

const HomeCR: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentList, setDocumentList] = useState<Document[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get<Document[]>('http://localhost:4002/api/get/doc');
      setDocumentList(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
    }
  };

  const handleCloseForm = () => {
    setSelectedDocument(null);
    setMessage(null); // Réinitialiser le message après la fermeture du formulaire
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedDocument) {
      try {
        const response = await axios.post(`http://localhost:4002/api/update/docc/${selectedDocument.id}`, {
          id: selectedDocument.id,
          champsDynamiques: selectedDocument.champsDynamiques,
          
        });
 

        console.log('Document mis à jour:', response.data);
        setMessage('Document mis à jour avec succès');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du document:', error);
        setMessage('Erreur lors de la mise à jour du document');
      }
    }
  };

  const handleInputChange = (label: string, value: string) => {
    const values = value.split(', ').filter(val => val.trim() !== '');
    setSelectedDocument(prevState => {
      if (!prevState) return null;
  
      // Vérifier si prevState.champsDynamiques existe et n'est pas undefined
      if (!prevState.champsDynamiques) {
        return prevState; // Retourner l'état précédent si champsDynamiques est null ou undefined
      }
  
      const updatedChampsDynamiques = prevState.champsDynamiques.map(champ => {
        if (champ.label === label) {
          return { ...champ, valeur: values };
        }
        return champ;
      });
  
      return {
        ...prevState,
        champsDynamiques: updatedChampsDynamiques
      };
    });
  };
  
  return (
    <div className='home h-screen w-full'>
      <div className='mt-8 text-black'>
        <h2 className='text-2xl font-bold mb-4'>Liste des Documents</h2>
        <ul className='space-y-4'>
          {documentList.map((document) => (
            <li key={document.id} className='cursor-pointer'>
              <div
                className='border border-black p-4 rounded-md'
                onClick={() => setSelectedDocument(document)}
              >
                <h3 className='text-xl font-semibold'>{document.nomDocument}</h3>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedDocument && (
        <div className='mt-8 text-black'>
          <h2 className='text-2xl font-bold mb-4'>Formulaire du Document {selectedDocument.nomDocument}</h2>
          <form onSubmit={handleSubmit} className='border text-black bg-gray-200 border-gray-600 w-[50%] ml-[25%] shadow-md rounded-md p-4'>
            {selectedDocument.champsDynamiques?.map((champ, index) => (
              <div key={index} className='mb-4'>
                <label className='block mb-1'>{champ.label}</label>
                <input
                  className='border border-gray-400 p-2 rounded-md w-full'
                  type='text'
                  
                  onChange={(e) => handleInputChange(champ.label, e.target.value)}
                  required
                />
              </div>
            ))}
            <button className='bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md w-full' type='submit'>
              Enregistrer Formulaire
            </button>
            <button
              className='bg-gray-400 hover:bg-gray-600 text-black font-bold py-2 px-4 rounded-md w-full mt-4'
              type='button'
              onClick={handleCloseForm}
            >
              Fermer le Formulaire
            </button>
          </form>
          {message && <div className='mt-4 text-center'>{message}</div>}
        </div>
      )}
    </div>
  );
};

export default HomeCR;
