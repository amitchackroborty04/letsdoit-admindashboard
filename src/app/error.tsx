"use client";

import { useEffect, useState } from "react";

export default function ErrorPage() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div
        className={`text-center transition-all duration-500 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <h1 className="text-6xl font-bold text-red-500">Error</h1>

        <p className="mt-4 text-gray-600">
          Something went wrong. Please try again later.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 px-6 py-3 bg-[#0024DA] text-white rounded-lg hover:opacity-90"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}