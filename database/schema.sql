-- PostgreSQL Database Schema for ClarifyHealth AI Medical Report Simplifier

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_demo_user BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_users_email ON users(email);

CREATE TABLE IF NOT EXISTS medical_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    report_type VARCHAR(100) DEFAULT 'General Laboratory Report',
    report_date VARCHAR(100),
    original_filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_path VARCHAR(500),
    file_size_bytes INTEGER DEFAULT 0,
    page_count INTEGER DEFAULT 1,
    extracted_text TEXT,
    unclear_sections JSONB DEFAULT '[]'::jsonb,
    simple_summary TEXT,
    simplified_mode_text TEXT,
    terms_data JSONB DEFAULT '[]'::jsonb,
    abbreviations_data JSONB DEFAULT '[]'::jsonb,
    doctor_questions JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'pending',
    processing_error TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_medical_reports_user_id ON medical_reports(user_id);
CREATE INDEX IF NOT EXISTS ix_medical_reports_status ON medical_reports(status);

CREATE TABLE IF NOT EXISTS report_chat_messages (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL REFERENCES medical_reports(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    citations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_report_chat_messages_report_id ON report_chat_messages(report_id);
