'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';

interface Document {
  id: string;
  nomDocument: string;
  typeDocument: string;
}

export default function HomeD() {
  const [documentList, setDocumentList] = useState<Document[]>([]);
  const [formData, setFormData] = useState({
    id: '',
    nomDocument: '',
    typeDocument: '',
  });
  const [message, setMessage] = useState<string | null>(null);

  async function fetchDocuments() {
    try {
      const response = await axios.get<Document[]>('http://localhost:4002/api/get/doc');
      const data = response.data;
      setDocumentList(data); // Mise à jour de l'état avec les documents récupérés
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
    }
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (formData.id) {
        // Si formData.id existe, cela signifie que nous sommes en mode édition
        await axios.put(`http://localhost:4002/api/update/doc/${formData.id}`, {
          nomDocument: formData.nomDocument,
          typeDocument: formData.typeDocument,
        });
        setMessage('Document mis à jour avec succès');
        // Actualiser la liste des documents après la mise à jour
        fetchDocuments();
      } else {
        // Sinon, nous sommes en mode création
        const response = await axios.post<Document>('http://localhost:4002/api/create/doc', {
          nomDocument: formData.nomDocument,
          typeDocument: formData.typeDocument,
        });
        const newDoc = response.data;
        setDocumentList((prevDocumentList) => [...prevDocumentList, newDoc]); // Ajout du nouveau document à la liste
        setMessage('Document ajouté avec succès');
      }
      // Réinitialiser le formulaire après soumission
      setFormData({
        id: '',
        nomDocument: '',
        typeDocument: '',
      });
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      setMessage('Erreur lors de la soumission du formulaire');
    }
  }

  async function onDelete(docId: string) {
    try {
      await axios.delete(`http://localhost:4002/api/delete/doc/${docId}`);
      setDocumentList((prevDocumentList) => prevDocumentList.filter((doc) => doc.id !== docId)); // Supprimer le document de la liste
      setMessage('Document supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
      setMessage('Erreur lors de la suppression du document');
    }
  }

  const onUpdate = (id: string) => {
    // Recherche du document à éditer dans la liste actuelle de documents
    const documentToUpdate = documentList.find(doc => doc.id === id);
  
    if (documentToUpdate) {
      // Mise à jour du formulaire avec les détails du document à éditer
      setFormData({
        id: documentToUpdate.id,
        nomDocument: documentToUpdate.nomDocument,
        typeDocument: documentToUpdate.typeDocument,
      });
    } else {
      console.error(`Document with ID ${id} not found`);
    }
  };

  return (
    <div className='home h-screen w-[100%]'>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black mb-2">Gestion des Documents</h2>
        <table className="w-full border border-gray-400 text-black bg-white shadow">
          <thead>
            <tr>
              <th className="border px-1 py-2">ID Document</th>
              <th className="border px-1 py-2">Nom Document</th>
              <th className="border px-1 py-2">Type Document</th>
              <th className="border px-1 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documentList.map((doc) => (
              <tr key={doc.id}>
                <td className="border px-1 py-2">{doc.id}</td>
                <td className="border px-1 py-2">{doc.nomDocument}</td>
                <td className="border px-1 py-2">{doc.typeDocument}</td>
                <td className="border px-1 py-2">
                  <button
                    onClick={() => onDelete(doc.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={() => onUpdate(doc.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form onSubmit={onSubmit} className="border bg-gray-200 border-gray-600 w-[50%] ml-[25%] text-black shadow-md rounded-md p-4">
        <input
          className="border border-gray-400 p-2 mb-2 rounded-md w-full"
          type="text"
          name="nomDocument"
          placeholder="Nom du document"
          value={formData.nomDocument}
          onChange={(e) => setFormData({ ...formData, nomDocument: e.target.value })}
          required
        />
        <input
          className="border border-gray-400 p-2 mb-2 rounded-md w-full"
          type="text"
          name="typeDocument"
          placeholder="Type de document"
          value={formData.typeDocument}
          onChange={(e) => setFormData({ ...formData, typeDocument: e.target.value })}
          required
        />
        <button
          className="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md w-full"
          type="submit"
        >
          {formData.id ? 'Modifier' : 'Ajouter'}
        </button>
      </form>
      {message && <p className="text-red-500 mt-2">{message}</p>}
    </div>
  );
}
