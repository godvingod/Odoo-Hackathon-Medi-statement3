import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { user, profile } = useAuth();
  return (
    <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">ReWear</Link>
      <nav>
        {user ? (
          <>
            <Link className="mr-4" to="/dashboard">Dashboard</Link>
            <Link className="mr-4" to="/add-item">Add Item</Link>
            {profile?.is_admin && <Link className="mr-4" to="/admin">Admin</Link>}
            <button
              className="bg-red-500 px-3 py-1 rounded"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >Logout</button>
          </>
        ) : (
          <>
            <Link className="mr-4" to="/login">Login</Link>
            <Link className="mr-4" to="/register">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}