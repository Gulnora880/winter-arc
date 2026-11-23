import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Profile, UserProgress } from "../types";
import { getProfile, getProgress } from "../services/profile";

interface Ctx {
  user: User | null;
  profile: Profile | null;
  progress: UserProgress | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<Ctx>({} as Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser(u: User | null) {
    setUser(u);
    if (u) {
      const [p, pr] = await Promise.all([getProfile(u.id), getProgress(u.id)]);
      setProfile(p);
      setProgress(pr);
      document.body.classList.toggle("light", p?.theme === "light");
    } else {
      setProfile(null);
      setProgress(null);
      document.body.classList.remove("light");
    }
  }

  async function refresh() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await loadUser(user);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      loadUser(data.session?.user ?? null).finally(() => setLoading(false));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      loadUser(s?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, progress, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
