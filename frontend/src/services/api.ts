import { AuthResponse, User, ReportDetails, ReportSummaryItem, ChatMessage, SampleReportPreset } from '../types';

const API_BASE_URL = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('clarify_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred. Please try again.';
    try {
      const data = await response.json();
      errorMsg = data.detail || errorMsg;
    } catch {
      errorMsg = response.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data: { email: string; password: string; full_name?: string }): Promise<AuthResponse> =>
    request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }): Promise<AuthResponse> =>
    request('/auth/login-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  demoLogin: (): Promise<AuthResponse> =>
    request('/auth/demo-login', {
      method: 'POST',
    }),

  getProfile: (): Promise<User> =>
    request('/auth/profile'),

  resetPassword: (email: string, new_password: string): Promise<{ message: string }> =>
    request('/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, new_password }),
    }),

  // Presets & Reports
  listPresets: (): Promise<SampleReportPreset[]> =>
    request('/reports/presets/list'),

  loadPreset: (presetId: string): Promise<ReportDetails> => {
    const formData = new FormData();
    formData.append('preset_id', presetId);
    return request('/reports/preset/load', {
      method: 'POST',
      body: formData,
    });
  },

  uploadReport: (file: File, title?: string): Promise<ReportDetails> => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);

    return request('/reports/upload', {
      method: 'POST',
      body: formData,
    });
  },

  listReports: (): Promise<ReportSummaryItem[]> =>
    request('/reports'),

  getReport: (id: number): Promise<ReportDetails> =>
    request(`/reports/${id}`),

  deleteReport: (id: number): Promise<{ message: string; report_id: number }> =>
    request(`/reports/${id}`, {
      method: 'DELETE',
    }),

  resimplifyReport: (id: number): Promise<ReportDetails> =>
    request(`/reports/${id}/simplify`, {
      method: 'POST',
    }),

  // Chat
  sendMessage: (reportId: number, message: string): Promise<ChatMessage> =>
    request(`/reports/${reportId}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    }),

  getChatHistory: (reportId: number): Promise<ChatMessage[]> =>
    request(`/reports/${reportId}/chat/history`),
};
