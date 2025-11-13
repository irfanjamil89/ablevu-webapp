import React from 'react'
import Header1 from '../component/Header1'
import Sidebar from '../component/Sidebar'
import Overview from '../component/Overview'

export default function page() {
  return (
    <div>
      <Header1/>
      <div className="flex">
        <Sidebar/>
        <Overview/>
      </div>
    </div>
  )
}
