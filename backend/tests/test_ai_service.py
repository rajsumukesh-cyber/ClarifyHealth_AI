from app.services.ai_service import AIService
from app.services.sample_data import SAMPLE_REPORTS_PRESETS

def test_ai_service_cbc_simplification():
    cbc = next(p for p in SAMPLE_REPORTS_PRESETS if p["preset_id"] == "cbc-panel")
    result = AIService.analyze_report(cbc["sample_text"], "cbc_report.txt")
    
    assert result.report_type is not None
    assert len(result.summary) > 20
    assert len(result.simplified_mode_text) > 10
    assert len(result.terms) > 0
    assert len(result.questions_for_doctor) > 0
    
    # Check that Hemoglobin was identified and flagged low
    hgb = next((t for t in result.terms if "hemoglobin" in t.term.lower()), None)
    assert hgb is not None
    assert hgb.status == "low"
    assert "oxygen" in hgb.simple_explanation.lower()

def test_ai_service_lipid_simplification():
    lipid = next(p for p in SAMPLE_REPORTS_PRESETS if p["preset_id"] == "lipid-panel")
    result = AIService.analyze_report(lipid["sample_text"], "lipid_panel.txt")
    
    assert len(result.terms) > 0
    ldl = next((t for t in result.terms if "ldl" in t.term.lower()), None)
    assert ldl is not None
    assert ldl.status == "high"

def test_ai_chat_safety_guardrails():
    report_text = "Hemoglobin: 11.4 g/dL (Reference: 12.0 - 15.5 g/dL). Patient has mild fatigue."
    terms_data = [{
        "term": "Hemoglobin",
        "reported_value": "11.4 g/dL",
        "reference_range": "12.0 - 15.5 g/dL",
        "status": "low",
        "simple_explanation": "Carries oxygen in blood.",
        "what_it_means": "Lower oxygen-carrying protein.",
        "why_it_matters": "Monitors oxygen delivery."
    }]

    # Test prescription refusal
    prescribe_ans = AIService.answer_report_question(
        "What dosage of medication should I take for this?",
        report_text,
        terms_data,
        []
    )
    assert "cannot diagnose" in prescribe_ans["answer"].lower() or "cannot" in prescribe_ans["answer"].lower()

    # Test grounded test inquiry
    hgb_ans = AIService.answer_report_question(
        "What does Hemoglobin mean in my report?",
        report_text,
        terms_data,
        []
    )
    assert "Hemoglobin" in hgb_ans["answer"]
    assert "11.4 g/dL" in hgb_ans["answer"]
