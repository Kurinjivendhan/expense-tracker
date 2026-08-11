export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const refreshAccessToken = async () => {

    const refreshToken =
        localStorage.getItem("refresh_token");

    if (!refreshToken) {
        return null;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/token/refresh/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    refresh: refreshToken
                })
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        localStorage.setItem(
            "access_token",
            data.access
        );

        return data.access;

    } catch (error) {

        console.error(
            "Token refresh failed:",
            error
        );

        return null;
    }
};


export const apiFetch = async (
    url,
    options = {}
) => {

    let token =
        localStorage.getItem("access_token");

    let response = await fetch(
        url,
        {
            ...options,

            headers: {
                ...options.headers,

                "Authorization":
                    `Bearer ${token}`,

                "Content-Type":
                    "application/json"
            }
        }
    );


    if (response.status === 401) {

        token = await refreshAccessToken();

        if (!token) {

            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "refresh_token"
            );

            window.location.href = "/login";

            return response;
        }


        response = await fetch(
            url,
            {
                ...options,

                headers: {
                    ...options.headers,

                    "Authorization":
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"
                }
            }
        );
    }


    return response;
};