# ClarifyHealth — Security & Privacy Architecture

Medical records constitute Protected Health Information (PHI) and require rigorous architectural isolation and privacy safeguards.

---

## 1. Data Isolation & Access Control

1. **Cryptographic Authentication**:
   - All private endpoints require a signed JSON Web Token (JWT) using HMAC-SHA256.
   - User sessions are verified via the `get_current_user` dependency on every database query.
2. **Zero Public Share Links**:
   - No public URLs exist. Reports can only be viewed by the user who uploaded them.
3. **No Client-Side File Leakage**:
   - Document binaries are stored on the server's isolated upload directory and not exposed via public static directory listings.

---

## 2. Data Deletion Protocol

When a user triggers a report deletion (`DELETE /reports/{id}`):
1. The database cascades deletions to all associated `report_chat_messages` and report metadata.
2. The backend asynchronously deletes the physical document from the disk storage using `os.remove()`.
3. No residual cache or unindexed file replicas remain.

---

## 3. Responsible AI Privacy

1. **No Data Training**: Patient report text is processed in-memory for inference and never used to train external model weights.
2. **Minimal Data Storage**: Only extracted text required for user dashboard summaries and Q&A history is preserved.

---

## 4. Production Compliance Roadmap

For enterprise deployment beyond hackathon scope:
- Integration with AWS KMS / GCP Cloud KMS for column-level database field encryption (AES-256-GCM).
- HIPAA Business Associate Agreement (BAA) with model API endpoints.
- Role-Based Access Control (RBAC) and comprehensive immutable audit logging.
