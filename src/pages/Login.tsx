import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else navigate("/dashboard");
  };

  return (
    <div className="max-w-sm mx-auto mt-24 p-8 bg-white rounded shadow">
      <h2 className="mb-6 text-xl font-bold">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          className="w-full mb-4 p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full mb-4 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="w-full p-2 bg-blue-600 text-white rounded" type="submit">
          Login
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
      <div className="mt-4 text-sm">
        Don’t have an account? <a className="text-blue-600" href="/register">Register</a>
      </div>
    </div>
  );
}