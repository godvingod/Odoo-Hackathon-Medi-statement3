import { useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

// Usage: pass a callback to update your local state when items table changes
export function useRealtimeItems(callback: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel('realtime-items')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items' },
        () => callback()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [callback]);
}