const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Request failed');
    }

    return data;
}
