import axios from "axios";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
console.log("SERVER_URL", SERVER_URL);

// Get auth token from localStorage
const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

// Create axios instance with auth header
const createAuthenticatedRequest = () => {
    const token = getAuthToken();
    return {
        headers: {
            ...(token && { Authorization: `Bearer ${token}` })
        }
    };
};

interface URLResponse {
    url: string;
    error?: string;
}

export interface ShortUrl {
    shortUrl: string;
    longUrl: string;
    createdAt: string;
    clickCount?: number;
}

export interface AnalyticsData {
    totalVisits: number;
    uniqueVisits: number;
    hash: string;
}

export interface UserInfo {
    userId: string;
    email: string;
}

export async function getURL(hash: string): Promise<string | null> {
    try {
        const response = await axios.get<URLResponse>(`${SERVER_URL}/${hash}`);

        if (response.data.error) {
            console.error('API Error:', response.data.error);
            return null;
        }

        return response.data.url;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        return null;
    }
}

export async function getAllUrls(): Promise<ShortUrl[]> {
    try {
        const response = await axios.get<ShortUrl[]>(
            `${SERVER_URL}/urls/get-all-urls`,
            createAuthenticatedRequest()
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching URLs:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        return [];
    }
}

export async function getAnalytics(hashes: string[]): Promise<{ [hash: string]: AnalyticsData }> {
    try {
        const response = await axios.post<{ [hash: string]: AnalyticsData }>(
            `${SERVER_URL}/analytics/visits`,
            hashes,
            createAuthenticatedRequest()
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching analytics:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        return {};
    }
}

export async function getUserInfo(): Promise<UserInfo | null> {
    try {
        const response = await axios.get<UserInfo>(
            `${SERVER_URL}/auth/me`,
            createAuthenticatedRequest()
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching user info:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        return null;
    }
}