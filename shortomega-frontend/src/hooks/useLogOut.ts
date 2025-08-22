import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import userAtom from "@/atoms/userAtom";

export default function useLogOut() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);

  const logout = async () => {
    setIsLoading(true);

    try {
      // Remove token from localStorage
      localStorage.removeItem("token");

      // Clear user state
      setUser({
        name: "",
        email: "",
      });

      // Redirect to login or home page
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading };
}
