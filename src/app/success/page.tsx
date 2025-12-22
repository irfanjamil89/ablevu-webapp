import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function Page() {
  return (
    <Suspense fallback={<LoadingUI />}>
      <SuccessClient />
    </Suspense>
  );
}

function LoadingUI() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <h1 className="text-xl font-bold text-green-600 mb-2">
          Payment Successful
        </h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
