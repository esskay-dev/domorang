const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )auth_token=([^;]+)'));
  if (match) return match[2];
  return localStorage.getItem('auth_token');
}

export function setAuthToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
  document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax`;
}

export function removeAuthToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  document.cookie = 'auth_token=; path=/; max-age=0';
}

async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const json = await response.json();

  if (!response.ok) {
    const errorMsg =
      json.message || json.error || `Request failed with status ${response.status}`;
    throw new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
  }

  return json.data !== undefined ? json.data : json;
}

export const api = {
  auth: {
    signUp: (data: any) =>
      apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    signIn: async (data: any) => {
      const res = await apiFetch('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.access_token) {
        setAuthToken(res.access_token);
      }
      return res;
    },

    signOut: async () => {
      try {
        await apiFetch('/auth/signout', { method: 'POST' });
      } finally {
        removeAuthToken();
      }
    },

    getMe: () => apiFetch('/auth/me'),
  },

  users: {
    getMe: () => apiFetch('/users/me'),
    updateMe: (data: any) =>
      apiFetch('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  listings: {
    getAll: (params: Record<string, any> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
      const queryString = query.toString();
      return apiFetch(`/listings${queryString ? `?${queryString}` : ''}`, {
        cache: 'no-store',
      });
    },

    getFeatured: (limit = 6) =>
      apiFetch(`/listings/featured?limit=${limit}`, { cache: 'no-store' }),

    getOne: (id: string) =>
      apiFetch(`/listings/${id}`, { cache: 'no-store' }),

    create: (data: any) =>
      apiFetch('/listings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      apiFetch(`/listings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      apiFetch(`/listings/${id}`, {
        method: 'DELETE',
      }),
  },

  agents: {
    getAll: (search?: string, area?: string) => {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (area && area !== 'All') query.append('area', area);
      const queryString = query.toString();
      return apiFetch(`/agents${queryString ? `?${queryString}` : ''}`, {
        cache: 'no-store',
      });
    },

    getOne: (id: string) => apiFetch(`/agents/${id}`, { cache: 'no-store' }),

    getListings: (id: string) =>
      apiFetch(`/agents/${id}/listings`, { cache: 'no-store' }),

    updateProfile: (data: any) =>
      apiFetch('/agents/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  uploads: {
    uploadImages: (files: File[]) => {
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));
      return apiFetch<{ urls: string[] }>('/uploads/images', {
        method: 'POST',
        body: formData,
      });
    },
  },

  admin: {
    getStats: () => apiFetch('/admin/stats'),
    getPendingListings: () => apiFetch('/admin/listings/pending'),
    approveListing: (id: string) =>
      apiFetch(`/admin/listings/${id}/approve`, { method: 'PATCH' }),
    rejectListing: (id: string) =>
      apiFetch(`/admin/listings/${id}/reject`, { method: 'PATCH' }),
    getPendingAgents: () => apiFetch('/admin/agents/pending'),
    verifyAgent: (id: string) =>
      apiFetch(`/admin/agents/${id}/verify`, { method: 'PATCH' }),
    rejectAgent: (id: string) =>
      apiFetch(`/admin/agents/${id}/reject`, { method: 'PATCH' }),
  },

  waitlist: {
    join: (data: any) =>
      apiFetch('/waitlist', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
