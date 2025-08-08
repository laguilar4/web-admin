export const apiRequest = async (endpoint, method = "GET", body = null, headers = {}) => {
    try {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(endpoint, options);
        return await response.json();
    } catch (error) {
        console.error("Error en la petición:", error);
        throw error;
    }
};