import accesses from '/accesses.json';

const { ENDPOINT, TOKEN, GROUP_ID } = accesses;

const apiHeader = {
    authorization: TOKEN,
    'Content-Type': 'application/json'
};

export const apiRequest = async (resourcePath, method = 'GET', body = null) => {
    const url = `${ENDPOINT}/v1/${GROUP_ID}/${resourcePath}`;

    const options = {
        method,
        headers: apiHeader,
        ...(body && method !== 'GET' ? { body: JSON.stringify(body) } : {})
    };

    const response = await fetch(url, options);

    let data;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const error = new Error(
            `Ошибка ${response.status}: ${response.statusText}` +
            (data?.message ? `\nПричина: ${data?.message}` : '')
        );
        error.status = response.status;
        error.body = data;
        throw error;
    }

    return data;
};