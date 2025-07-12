import { useQuery } from "react-query";
import { supabase } from "../utils/supabaseClient";

export function useItems({ search = "", category = "", page = 1, pageSize = 12 }) {
  return useQuery(["items", search, category, page], async () => {
    let query = supabase
      .from("items")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }
    if (category) {
      query = query.eq("category", category);
    }
    const { data } = await query;
    return data || [];
  });
}