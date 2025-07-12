import React from "react";
import { Link } from "react-router-dom";

export default function ItemCard({ item }: { item: any }) {
  return (
    <Link to={`/item/${item.id}`} className="bg-white rounded shadow p-2">
      <img src={item.images?.[0] || "/placeholder.jpg"} className="h-36 w-full object-cover rounded" alt={item.title} />
      <div className="mt-2 font-semibold">{item.title}</div>
      <div className="text-xs">{item.size} • {item.condition}</div>
    </Link>
  );
}