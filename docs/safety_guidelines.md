# Medical Safety & Responsible AI Guidelines

ClarifyHealth is designed with strict healthcare safety principles to empower patients without overstepping into medical practice.

---

## 1. Core Safety Tenets

| Rule | Implementation Mechanism |
| :--- | :--- |
| **No Diagnostic Claims** | Single laboratory or imaging values are framed with cautious language (*"may accompany"*, *"commonly evaluated during"*) rather than declarative disease statements. |
| **No Drug Prescriptions** | AI models and rule engines reject requests for medication names, prescription dosages, or advice on changing active treatments. |
| **Non-Alarmist Terminology** | Rather than alarming keywords like *"DANGEROUS"* or *"CRITICAL"*, results outside standard intervals use: *"Outside reference range — consider discussing this with your healthcare professional."* |
| **Strict Document Grounding** | Chat queries about unmentioned medical facts return: *"This information isn't provided in the uploaded report."* |
| **Persistent Medical Disclaimers** | Every summary card, view, and exportable printout includes an unambiguous statement that output is educational only and does not replace a doctor. |

---

## 2. Example Phrasing Comparison

### Prohibited (Alarmist / Prescriptive):
> ❌ *"Your Hemoglobin is 11.4 which means you have severe anemia. Take 65mg iron pills daily."*

### Compliant (Educational / Supportive):
> ✅ *"Your reported Hemoglobin is 11.4 g/dL, which is slightly below the standard reference range (12.0 - 15.5 g/dL). Hemoglobin is an iron-rich protein in red blood cells that carries oxygen. A lower value is commonly discussed with your doctor to explore possible dietary factors, hydration, or iron levels. Here are questions you can ask your doctor at your next visit."*
