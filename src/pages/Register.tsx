import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Create the user account - profile will be created automatically by database trigger
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log("User created successfully, profile will be created automatically");
        setLoading(false);
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred during registration.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-24 p-8 bg-white rounded shadow">
      <h2 className="mb-6 text-xl font-bold">Register</h2>
      <form onSubmit={handleRegister}>
        <input
          className="w-full mb-4 p-2 border rounded"
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          disabled={loading}
        />
        <input
          className="w-full mb-4 p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          className="w-full mb-4 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button 
          className={`w-full p-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-600'}`} 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
      <div className="mt-4 text-sm">
        Already have an account? <a className="text-blue-600" href="/login">Login</a>
      </div>
    </div>
  );
}