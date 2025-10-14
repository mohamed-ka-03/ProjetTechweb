import React from 'react'
import Dashboard from '../../dashboard/[[...dashboard]]/page'
import "../../../globals.css"
import HomeS from './Home'
 
export default function structure() {
  return (
    <div>
                     <Dashboard Component={HomeS} />


    </div>
  )
}
