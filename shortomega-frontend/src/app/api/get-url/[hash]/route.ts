import { NextRequest } from 'next/server';
import { getURL } from '@/lib/api';

export async function GET(
    request: NextRequest,
    // @ts-ignore
    { params },
) {
    try {
        const { hash } = await params;

        if (!hash) {
            return new Response('Hash parameter is required', { status: 400 });
        }

        const url = await getURL(hash);

        if (!url) {
            return new Response('URL not found', { status: 404 });
        }

        return new Response(url, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    } catch (error) {
        console.error('Error retrieving URL:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
