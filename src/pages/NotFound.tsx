import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="mb-4 text-lg">Page Not Found</p>
      <Link className="bg-blue-600 text-white px-4 py-2 rounded" to="/">Back to Home</Link>
    </div>
  );
}