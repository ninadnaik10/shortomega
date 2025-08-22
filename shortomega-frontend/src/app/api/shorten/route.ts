import { axiosPost } from '@/utils/axiosUtils';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const SERVER_URL = process.env.SERVER_URL;

export async function POST(request: NextRequest) {
    try {
        if (!request.body) {
            return NextResponse.json(
                { error: 'Request body is required' },
                { status: 400 },
            );
        }

        const data = await request.json();

        if (!SERVER_URL) {
            return NextResponse.json(
                { error: 'Server URL not configured' },
                { status: 500 },
            );
        }

        const res = await axiosPost(SERVER_URL + '/shorten', data);

        if ('error' in res) {
            return NextResponse.json(
                { error: res.error || 'Failed to shorten URL' },
                { status: 400 },
            );
        }

        return NextResponse.json({ data: res.data }, { status: 200 });
    } catch (error) {
        console.error('Error in /shorten API:', error);

        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status || 500;
            const message = error.response?.data?.message || error.message;

            return NextResponse.json(
                { error: message },
                { status: statusCode },
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}
