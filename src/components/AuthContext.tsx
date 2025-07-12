import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const ensureProfileExists = async (user: any) => {
    try {
      // Try to fetch existing profile
      const { data: profileData, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        // Profile doesn't exist, create one
        console.log("Profile doesn't exist, creating one for user:", user.id);
        
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([
            {
              id: user.id,
              username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
              email: user.email,
              points: 0,
              is_admin: false
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error("Failed to create profile:", createError);
          return null;
        }

        console.log("Profile created successfully:", newProfile);
        return newProfile;
      } else if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        return null;
      }

      return profileData;
    } catch (err) {
      console.error("Error in ensureProfileExists:", err);
      return null;
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Ensure profile exists and fetch it
        const profileData = await ensureProfileExists(session.user);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    };
    
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Ensure profile exists and fetch it
        const profileData = await ensureProfileExists(session.user);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);