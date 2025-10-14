'use client'
import Image from "next/image";
import images from  '../../../public/public/images/Website-PNG.png'
import Header from '@/app/Header/[[...header]]/page';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { FormEvent, useState } from 'react'
import axios from "axios";
interface Compte{
  id: string;
  nom: string;
  prenom: string;
  cni:string;
  email:string;
  mdp:string;
  pathPhoto:string;

}

export default function Inscription() {
  const [CompteList, setCompteList] = useState<Compte[]>([]);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    cni: '',
    email: '',
    mdp: '',
    pathPhoto:'' // string | null
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: { target: { files: any[]; }; }) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, pathPhoto: file });
      setImagePreviewUrl(URL.createObjectURL(file)); // Create a preview URL
    }
  };
  const onSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('nom', formData.nom);
    formDataToSend.append('prenom', formData.prenom);
    formDataToSend.append('cni', formData.cni);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('mdp', formData.mdp);
    if (formData.pathPhoto) formDataToSend.append('pathPhoto', formData.pathPhoto);
  console.log(formData )
    try {
      const response = await axios.post('http://localhost:4002/api/create/compte', formData);  
       console.log(response.data)
       toast.success('Inscription reussi');
       setFormData({
        nom: '',
        prenom: '',
        cni: '',
        email: '',
        mdp: '',
        pathPhoto:'' 
       })
    } catch (error) {
      toast.error('Erreur lors de l inscription');

    }
  };
  return (
    <>
      <Header />
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
              <div>
          
              </div>
              <div className="mt-12 flex flex-col items-center">
                  <h1 className="text-2xl xl:text-3xl font-extrabold">
                      Sign up
                  </h1>
                  <div className="w-full flex-1 mt-8">
                      <div  className="flex flex-col items-center">
                        
                      </div>

                      <div  className="my-12 border-b text-center">
                          <div  className="leading-none px-2  inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                              <div className=" rounded-full bg-black w-20 h-20" >
                              <div className="rounded-full bg-black w-20 h-20">
                                {imagePreviewUrl && <img src={imagePreviewUrl} className="w-full h-full rounded-full object-cover" />}
                              </div>
                              </div>
                          </div>
                      </div>
                  <form onSubmit={onSubmit}>
                  <div className="mx-auto max-w-xs p-5">
                            <input
                              className="w-full px-8 py-4 p-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                              type="text" placeholder="Nom"  name="nom" value={formData.nom}
                              onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                            <input
                              className="w-full  mt-4  px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                              type="text" placeholder="Prenom"  name="prenom" value={formData.prenom}
                              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}/>
                            <input
                              className="w-full px-8 py-4  mt-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white" mt-4 
                              type="text" placeholder="CNI"  name="cni" value={formData.cni}
                              onChange={(e) => setFormData({ ...formData, cni: e.target.value })}/>
                            <input
                              className="w-full px-8 py-4 mt-4  rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white" mt-4 
                              type="email" placeholder="Email"  name="email " value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
                            <input
                              className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                              type="password" placeholder="Password"  name="mdp" value={formData.mdp}
                              onChange={(e) => setFormData({ ...formData, mdp: e.target.value })}/>
                            <input
                                className="w-full px-8 py-4 mt-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="file"
                                    placeholder="Upload photo"
                                    accept="image/*" name="pathPhoto"
                                    onChange={()=>handleFileChange}
                                  />
                          <button
                              className="mt-5 tracking-wide font-semibold bg-gray-900 text-gray-100 w-full py-4 rounded-lg hover:bg-[#111111e1] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                              <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2"
                                  strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                  <circle cx="8.5" cy="7" r="4" />
                                  <path d="M20 8v6M23 11h-6" />
                              </svg>
                              <span className="ml-3">
                                  Sign Up
                              </span>
                          </button>
              
                      </div>
                  </form>
                      
                  </div>
              </div>
          </div>
          <div className="flex-1 bg-[#09072d00] text-center hidden lg:flex">
              <div className="img m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat flex items-center ">
              <img src="/public/undraw_sign_up_n6im.svg" alt="" />
              </div>
          </div>
          <ToastContainer />
      </div>
    </div>
    </>
  )
}
