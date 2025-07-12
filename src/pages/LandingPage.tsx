import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

export default function LandingPage() {
  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    // Fetch featured items
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("status", "available")
          .limit(5);
        
        if (error) {
          console.error("Error fetching featured items:", error);
          setFeatured([]);
        } else {
          setFeatured(data || []);
        }
      } catch (err) {
        console.error("Error fetching featured items:", err);
        setFeatured([]);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      <header className="bg-blue-700 text-white p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">ReWear</h1>
        <nav>
          <Link className="mr-4" to="/login">Login</Link>
          <Link className="mr-4" to="/register">Sign Up</Link>
        </nav>
      </header>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Community Clothing Exchange</h2>
          <p className="text-lg mb-4">Promote sustainable fashion. Swap, donate, and give clothes a second life!</p>
          <div className="flex gap-4">
            <Link className="bg-blue-600 text-white px-4 py-2 rounded" to="/dashboard">Start Swapping</Link>
            <Link className="bg-gray-100 px-4 py-2 rounded" to="/browse">Browse Items</Link>
            <Link className="bg-green-600 text-white px-4 py-2 rounded" to="/add-item">List an Item</Link>
          </div>
        </section>
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-2">Featured Items</h3>
          <div className="flex gap-6 overflow-x-auto">
            {featured.map(item => (
              <Link key={item.id} to={`/item/${item.id}`} className="min-w-[200px] bg-white rounded shadow p-2">
                <img src={item.images?.[0] || "/placeholder.jpg"} className="h-36 w-full object-cover rounded" alt={item.title} />
                <div className="mt-2 font-semibold">{item.title}</div>
                <div className="text-xs">{item.size} • {item.condition}</div>
              </Link>
            ))}
          </div>
        </section>
        <section>
          <h3 className="text-xl font-bold mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {["Tops", "Bottoms", "Outerwear", "Shoes", "Accessories"].map(c => (
              <span key={c} className="bg-blue-100 text-blue-800 px-3 py-1 rounded">{c}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}