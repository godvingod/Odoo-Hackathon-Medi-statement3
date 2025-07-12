import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Link } from "react-router-dom";

const PAGE_SIZE = 12;

export default function BrowseItems() {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, [page, search, category]);

  const fetchItems = async () => {
    setLoading(true);
    let query = supabase
      .from("items")
      .select("*", { count: "exact" })
      .eq("status", "available")
      .order("created_at", { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }
    if (category) {
      query = query.eq("category", category);
    }
    const { data, count } = await query;
    setItems(data || []);
    setTotal(count || 0);
    setLoading(false);
  };

  const categories = ["Tops", "Bottoms", "Outerwear", "Shoes", "Accessories"];

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex gap-2 mb-4">
        <input
          className="border px-3 py-2 rounded flex-1"
          placeholder="Search items..."
          value={search}
          onChange={e => { setPage(1); setSearch(e.target.value); }}
        />
        <select
          className="border px-2 py-2 rounded"
          value={category}
          onChange={e => { setPage(1); setCategory(e.target.value); }}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {loading ? <div>Loading...</div> : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {items.map(item => (
              <Link key={item.id} to={`/item/${item.id}`} className="bg-white rounded shadow p-2">
                <img src={item.images?.[0] || "/placeholder.jpg"} className="h-36 w-full object-cover rounded" alt={item.title} />
                <div className="mt-2 font-semibold">{item.title}</div>
                <div className="text-xs">{item.size} • {item.condition}</div>
              </Link>
            ))}
          </div>
          <div className="flex justify-center gap-2 my-6">
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >Prev</button>
            <span className="px-3 py-1">{page}/{Math.ceil(total / PAGE_SIZE) || 1}</span>
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={page * PAGE_SIZE >= total}
            >Next</button>
          </div>
        </>
      )}
    </div>
  );
}