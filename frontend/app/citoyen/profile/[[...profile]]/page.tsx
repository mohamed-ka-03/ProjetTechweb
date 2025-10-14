'use client'
import React from 'react';
import dynamic from 'next/dynamic';
import Dashboard from '../../dashboard/[[...dashboard]]/page';
import "../../../globals.css";

// Dynamically import HomeCP with SSR disabled
const HomeCP = dynamic(() => import('./Home'), { ssr: false });

export default function profile() {
  return (
    <div>
      <Dashboard Component={HomeCP} />
    </div>
  );
}