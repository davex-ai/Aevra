import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, useSegments, usePathname } from "expo-router";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsub;
  }, []);

  // Auto-redirect based on auth state
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(tabs)";
    
    // Auth screens that logged-in users shouldn't access
    const authScreens = ["/login", "/register"];
    const isOnAuthScreen = authScreens.includes(pathname);

    if (!user && inAuthGroup) {
      // User is not signed in but trying to access protected routes
      router.replace("/login");
    } else if (user && isOnAuthScreen) {
      // User is signed in but on auth screens (login/register)
      // Only redirect if they're specifically on login/register, not other routes
      router.replace("/(tabs)");
    }
  }, [user, segments, loading, pathname]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};