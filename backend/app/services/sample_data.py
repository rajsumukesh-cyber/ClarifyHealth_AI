from typing import List, Dict, Any

SAMPLE_REPORTS_PRESETS: List[Dict[str, Any]] = [
    {
        "preset_id": "cbc-panel",
        "title": "Complete Blood Count (CBC) with Differential",
        "report_type": "Hematology Laboratory Panel",
        "description": "Standard routine blood panel measuring red cells, white cells, hemoglobin, and platelets with mild microcytosis.",
        "sample_text": """METROPOLITAN CLINICAL LABORATORIES
1042 MEDICAL CENTER DRIVE, BLDG B
PATIENT: DEMO PATIENT (SYNTHETIC RECORD)
DOB: 1988-04-12  |  SEX: F  |  COLLECTION DATE: 2026-06-15 08:30 AM
ORDERING PHYSICIAN: DR. SARAH JENKINS, MD
SPECIMEN: WHOLE BLOOD (EDTA)

================================================================================
COMPLETE BLOOD COUNT (CBC) WITH AUTOMATED DIFFERENTIAL
================================================================================
Test Name                   Result      Flag    Reference Range     Units
--------------------------------------------------------------------------------
White Blood Cell (WBC)      6.8                 4.0 - 11.0          10^3/uL
Red Blood Cell (RBC)        4.12                4.00 - 5.20         10^6/uL
Hemoglobin (Hgb)            11.4        LOW     12.0 - 15.5         g/dL
Hematocrit (Hct)            34.1        LOW     36.0 - 46.0         %
Mean Corpuscular Vol (MCV)  81.2                80.0 - 100.0        fL
Mean Corpuscular Hgb (MCH)  26.8        LOW     27.0 - 33.0         pg
MCHC                        32.8                32.0 - 36.0         g/dL
RDW (Red Cell Distribution) 15.2        HIGH    11.5 - 14.5         %
Platelet Count              264                 150 - 450           10^3/uL
Mean Platelet Volume (MPV)  9.8                 7.5 - 11.5          fL

DIFFERENTIAL - AUTOMATED
--------------------------------------------------------------------------------
Neutrophils (Absolute)      4.2                 1.8 - 7.0           10^3/uL
Lymphocytes (Absolute)      1.9                 1.0 - 3.5           10^3/uL
Monocytes (Absolute)        0.5                 0.2 - 0.8           10^3/uL
Eosinophils (Absolute)      0.1                 0.0 - 0.4           10^3/uL
Basophils (Absolute)        0.05                0.0 - 0.1           10^3/uL

PATHOLOGY COMMENT:
Mild normocytic/microcytic anemia. Red cell distribution width is mildly elevated. 
Correlate with serum ferritin, iron saturation, and clinical history."""
    },
    {
        "preset_id": "lipid-panel",
        "title": "Comprehensive Lipid & Cardiovascular Risk Panel",
        "report_type": "Lipid & Cardiovascular Panel",
        "description": "Fasting lipid panel showing total cholesterol, HDL, LDL, and triglycerides.",
        "sample_text": """APEX DIAGNOSTIC SERVICES
CARDIOVASCULAR RISK EVALUATION
PATIENT: DEMO PATIENT (SYNTHETIC RECORD)
AGE: 46  |  SEX: M  |  FASTING: YES (12 HOURS)
COLLECTED: 2026-07-02 07:15 AM
ORDERING: DR. ROBERT CHEN, MD, FACC

================================================================================
LIPID PANEL WITH DIRECT LDL
================================================================================
Analyte                     Result      Flag    Reference / Goal    Units
--------------------------------------------------------------------------------
Total Cholesterol           218         HIGH    < 200               mg/dL
Triglycerides               175         HIGH    < 150               mg/dL
HDL Cholesterol ("Good")    42                  > 40 (Desirable)    mg/dL
LDL Cholesterol (Calculated)141         HIGH    < 100 (Optimal)     mg/dL
Non-HDL Cholesterol         176         HIGH    < 130               mg/dL
Total Chol / HDL Ratio      5.2         ELEV    < 4.5               ratio
hs-CRP (High-Sens C-Reactive)2.4        MOD     < 1.0 Low Risk      mg/L
                                                1.0 - 3.0 Mod Risk
                                                > 3.0 High Risk

CLINICAL INTERPRETATION NOTE:
Total cholesterol and LDL levels are above the standard population target ranges. 
Triglycerides are moderately elevated. Recommend lifestyle discussion and review 
with your primary care provider in the context of overall cardiovascular risk factors."""
    },
    {
        "preset_id": "cmp-panel",
        "title": "Comprehensive Metabolic Panel (CMP - 14)",
        "report_type": "Metabolic & Kidney Function Panel",
        "description": "Assessment of kidney function, liver enzymes, electrolytes, and blood sugar balance.",
        "sample_text": """VALLEY REGIONAL HEALTH SYSTEM
OUTPATIENT PATHOLOGY & BIOCHEMISTRY
PATIENT: DEMO PATIENT (SYNTHETIC RECORD)
COLLECTED: 2026-05-20 09:00 AM  |  SPECIMEN: SERUM SEPARATOR TUBE

================================================================================
COMPREHENSIVE METABOLIC PANEL (14 PARAMETERS)
================================================================================
Analyte                     Result      Flag    Reference Range     Units
--------------------------------------------------------------------------------
Glucose (Fasting)           96                  70 - 99             mg/dL
Blood Urea Nitrogen (BUN)   14                  7 - 20              mg/dL
Creatinine, Serum           0.92                0.60 - 1.20         mg/dL
eGFR (CKD-EPI)              94                  > 60                mL/min/1.73m2
BUN / Creatinine Ratio      15.2                10.0 - 20.0         ratio
Sodium                      140                 135 - 145           mmol/L
Potassium                   4.2                 3.5 - 5.0           mmol/L
Chloride                    102                 96 - 106            mmol/L
Carbon Dioxide, Total (CO2) 26                  22 - 29             mmol/L
Calcium, Total              9.4                 8.5 - 10.2          mg/dL
Total Protein               7.1                 6.3 - 8.2           g/dL
Albumin                     4.5                 3.5 - 5.0           g/dL
Globulin (Calculated)       2.6                 1.9 - 3.7           g/dL
Albumin / Globulin Ratio    1.7                 1.1 - 2.5           ratio
Bilirubin, Total            0.6                 0.2 - 1.2           mg/dL
Alkaline Phosphatase (ALP)  68                  40 - 129            U/L
AST (SGOT)                  24                  10 - 40             U/L
ALT (SGPT)                  28                  7 - 56              U/L

NOTE: All metabolic, liver enzyme, and renal parameters are within normal reference intervals."""
    },
    {
        "preset_id": "mri-spine",
        "title": "MRI Lumbar Spine (Without Contrast)",
        "report_type": "Diagnostic Radiology Report",
        "description": "Magnetic resonance imaging evaluation of the lower lumbar vertebrae and intervertebral discs.",
        "sample_text": """ADVANCED MEDICAL IMAGING CENTER
RADIOLOGY REPORT: MRI LUMBAR SPINE (WITHOUT CONTRAST)
PATIENT: DEMO PATIENT (SYNTHETIC RECORD)
EXAM DATE: 2026-07-10  |  REASON: LOW BACK PAIN WITH INTERMITTENT L5 DERMATOMAL PAIN
REPORTING RADIOLOGIST: DR. EMILY VANCE, MD

TECHNIQUE:
Multiplanar, multisequence MRI of the lumbar spine was performed on a 3.0 Tesla magnet without intravenous gadolinium contrast.

FINDINGS:
1. Alignment: Normal lumbar lordosis is maintained. No spondylolysis or spondylolisthesis.
2. Vertebral Bodies: Normal vertebral body heights and bone marrow signal intensity. No fracture or aggressive osseous lesion.
3. Conus Medullaris: Terminates normally at the L1-L2 level. Cauda equina nerve roots are unremarkable.
4. Level by level disc analysis:
   - L1-L2 & L2-L3: Unremarkable. Normal disc height and hydration.
   - L3-L4: Minimal diffuse disc bulge without significant canal or foraminal stenosis.
   - L4-L5: Moderate disc desiccation with a 3mm posterior central disc protrusion. Mild effacement of the anterior thecal sac. Mild bilateral neural foraminal narrowing, slightly greater on the left. No high-grade central canal stenosis.
   - L5-S1: Mild disc bulging. Facet joints demonstrate mild arthropathy without high-grade stenosis.

IMPRESSION:
1. L4-L5 disc protrusion and mild degenerative disc disease with mild bilateral neural foraminal narrowing (left > right).
2. Mild facet arthropathy at L5-S1.
3. No critical central spinal stenosis or spinal cord compression."""
    },
    {
        "preset_id": "thyroid-panel",
        "title": "Thyroid Function & Autoantibody Panel",
        "report_type": "Endocrine Laboratory Panel",
        "description": "Thyroid stimulating hormone (TSH), Free T4, and Thyroid Peroxidase Antibodies evaluation.",
        "sample_text": """ENDOCRINE DIAGNOSTICS GROUP
LABORATORY REPORT - THYROID EVALUATION
PATIENT: DEMO PATIENT (SYNTHETIC RECORD)
COLLECTED: 2026-06-28 08:45 AM  |  ORDERING: DR. K. PATEL, MD

================================================================================
THYROID FUNCTION PROFILE
================================================================================
Test Name                   Result      Flag    Reference Range     Units
--------------------------------------------------------------------------------
TSH (Thyroid Stimulating)   5.42        HIGH    0.45 - 4.50         uIU/mL
Free T4 (Thyroxine)         1.08                0.82 - 1.77         ng/dL
Free T3 (Triiodothyronine)  3.1                 2.0 - 4.4           pg/mL
TPO Antibodies (Thyroid Perox)18                < 35 (Negative)     IU/mL

CLINICAL COMMENT:
TSH is mildly elevated with normal free T4 levels, consistent with mild/subclinical 
hypothyroidism. Thyroid peroxidase antibodies are within normal range. 
Recommend discussing with your healthcare provider to consider clinical correlation 
and rechecking levels in 6 to 12 weeks if indicated."""
    }
]
