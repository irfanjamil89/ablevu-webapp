import Accessibilityfeaturetype from '@/app/component/Accessibilityfeaturetype'
import Header1 from '@/app/component/Header1'
import Sidebar from '@/app/component/Sidebar'
import React from 'react'


export default function page() {
  return (
    <div>
      <Header1/>
      <div className="flex">
        <Sidebar/>
        <Accessibilityfeaturetype/>
      </div>
    </div>
  )
}
