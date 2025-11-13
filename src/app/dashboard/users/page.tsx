import Header1 from '@/app/component/Header1'
import Sidebar from '@/app/component/Sidebar'
import Users from '@/app/component/Users'
import React from 'react'


export default function page() {
  return (
    <div>
      <Header1/>
      <div className="flex">
        <Sidebar/>
        <Users/>
      </div>
    </div>
  )
}
