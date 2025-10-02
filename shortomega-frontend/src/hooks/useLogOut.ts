import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import userAtom from '@/atoms/userAtom';

export default function useLogOut() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [user, setUser] = useAtom(userAtom);

    const logout = async () => {
        setIsLoading(true);

        try {
            localStorage.removeItem('token');

            setUser({
                name: '',
                email: '',
            });

            router.push('/');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return { logout, isLoading };
}
