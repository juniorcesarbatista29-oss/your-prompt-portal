import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export function useAdminAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe FIRST, then check existing session
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (!newSession?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      // Defer DB call to avoid deadlock inside auth callback
      setTimeout(async () => {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", newSession.user.id)
          .eq("role", "admin")
          .maybeSingle();
        setIsAdmin(!!data);
        setLoading(false);
      }, 0);
    });

    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      setUser(existing?.user ?? null);
      if (!existing?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", existing.user.id)
        .eq("role", "admin")
        .maybeSingle()
        .then(({ data }) => {
          setIsAdmin(!!data);
          setLoading(false);
        });
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, user, isAdmin, loading, signOut };
}