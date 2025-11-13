import Businesstype from '@/app/component/Businesstype'
import Header1 from '@/app/component/Header1'
import Overview from '@/app/component/Overview'
import Sidebar from '@/app/component/Sidebar'
import React from 'react'


export default function page() {
  return (
    <div>
      <Header1/>
      <div className="flex">
        <Sidebar/>
        <Businesstype/>
      </div>
    </div>
  )
}
