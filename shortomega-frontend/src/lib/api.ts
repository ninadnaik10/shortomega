import axios from "axios";

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
console.log("SERVER_URL", SERVER_URL);


interface URLResponse {
    url: string;
    error?: string;
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