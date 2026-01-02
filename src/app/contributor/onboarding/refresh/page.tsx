import { Suspense } from "react";
import RefreshClient from "./RefreshClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RefreshClient />
    </Suspense>
  );
}
