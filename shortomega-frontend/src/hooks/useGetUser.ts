import { useState, useEffect } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import userAtom from "@/atoms/userAtom";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function useGetUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useAtom(userAtom);

  const getUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found");
      return;
    }

    try {
      const response = await axios.get(SERVER_URL + "/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser({
        name: response.data.name,
        email: response.data.email,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(
          (err as any).response?.data?.message ||
            "Failed to get user. Please try again."
        );
      } else {
        setError("Failed to get user. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return { getUser, isLoading, error, user };
}
