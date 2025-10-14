'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the type for the form data
interface FormData {
  nom: string;
  prenoms: string;
  dateNaissance: string;
  lieuNaissance: string;
  nomPere: string;
  prenomsPere: string;
  nomMere: string;
  prenomsMere: string;
  sexe: string;
  numeroIdentification: string;
  cni: string;
  dateDelivrance: string;
  lieuDelivrance: string;
  signatureOfficierEtatCivil: string;
  emailDemandeur: string;
  telephoneDemandeur: string;
  adresseDemandeur: string;
  typeDocument: string;
  [key: string]: string; // Index signature
}

const ExtraitForm: React.FC = () => {
  const initialFormData: FormData = {
    nom: '',
    prenoms: '',
    dateNaissance: '',
    lieuNaissance: '',
    nomPere: '',
    prenomsPere: '',
    nomMere: '',
    prenomsMere: '',
    sexe: '',
    numeroIdentification: '',
    cni: '',
    dateDelivrance: '',
    lieuDelivrance: '',
    signatureOfficierEtatCivil: 'pas encore',
    emailDemandeur: '',
    telephoneDemandeur: '',
    adresseDemandeur: '',
    typeDocument: 'Extrait de Naissance'
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4002/api/create/dm/extrait', formData);
      toast.success('Extrait de naissance et demande créés avec succès');
      console.log(response.data);
      setFormData(initialFormData); // Réinitialiser le formulaire
    } catch (error) {
      toast.error('Erreur lors de la création de l\'extrait de naissance et de la demande');
      console.error(error);
    }
  };

  return (
    <div className='home h-screen w-full'>
      <div className='home mt-8 text-black'>
        <h2 className='text-2xl font-bold mb-4'>Formulaire de demande d`extrait de naissance</h2>
        <form onSubmit={handleSubmit} className='flex flex-wrap border text-black bg-gray-200 border-gray-600 w-[90%] mx-auto shadow-md rounded-md p-4'>
          {[
            { label: 'Nom', name: 'nom', type: 'text' },
            { label: 'Prénoms', name: 'prenoms', type: 'text' },
            { label: 'Date de Naissance', name: 'dateNaissance', type: 'date' },
            { label: 'Lieu de Naissance', name: 'lieuNaissance', type: 'text' },
            { label: 'Nom du Père', name: 'nomPere', type: 'text' },
            { label: 'Prénoms du Père', name: 'prenomsPere', type: 'text' },
            { label: 'Nom de la Mère', name: 'nomMere', type: 'text' },
            { label: 'Prénoms de la Mère', name: 'prenomsMere', type: 'text' },
            { label: 'Numéro d\'Identification', name: 'numeroIdentification', type: 'text' },
            { label: 'CNI', name: 'cni', type: 'text' },
            { label: 'Date de Délivrance', name: 'dateDelivrance', type: 'date' },
            { label: 'Lieu de Délivrance', name: 'lieuDelivrance', type: 'text' },
            { label: 'Signature de l\'Officier d\'État Civil', name: 'signatureOfficierEtatCivil', type: 'text' ,onchange:'none' },
            { label: 'Email du Demandeur', name: 'emailDemandeur', type: 'email'},
            { label: 'Téléphone du Demandeur', name: 'telephoneDemandeur', type: 'text' },
            { label: 'Adresse du Demandeur', name: 'adresseDemandeur', type: 'text' },
            { label: 'Type de Document', name: 'typeDocument', type: 'text' },
          ].map((field) => (
            <div key={field.name} className='w-1/2 p-2'>
              <label className='block mb-1'>{field.label}</label>
              <input className='border border-gray-400 p-2 rounded-md w-full' type={field.type} name={field.name} value={formData[field.name]} onChange={handleChange} required />
            </div>
          ))}
          <div className='w-1/2 p-2'>
            <label className='block mb-1'>Sexe</label>
            <select className='border border-gray-400 p-2 rounded-md w-full' name='sexe' value={formData.sexe} onChange={handleChange} required>
              <option value=''>Sélectionner le sexe</option>
              <option value='Masculin'>Masculin</option>
              <option value='Féminin'>Féminin</option>
            </select>
          </div>
          <div className='w-full flex justify-end mt-4'>
            <button className='bg-blue-500 text-white p-2 rounded-md' type='submit'>Soumettre Demande</button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}


export default ExtraitForm;
