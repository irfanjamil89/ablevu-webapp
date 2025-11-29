"use client";

import React, { use, useState, useEffect } from 'react';
import BusinessSidebar from '@/app/component/BusinessSidebar';
import Maincontent from '@/app/component/Maincontent';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [businessId, setBusinessId] = useState<string>(id);

  useEffect(() => {
    // You can do additional client-side logic here
    console.log('Business ID:', businessId);
  }, [businessId]);

  return (
    <div className='flex'>
      <BusinessSidebar businessId={businessId} /> 
      <Maincontent businessId={businessId} />
    </div>
  );
}