"use client";
import React from 'react';
import { UserProvider } from "@/app/component/UserContext";


export default function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </UserProvider>
  );
}