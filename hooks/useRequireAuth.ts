import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export function useRequireAuth() {
  const { user } = useAuth();
  const router = useRouter();

  const requireAuth = (action: () => void) => {
    if (!user) {
      router.push("/login"); // or /register
      return;
    }

    action();
  };

  return { requireAuth };
}
