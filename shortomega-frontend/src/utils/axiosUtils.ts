import axios from "axios";

export async function axiosGet(url: string) {
    try {
        const response = await axios.get(url);
        return response.data
    }
    catch (error) {
        return { error: error };
    }
}

export async function axiosPost(url: string, data: any) {
    try {
        return await axios.post(url, data);
    }
    catch (error) {
        return { error: error };
    }
}