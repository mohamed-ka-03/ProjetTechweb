'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const getSessionData = () => {
  // Assuming session data is stored as a JSON string
  const sessionDataString = localStorage.getItem('sessionData');
  if (sessionDataString) {
    return JSON.parse(sessionDataString);
  }
  return null; // or a default value
};
const Historique: React.FC = () => {
  const [demandes, setDemandes] = useState<any[]>([]);
  const [sessionData, setSessionData] = useState<any>(null);
  const [email, setEmail] = useState('');

  // Étape 2: Utiliser useEffect pour lire l'email depuis le localStorage
 
  
   

      useEffect(() => {  const email = localStorage.getItem('email');  
        setSessionData(getSessionData());
        const fetchDemandes = async () => {   
          try { console.log(email)
            const response = await axios.post('http://localhost:4002/api/get/dm/extraitc', {email});
            
            setDemandes(response.data)
            console.log(response.data)
          } catch (error) { toast.error('Pas de demandes .');
            console.error('Erreur lors de la récupération des demandes', error);
          }
        };

        fetchDemandes();
      }, []);
  
  const handleDownloadPDF = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:4002/api/dm/${id}/pdf`, {
        responseType: 'blob',
      });
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(pdfBlob, `Demande-${id}.pdf`);
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF', error);
    }
  };

  return (
    <div className='home h-screen text-black w-full p-8'>
      <h2 className='text-4xl mb-8'>Liste des Demandes</h2>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b'>Nom</th>
              <th className='py-2 px-4 border-b'>Prénoms</th>
              <th className='py-2 px-4 border-b'>Email</th>
              <th className='py-2 px-4 border-b'>Téléphone</th>
              <th className='py-2 px-4 border-b'>Adresse</th>
              <th className='py-2 px-4 border-b'>Type de Document</th>
              <th className='py-2 px-4 border-b'>État</th>
              <th className='py-2 px-4 border-b'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((demande) => (
              <tr key={demande._id} className={`text-center ${demande.etatDemande === 'Complété' ? 'bg-green-200' : demande.etatDemande === 'Rejeté' ? 'bg-red-200' : 'bg-yellow-200'}`}>
                <td className='py-2 px-4 border-b'>{demande.nomDemandeur}</td>
                <td className='py-2 px-4 border-b'>{demande.prenomsDemandeur}</td>
                <td className='py-2 px-4 border-b'>{demande.emailDemandeur}</td>
                <td className='py-2 px-4 border-b'>{demande.telephoneDemandeur}</td>
                <td className='py-2 px-4 border-b'>{demande.adresseDemandeur}</td>
                <td className='py-2 px-4 border-b'>{demande.typeDocument}</td>
                <td className='py-2 px-4 border-b'>{demande.etatDemande}</td>
                <td className='py-2 px-4 border-b'>
                  <button onClick={() => handleDownloadPDF(demande._id)} className='bg-blue-500 text-white p-2 rounded-md'>
                    Télécharger PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>  <ToastContainer />
    </div>
  );
};

export default Historique;
