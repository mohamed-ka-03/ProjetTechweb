import React from 'react'
import "../../../globals.css"
import Dashboard from '../../dashboard/[[...dashboard]]/page'
import Historique from './Historique'
export default function pageHisto() {
  return (
    <div>
         <Dashboard Component={Historique} />
    </div>
  )
}
