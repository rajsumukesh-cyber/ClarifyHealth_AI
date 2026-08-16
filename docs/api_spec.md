# ClarifyHealth API Specification

Base URL: `/api`

## Authentication

### `POST /auth/register`
Creates a new user account.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "full_name": "Alex Morgan"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "Alex Morgan",
      "is_active": true,
      "is_demo_user": false,
      "created_at": "2026-08-16T12:00:00"
    }
  }
  ```

### `POST /auth/login-json`
Authenticates via JSON payload.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response (200 OK)**: Returns JWT `access_token` and `user` object.

### `POST /auth/demo-login`
One-click demo login for judges and trial visitors.
- **Response (200 OK)**: Returns demo JWT token and synthetic user session.

### `GET /auth/profile`
Retrieves authenticated user profile.
- **Headers**: `Authorization: Bearer <token>`

---

## Medical Reports

### `GET /reports/presets/list`
Lists synthetic sample reports available for 1-click testing.

### `POST /reports/preset/load`
Instantly loads a synthetic preset and generates an AI analysis.
- **Form Data**: `preset_id=cbc-panel`
- **Headers**: `Authorization: Bearer <token>`

### `POST /reports/upload`
Uploads a medical document (PDF, DOCX, PNG, JPG), extracts text, and triggers AI simplification.
- **Content-Type**: `multipart/form-data`
- **Fields**: `file` (binary), `title` (optional string)
- **Headers**: `Authorization: Bearer <token>`

### `GET /reports`
Lists all medical reports belonging to the user with summaries.

### `GET /reports/{id}`
Fetches full analysis, extracted text, terms array, doctor questions, and summaries for a specific report.

### `DELETE /reports/{id}`
Permanently deletes the report record, associated physical files, and chat logs.

### `POST /reports/{id}/simplify`
Re-triggers the AI simplification engine on existing extracted document text.

### `GET /reports/{id}/terms`
Returns the dictionary of detected medical terms, laboratory values, reference ranges, and abbreviations for this report.

### `POST /reports/{id}/chat`
Interactive grounded question answering on the report text with safety guardrails.
- **Request Body**:
  ```json
  {
    "message": "What values are outside standard ranges?"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "id": 12,
    "report_id": 1,
    "role": "assistant",
    "content": "The following measurements are outside reference ranges: Hemoglobin (11.4 g/dL)...",
    "citations": ["Uploaded Medical Report", "Hemoglobin"],
    "created_at": "2026-08-16T12:05:00"
  }
  ```

### `GET /reports/{id}/chat/history`
Returns previous chat conversation messages for this report.

---

## System Health

### `GET /health`
Returns system status, active database dialect, and configured AI engines.
