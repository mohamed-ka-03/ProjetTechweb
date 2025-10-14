'use client'
import Header from '@/app/Header/[[...header]]/page'
import React from 'react'
import Dashboard from '../../dashboard/[[...dashboard]]/page'
import HomeCC from './Home'
import { useSession } from 'next-auth/react'
import Login from '@/app/sign-in/[[...sign-in]]/page'


export default function HomeC() { 
  return (  
          <div>    
              <Dashboard Component={HomeCC} />
              
          </div>
   
  )
}
