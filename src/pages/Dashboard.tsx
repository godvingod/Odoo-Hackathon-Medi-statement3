import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../utils/supabaseClient";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [swaps, setSwaps] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch profile info
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profile);

      // Fetch user items
      const { data: items } = await supabase
        .from("items")
        .select("*")
        .eq("uploader_id", user.id)
        .order("created_at", { ascending: false });
      setItems(items || []);

      // Fetch swaps
      const { data: swaps } = await supabase
        .from("swaps")
        .select("*")
        .or(`requester_id.eq.${user.id},responder_id.eq.${user.id}`)
        .order("created_at", { ascending: false });
      setSwaps(swaps || []);
    };
    if (user) fetchData();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-8">
        <img src={profile?.avatar_url || "/avatar.webp"} className="w-20 h-20 rounded-full mr-4" alt="avatar" />
        <div>
          <h2 className="text-2xl font-bold">{profile?.username || user.email}</h2>
          <div className="text-gray-700">Points: <span className="font-bold">{profile?.points ?? 0}</span></div>
          <Link to="/add-item" className="mt-2 inline-block bg-green-600 text-white px-3 py-1 rounded">Add Item</Link>
        </div>
      </div>
      <section className="mb-8">
        <h3 className="font-bold mb-2">My Listings</h3>
        <div className="flex flex-wrap gap-4">
          {items.map(item => (
            <Link key={item.id} to={`/item/${item.id}`} className="w-40 bg-white shadow rounded p-2">
              <img src={item.images?.[0] || "/placeholder.jpg"} className="h-24 w-full object-cover rounded" alt={item.title} />
              <div className="mt-1 font-semibold">{item.title}</div>
              <div className="text-xs">{item.size} • {item.condition}</div>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h3 className="font-bold mb-2">My Swaps</h3>
        <ul>
          {swaps.map(swap => (
            <li key={swap.id} className="mb-1">
              {swap.type === "swap" ? "Direct Swap" : "Redeemed via Points"} - Status: <span className="font-bold">{swap.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}