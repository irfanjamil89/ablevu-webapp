import { Suspense } from "react";
import ReturnClient from "./ReturnClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ReturnClient />
    </Suspense>
  );
}
