"use client";

import { UserProvider } from "@/app/component/UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}