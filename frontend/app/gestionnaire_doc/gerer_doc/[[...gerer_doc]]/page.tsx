import Header from '@/app/Header/[[...header]]/page'
import React from 'react'
import Dashboard from '../../dashboard/[[...dashboard]]/page'
import HomeCC from './Home'


export default function HomeC() {
  return (
    <div>
        <Dashboard Component={HomeCC} />
        
    </div>
  )
}
