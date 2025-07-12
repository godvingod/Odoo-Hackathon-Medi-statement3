import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../components/AuthContext";

export default function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [swaps, setSwaps] = useState<any[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      const { data: users } = await supabase.from("profiles").select("*");
      setUsers(users || []);
      const { data: items } = await supabase.from("items").select("*");
      setItems(items || []);
      const { data: swaps } = await supabase.from("swaps").select("*");
      setSwaps(swaps || []);
    };
    fetchAdminData();
  }, []);

  const handleApproveItem = async (itemId: string) => {
    await supabase.from("items").update({ status: "available" }).eq("id", itemId);
    setItems(items.map(item => item.id === itemId ? { ...item, status: "available" } : item));
  };

  const handleRejectItem = async (itemId: string) => {
    await supabase.from("items").update({ status: "removed" }).eq("id", itemId);
    setItems(items.map(item => item.id === itemId ? { ...item, status: "removed" } : item));
  };

  const handleRemoveUser = async (userId: string) => {
    await supabase.from("profiles").delete().eq("id", userId);
    setUsers(users.filter(u => u.id !== userId));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <section className="mb-8">
        <h3 className="font-bold mb-2">Manage Users</h3>
        <table className="w-full mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Avatar</th>
              <th className="p-2">Username</th>
              <th className="p-2">Email</th>
              <th className="p-2">Points</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="p-2"><img src={u.avatar_url || "/avatar.webp"} className="w-8 h-8 rounded-full" alt="" /></td>
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.points}</td>
                <td className="p-2">
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleRemoveUser(u.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="mb-8">
        <h3 className="font-bold mb-2">Moderate Listings</h3>
        <table className="w-full mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Image</th>
              <th className="p-2">Title</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id}>
                <td className="p-2"><img src={i.images?.[0] || "/placeholder.jpg"} className="w-12 h-12 object-cover rounded" alt="" /></td>
                <td className="p-2">{i.title}</td>
                <td className="p-2">{i.status}</td>
                <td className="p-2">
                  <button className="bg-green-600 text-white px-2 py-1 rounded mr-2" onClick={() => handleApproveItem(i.id)}>Approve</button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleRejectItem(i.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3 className="font-bold mb-2">Manage Swaps</h3>
        <ul>
          {swaps.map(s => (
            <li key={s.id}>Swap #{s.id.slice(0, 6)}: {s.type} - Status: {s.status}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}