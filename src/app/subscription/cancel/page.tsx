import { Suspense } from "react";
import CancelClient from "./CancelClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CancelClient />
    </Suspense>
  );
}
