import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

type SignupResponse = {
  data: {
    accessToken: string;
    userId: string;
    email: string;
  };
};

export default function useSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signup = async (data: {
    email: string;
    password: string;
    name: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: SignupResponse = await axios.post(
        SERVER_URL + "/auth/register",
        data
      );

      console.log(response);

      localStorage.setItem("token", response.data.accessToken);

      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(
          (err as any).response?.data?.message ||
            "Signup failed. Please try again."
        );
      } else {
        setError("Signup failed. Please try again.");
      }
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
}
