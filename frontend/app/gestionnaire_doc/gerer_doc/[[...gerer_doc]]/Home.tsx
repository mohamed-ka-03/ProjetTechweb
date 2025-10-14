'use client'
import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';

interface Document {
  id: string;
  nomDocument: string;
  typeDocument: string;
  fieldCount: number; // Nouvelle propriété pour définir le nombre de champs à ajouter
}

interface Field {
  [x: string]: any;
  id: string;
  label: string;
  type: string;
}

export default function HomeCR() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentList, setDocumentList] = useState<Document[]>([]);
  const [newFieldCount, setNewFieldCount] = useState<number>(0); // État pour le nombre de champs à ajouter
  const [formFields, setFormFields] = useState<Field[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const response = await axios.get<Document[]>('http://localhost:4002/api/get/doc');
      setDocumentList(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
    }
  }

  const handleDocumentClick = (id: string) => {
    const selected = documentList.find((doc) => doc.id === id);
    if (selected) {
      setSelectedDocument(selected);
      setFormFields([]); // Réinitialiser les champs précédents
      setNewFieldCount(selected.fieldCount); // Définir le nombre de champs à ajouter
    }
  };

  const handleCloseForm = () => {
    setSelectedDocument(null);
    setFormFields([]); // Réinitialiser les champs du formulaire lorsque le formulaire est fermé
  };

  const handleAddFields = () => {
    if (newFieldCount > 0) {
      const fieldsToAdd: Field[] = [];
      for (let i = 0; i < newFieldCount; i++) {
        fieldsToAdd.push({
          id: `${Date.now()}-${i}`,
          label: `Champ ${i + 1}`,
          type: 'text', // Type par défaut, vous pouvez étendre cela pour supporter différents types de champs
        });
      }
      setFormFields(fieldsToAdd);
    }
  };

  const handleRemoveField = (id: string) => {
    setFormFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (selectedDocument) {
    const updatedDocument = {
      nomDocument: selectedDocument.nomDocument,
      typeDocument: selectedDocument.typeDocument,
      champsDynamiques: formFields.map((field) => ({
        label: field.label,
        valeur: field.value,
      })),
    };

    try {
      // Envoyer updatedDocument à votre backend pour mise à jour ou sauvegarde
      const response = await axios.put(`http://localhost:4002/api/update/doc/${selectedDocument.id}`, updatedDocument);
      console.log('Document mis à jour:', response.data);

      // Réinitialiser les états après la mise à jour réussie
      setSelectedDocument(null);
      setFormFields([]);
      setMessage('Document mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du document:', error);
      setMessage('Erreur lors de la mise à jour du document');
    }
  }
};

  

  return (
    <div className='home h-screen w-[100%] '>
      <div className=' text-black mt-8'>
        <h2 className='text-2xl font-bold mb-4'>Liste des Documents</h2>
        <ul className='space-y-4'>
          {documentList.map((document) => (
            <li key={document.id} className='cursor-pointer'>
              <div
                className='border border-black p-4 rounded-md'
                onClick={() => handleDocumentClick(document.id)}
              >
                <h3 className='text-xl font-semibold'>{document.nomDocument}</h3>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedDocument && (
        <div className=' mt-8 text-black'>
          <h2 className='text-2xl font-bold mb-4'>Formulaire du Document {selectedDocument.nomDocument}</h2>
          <form
            onSubmit={handleSubmit}
            className='border text-black bg-gray-200 border-gray-600 w-[50%] ml-[25%] shadow-md rounded-md p-4'
          >
            {formFields.map((field) => (
              <div key={field.id} className='mb-4'>
                <label className='block mb-1'>{field.label}</label>
                <input
                  className='border border-gray-400 p-2 rounded-md w-full'
                  type={field.type}
                  value={field.label}
                  onChange={(e) =>
                    setFormFields((prevFields) =>
                      prevFields.map((prevField) =>
                        prevField.id === field.id ? { ...prevField, label: e.target.value } : prevField
                      )
                    )
                  }
                  required
                />
                <button
                  type='button'
                  className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-md ml-2'
                  onClick={() => handleRemoveField(field.id)}
                >
                  Supprimer
                </button>
              </div>
            ))}

            <div className='mb-4'>
              <label className='block mb-1'>Nombre de Champs à Ajouter</label>
              <input
                className='border border-gray-400 p-2 rounded-md w-full'
                type='number'
                value={newFieldCount}
                onChange={(e) => setNewFieldCount(parseInt(e.target.value))}
                min={0}
              />
              <button
                type='button'
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-md ml-2'
                onClick={handleAddFields}
              >
                Ajouter Champs
              </button>
            </div>

            <button
              className='bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md w-full'
              type='submit'
            >
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
        </div>
      )}
    </div>
  );
}
