import Header1 from '@/app/component/Header1'
import Profile from '@/app/component/Profile'
import Sidebar from '@/app/component/Sidebar'
import React from 'react'


export default function page() {
  return (
    <div>
      <Header1/>
      <div className="flex">
        <Sidebar/>
        <Profile/>
      </div>
    </div>
  )
}
