// utils/authToken.ts
let idToken: string | null = null;

export const setAuthToken = (token: string) => {
    idToken = token;
};

export const getAuthToken = () => idToken;

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    if (!idToken) throw new Error('No authentication token available');

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${idToken}`,
    };

    const response = await fetch(url, { ...options, headers });
    // if (!response.ok) {
    //     throw new Error('Failed to fetch data');
    // }
    return response;
};
