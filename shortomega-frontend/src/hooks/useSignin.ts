import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import useGetUser from './useGetUser';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

type SigninResponse = {
    data: {
        accessToken: string;
        userId: string;
        email: string;
    };
};

export default function useSignin() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { getUser } = useGetUser();
    const signin = async (data: { email: string; password: string }) => {
        setIsLoading(true);
        setError(null);

        try {
            const response: SigninResponse = await axios.post(
                SERVER_URL + '/auth/login',
                data,
            );

            console.log(response);

            localStorage.setItem('token', response.data.accessToken);

            await getUser();

            router.push('/');
        } catch (err) {
            if (err instanceof Error) {
                setError(
                    (err as any).response?.data?.message ||
                        'Signup failed. Please try again.',
                );
            } else {
                setError('Signup failed. Please try again.');
            }
            setIsLoading(false);
        }
    };

    return { signin, isLoading, error };
}
