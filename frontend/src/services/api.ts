import { AuthResponse, User, ReportDetails, ReportSummaryItem, ChatMessage, SampleReportPreset } from '../types';
import { MOCK_PRESETS, MOCK_REPORTS, MOCK_USER, MOCK_AUTH_RESPONSE } from './mockData';

const envBase = (import.meta as any).env?.VITE_API_BASE_URL;
const BASE = envBase ? envBase.replace(/\/$/, '') : '';
const API_BASE_URL = `${BASE}/api`;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('clarify_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

let inMemoryReports: ReportDetails[] = [MOCK_REPORTS['cbc-panel']];

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();

    if (!response.ok) {
      let errorMsg = 'An error occurred. Please try again.';
      if (text) {
        try {
          const data = JSON.parse(text);
          errorMsg = data.detail || errorMsg;
        } catch {
          errorMsg = response.statusText || errorMsg;
        }
      }
      throw new Error(errorMsg);
    }

    if (!text || text.trim() === '') {
      return {} as T;
    }

    if (contentType.includes('text/html') || text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      throw new Error('API_HTML_FALLBACK');
    }

    return JSON.parse(text) as T;
  } catch (err: any) {
    if (err.message === 'API_HTML_FALLBACK' || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      return handleClientMockFallback<T>(endpoint, options);
    }
    throw err;
  }
}

function handleClientMockFallback<T>(endpoint: string, options: RequestInit = {}): T {
  console.warn(`[ClarifyHealth] Live backend proxy unavailable at ${API_BASE_URL}${endpoint}. Serving interactive client state.`);

  // Demo Login Fallback
  if (endpoint.startsWith('/auth/demo-login')) {
    return MOCK_AUTH_RESPONSE as unknown as T;
  }

  // Register Fallback
  if (endpoint.startsWith('/auth/register')) {
    let regEmail = 'patient@clarifyhealth.ai';
    let regName = 'Alex Morgan';
    if (typeof options.body === 'string') {
      try {
        const parsed = JSON.parse(options.body);
        if (parsed.email) regEmail = parsed.email;
        if (parsed.full_name) regName = parsed.full_name;
      } catch {}
    }
    const customUser: User = {
      id: Date.now(),
      email: regEmail,
      full_name: regName,
      is_active: true,
      is_demo_user: false,
      created_at: new Date().toISOString(),
    };
    const authRes: AuthResponse = {
      access_token: 'client_token_' + Date.now(),
      token_type: 'bearer',
      user: customUser,
    };
    return authRes as unknown as T;
  }

  // Login JSON Fallback
  if (endpoint.startsWith('/auth/login-json')) {
    let loginEmail = 'patient@clarifyhealth.ai';
    if (typeof options.body === 'string') {
      try {
        const parsed = JSON.parse(options.body);
        if (parsed.email) loginEmail = parsed.email;
      } catch {}
    }
    const loggedUser: User = {
      id: 1,
      email: loginEmail,
      full_name: loginEmail.split('@')[0],
      is_active: true,
      is_demo_user: false,
      created_at: new Date().toISOString(),
    };
    const authRes: AuthResponse = {
      access_token: 'client_token_' + Date.now(),
      token_type: 'bearer',
      user: loggedUser,
    };
    return authRes as unknown as T;
  }

  if (endpoint.startsWith('/auth/profile')) {
    const saved = localStorage.getItem('clarify_user');
    if (saved) {
      try {
        return JSON.parse(saved) as T;
      } catch {}
    }
    return MOCK_USER as unknown as T;
  }

  // Presets Fallback
  if (endpoint.startsWith('/reports/presets/list')) {
    return MOCK_PRESETS as unknown as T;
  }

  // Load Preset
  if (endpoint.startsWith('/reports/preset/load')) {
    let presetId = 'cbc-panel';
    if (options.body instanceof FormData) {
      presetId = (options.body.get('preset_id') as string) || 'cbc-panel';
    }
    const report = MOCK_REPORTS[presetId] || MOCK_REPORTS['cbc-panel'];
    if (!inMemoryReports.some((r) => r.id === report.id)) {
      inMemoryReports.push(report);
    }
    return report as unknown as T;
  }

  // List Reports
  if (endpoint === '/reports') {
    const list: ReportSummaryItem[] = inMemoryReports.map((r) => ({
      id: r.id,
      title: r.title,
      report_type: r.report_type,
      report_date: r.report_date,
      original_filename: r.original_filename,
      file_type: r.file_type || 'pdf',
      page_count: r.page_count || 1,
      terms_count: r.terms_data.length,
      abnormal_count: r.terms_data.filter((t) => ['high', 'low', 'needs_attention'].includes(t.status)).length,
      status: r.status || 'completed',
      created_at: r.created_at,
    }));
    return list as unknown as T;
  }

  // Get Single Report
  if (endpoint.startsWith('/reports/')) {
    const parts = endpoint.split('/');
    const id = parseInt(parts[2], 10);

    // Chat
    if (endpoint.endsWith('/chat')) {
      let userQuery = 'What does this mean?';
      if (typeof options.body === 'string') {
        try {
          userQuery = JSON.parse(options.body).message;
        } catch {}
      }
      const responseMsg: ChatMessage = {
        id: Date.now(),
        report_id: id || 1,
        role: 'assistant',
        content: `Based on your report regarding "${userQuery}": Your Hemoglobin is 11.4 g/dL and Hematocrit is 34.1%, which are slightly below reference intervals. These are common educational topics to discuss with your doctor to explore hydration or iron levels.`,
        citations: ['Complete Blood Count', 'Hemoglobin'],
        created_at: new Date().toISOString(),
      };
      return responseMsg as unknown as T;
    }

    if (endpoint.endsWith('/chat/history')) {
      return [] as unknown as T;
    }

    const found = inMemoryReports.find((r) => r.id === id) || inMemoryReports[0] || MOCK_REPORTS['cbc-panel'];
    return found as unknown as T;
  }

  return {} as T;
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
