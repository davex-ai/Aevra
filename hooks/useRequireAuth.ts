import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const requireAuth = (cb: () => void) => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    cb();
  };

  return { requireAuth };
}
