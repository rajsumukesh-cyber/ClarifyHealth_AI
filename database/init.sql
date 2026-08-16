-- Seed initial database extensions and sample demo patient
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Default demo user for test environments
INSERT INTO users (email, full_name, hashed_password, is_active, is_demo_user)
VALUES (
    'demo.patient@clarifyhealth.ai',
    'Alex Morgan (Demo Patient)',
    '$2b$12$e9k0K29QyTdQ3K0eM0zD7.3wV4e9j4B9lJ4iK7Y.0o2W1o5h5y.0a',
    TRUE,
    TRUE
)
ON CONFLICT (email) DO NOTHING;
