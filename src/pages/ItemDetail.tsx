import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState<any>(null);
  const [uploader, setUploader] = useState<any>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      const { data: item } = await supabase.from("items").select("*").eq("id", id).single();
      setItem(item);
      if (item) {
        const { data: uploader } = await supabase.from("profiles").select("*").eq("id", item.uploader_id).single();
        setUploader(uploader);
      }
    };
    fetchItem();
  }, [id]);

  const handleSwapRequest = async () => {
    if (!user) return navigate("/login");
    const { error } = await supabase.from("swaps").insert([
      {
        requester_id: user.id,
        responder_id: item.uploader_id,
        item_id: item.id,
        type: "swap",
        status: "pending"
      }
    ]);
    if (error) setError(error.message);
    else alert("Swap request sent!");
  };

  const handleRedeemPoints = async () => {
    if (!user) return navigate("/login");
    // Suppose each item costs 10 points
    const points = 10;
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if ((profile?.points || 0) < points) {
      setError("Not enough points!");
      return;
    }
    const { error } = await supabase.from("swaps").insert([
      {
        requester_id: user.id,
        responder_id: item.uploader_id,
        item_id: item.id,
        type: "points",
        points,
        status: "pending"
      }
    ]);
    if (error) setError(error.message);
    else alert("Redemption request sent!");
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex gap-8">
        <div className="flex-shrink-0 w-60">
          <img src={item.images?.[0] || "/placeholder.jpg"} className="rounded w-full h-60 object-cover" alt={item.title} />
          <div className="flex gap-2 mt-2">
            {(item.images || []).map((img: string, idx: number) =>
              <img key={idx} src={img} className="w-12 h-12 object-cover rounded" alt={`img${idx}`} />
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{item.title}</h2>
          <div className="mb-2 text-gray-600">{item.description}</div>
          <div className="mb-1 text-sm">Uploader: {uploader?.username || uploader?.email}</div>
          <div className="mb-1 text-sm">Category: {item.category}</div>
          <div className="mb-1 text-sm">Type: {item.type}</div>
          <div className="mb-1 text-sm">Size: {item.size}</div>
          <div className="mb-1 text-sm">Condition: {item.condition}</div>
          <div className="mb-1 text-sm">Tags: {(item.tags || []).join(", ")}</div>
          <div className="mb-1 text-sm">Status: <span className="font-bold">{item.status}</span></div>
          <div className="flex gap-4 mt-4">
            <button className="bg-blue-600 px-4 py-2 text-white rounded" onClick={handleSwapRequest}>Swap Request</button>
            <button className="bg-green-600 px-4 py-2 text-white rounded" onClick={handleRedeemPoints}>Redeem via Points</button>
          </div>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
}