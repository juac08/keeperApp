export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api";

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("auth_token");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "API request failed");
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    return response.json();
  },

  get(endpoint: string) {
    return this.request(endpoint);
  },

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  patch(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete(endpoint: string) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  },
};
