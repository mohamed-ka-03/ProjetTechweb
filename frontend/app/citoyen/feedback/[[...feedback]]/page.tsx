'use client'
import React from 'react'
import Dashboard from '../../dashboard/[[...dashboard]]/page'
 
import dynamic from 'next/dynamic';
const Feedback = dynamic(() => import('./Feedback'), { ssr: false });
export default function PageFeedback() {
  return (
    <div>
       <Dashboard Component={Feedback} />
    </div>
  )
}
