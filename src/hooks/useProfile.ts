import { useQuery } from "react-query";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../components/AuthContext";

export function useProfile() {
  const { user } = useAuth();
  return useQuery(["profile", user?.id], async () => {
    if (!user?.id) return null;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    return data;
  });
}