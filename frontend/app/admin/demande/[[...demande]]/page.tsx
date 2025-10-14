import React from 'react'
import Dashboard from '../../dashboard/[[...dashboard]]/page'
import "../../../globals.css"
import HomeDe from './Home'
export default function pageDemande() {
  return (
    <div>
                 <Dashboard Component={HomeDe} />
    </div>
  )
}
