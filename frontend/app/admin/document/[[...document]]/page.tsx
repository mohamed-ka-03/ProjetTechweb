import React from 'react'
import Dashboard from '../../dashboard/[[...dashboard]]/page'
import "../../../globals.css"
import HomeD from './Home'
 

export default function document() {
  return (
    <div>
                     <Dashboard Component={HomeD} />


    </div>
  )
}
