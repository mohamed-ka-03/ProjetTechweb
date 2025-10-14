'use client';
import { useAuth } from '../../usecontext';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from 'next-auth/react';
import Image from "next/image";
import axios from 'axios'; // Import axios
import imagess from '../../../public/public/google.png';

import Header from '@/app/Header/[[...header]]/page';

import React, { useState } from 'react';
import { signIn } from "next-auth/react";
 
export default function Login() {
  const { setEmail } = useAuth();
  const [email, setEemail] = useState('');
  const [mdp, setPassword] = useState('');
  // Initialize useRouter
  const router = useRouter();
  // Use useSession to access session data
  const { data: session } = useSession();
  // Function to handle form submission
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // Prevent default form submission
    console.log(mdp)
    // Use axios for API call
    try {
      const response = await axios.post('http://localhost:4002/api/verif/compte', {
        email,
        mdp,
      });

      const data = response.data;
      setEmail(email);
      router.push(`/citoyen/home?email=${email}`);
        toast.success('Connexion reussi');
   
  
    } catch (error) {
      console.error('Login error:', error);
      toast.error('echec lors de la connexion');
    }
  };
   
    return (
      <>
        <Header />
        <section className="relative bg-[#f2f6f6] overflow-y-hidden">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">

            <div className="grid grid-cols-1 items-center gap-8 sm:gap-20 lg:grid-cols-2">
              <div className="flex-1 bg-[#09072d00] text-center hidden lg:flex">
                <div className="img m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat">
                  <img src="/public/undraw_secure_login_pdn4.svg" alt="" />

                </div>
              </div>


              <div className="mt-12 flex flex-col items-center">
                <h1 className="text-2xl xl:text-3xl text-black font-extrabold">
                  Sign IN
                </h1>

                <div className="w-full flex-1 mt-8">
                  <form onSubmit={handleSubmit}>
                    <div className="mx-auto max-w-xs">
                      <input
                        className="w-full px-8 py-4 rounded-lg text-black font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        type="email" placeholder="Email" name='emaila' value={email}
                        onChange={(e) => setEemail(e.target.value )} />
                      <input
                        className="w-full px-8 py-4 text-black rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                        type="password" placeholder="Password" name='mdp' value={mdp}
                        onChange={(e) => setPassword(e.target.value )} />
                      <button
                      type="submit"
                        className="mt-5 tracking-wide font-semibold bg-[#0a0822] text-gray-100 w-full py-4 rounded-lg hover:bg-[#0c0b1c] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>

                        <span className="ml-3">
                          Sign In
                        </span>
                      </button>
                    </div>
                  </form>
                  <div className="my-12 border-b text-center">
                    <div
                      className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                      Or sign Up if u have not a account
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <button onClick={() => signIn('google')}
                      className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-[#0a0822] text-white flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                      <div className="bg-white p-2 rounded-full">
                        <Image src={imagess} alt="Google Logo" width={24} height={24} />
                      </div>
                      <span className="ml-4">
                        Sign With Google
                      </span>
                    </button>
                  </div>



                </div>
              </div>

              <ToastContainer />
            </div>
          </div>
        </section>
      </>
    )
 
}