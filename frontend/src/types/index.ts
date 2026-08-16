export interface User {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_demo_user: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export type TermStatus = 'within_range' | 'high' | 'low' | 'needs_attention' | 'info_unavailable';

export interface TermItem {
  term: string;
  category: string;
  reported_value?: string;
  reference_range?: string;
  status: TermStatus;
  simple_explanation: string;
  what_it_means: string;
  why_it_matters: string;
}

export interface AbbreviationItem {
  abbreviation: string;
  full_term: string;
  simple_meaning: string;
}

export interface ReportDetails {
  id: number;
  user_id: number;
  title: string;
  report_type: string;
  report_date?: string;
  original_filename: string;
  file_type: string;
  file_size_bytes: number;
  page_count: number;
  extracted_text?: string;
  unclear_sections: string[];
  simple_summary?: string;
  simplified_mode_text?: string;
  terms_data: TermItem[];
  abbreviations_data: AbbreviationItem[];
  doctor_questions: string[];
  status: 'pending' | 'extracting' | 'analyzing' | 'completed' | 'failed';
  processing_error?: string;
  created_at: string;
  updated_at: string;
}

export interface ReportSummaryItem {
  id: number;
  title: string;
  report_type: string;
  report_date?: string;
  original_filename: string;
  file_type: string;
  page_count: number;
  terms_count: number;
  abnormal_count: number;
  status: string;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  report_id: number;
  role: 'user' | 'assistant';
  content: string;
  citations: string[];
  created_at: string;
}

export interface SampleReportPreset {
  preset_id: string;
  title: string;
  report_type: string;
  description: string;
  sample_text: string;
}
