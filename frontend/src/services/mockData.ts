import { SampleReportPreset, ReportDetails, AuthResponse, User } from '../types';

export const MOCK_PRESETS: SampleReportPreset[] = [
  {
    preset_id: 'cbc-panel',
    title: 'Complete Blood Count (CBC) with Differential',
    report_type: 'Hematology Laboratory Panel',
    description: 'Standard routine blood panel measuring red cells, white cells, hemoglobin, and platelets with mild microcytosis.',
    sample_text: 'Complete Blood Count (CBC) laboratory specimen',
  },
  {
    preset_id: 'lipid-panel',
    title: 'Comprehensive Lipid & Cardiovascular Risk Panel',
    report_type: 'Lipid & Cardiovascular Panel',
    description: 'Fasting lipid panel showing total cholesterol, HDL, LDL, and triglycerides.',
    sample_text: 'Lipid & Cardiovascular Panel specimen',
  },
  {
    preset_id: 'cmp-panel',
    title: 'Comprehensive Metabolic Panel (CMP - 14)',
    report_type: 'Metabolic & Kidney Function Panel',
    description: 'Assessment of kidney function, liver enzymes, electrolytes, and blood sugar balance.',
    sample_text: 'Comprehensive Metabolic Panel specimen',
  },
  {
    preset_id: 'mri-spine',
    title: 'MRI Lumbar Spine Radiology Report',
    report_type: 'Diagnostic Radiology Imaging',
    description: 'Magnetic resonance imaging evaluating lower back disc spaces, nerve root impingement, and spinal canal caliber.',
    sample_text: 'MRI Lumbar Spine report',
  },
  {
    preset_id: 'thyroid-profile',
    title: 'Comprehensive Thyroid & Autoantibody Profile',
    report_type: 'Endocrinology Laboratory Panel',
    description: 'Thyroid stimulating hormone (TSH), free thyroxine (Free T4), free T3, and anti-TPO antibodies.',
    sample_text: 'Thyroid Panel specimen',
  },
];

export const MOCK_REPORTS: Record<string, ReportDetails> = {
  'cbc-panel': {
    id: 1,
    user_id: 1,
    title: 'Complete Blood Count (CBC) with Differential',
    original_filename: 'sample_cbc_report.pdf',
    file_type: 'pdf',
    file_size_bytes: 48120,
    page_count: 1,
    report_type: 'Hematology Laboratory Panel',
    report_date: '2026-06-15',
    status: 'completed',
    simple_summary: "Your Complete Blood Count shows normal infection-fighting white blood cells and normal platelets. Hemoglobin and Hematocrit are slightly below standard reference intervals, which is commonly discussed with a doctor to evaluate iron levels or dietary factors.",
    simplified_mode_text: "Think of your blood like a delivery system. Your red blood cell 'delivery trucks' are carrying slightly less oxygen-holding protein (Hemoglobin) than usual, which is why your doctor might check if you need more iron in your food.",
    extracted_text: `COMPLETE BLOOD COUNT (CBC) WITH AUTOMATED DIFFERENTIAL
White Blood Cell (WBC): 6.8 (4.0 - 11.0 10^3/uL)
Red Blood Cell (RBC): 4.12 (4.00 - 5.20 10^6/uL)
Hemoglobin (Hgb): 11.4 LOW (12.0 - 15.5 g/dL)
Hematocrit (Hct): 34.1 LOW (36.0 - 46.0 %)
Mean Corpuscular Vol (MCV): 81.2 (80.0 - 100.0 fL)
RDW (Red Cell Distribution): 15.2 HIGH (11.5 - 14.5 %)
Platelet Count: 264 (150 - 450 10^3/uL)`,
    terms_data: [
      {
        term: 'Hemoglobin (Hgb)',
        category: 'Red Blood Cells & Oxygen Delivery',
        simple_explanation: 'The iron-rich protein in red blood cells that carries oxygen from your lungs throughout your entire body.',
        reported_value: '11.4 g/dL',
        reference_range: '12.0 - 15.5 g/dL',
        status: 'low',
        what_it_means: 'Slightly lower than the standard reference interval for adult females/males.',
        why_it_matters: 'Helps healthcare providers evaluate oxygen-carrying capacity and screen for mild anemia.',
      },
      {
        term: 'Hematocrit (Hct)',
        category: 'Red Blood Cells & Oxygen Delivery',
        simple_explanation: 'The percentage of your total blood volume that consists of red blood cells.',
        reported_value: '34.1 %',
        reference_range: '36.0 - 46.0 %',
        status: 'low',
        what_it_means: 'Lower proportion of red blood cells relative to overall blood fluid volume.',
        why_it_matters: 'Evaluates blood thickness, hydration status, and red cell volume alongside hemoglobin.',
      },
      {
        term: 'White Blood Cell (WBC)',
        category: 'Immune Defense & Infection',
        simple_explanation: 'Your body’s defense cells that combat bacteria, viruses, and inflammation.',
        reported_value: '6.8 10^3/uL',
        reference_range: '4.0 - 11.0 10^3/uL',
        status: 'within_range',
        what_it_means: 'Normal circulating levels of white blood cells.',
        why_it_matters: 'Indicates a stable immune baseline without obvious acute bacterial infection or bone marrow suppression.',
      },
      {
        term: 'Red Cell Distribution Width (RDW)',
        category: 'Red Blood Cells & Oxygen Delivery',
        simple_explanation: 'A measurement of how much red blood cells vary in size from one another.',
        reported_value: '15.2 %',
        reference_range: '11.5 - 14.5 %',
        status: 'high',
        what_it_means: 'Slightly more variation in red blood cell sizes (anisocytosis) than typical.',
        why_it_matters: 'Often signals mixed populations of newer or older red cells, commonly seen with early iron or vitamin changes.',
      },
      {
        term: 'Platelet Count',
        category: 'Blood Clotting & Vessel Repair',
        simple_explanation: 'Tiny cell fragments that form plugs to stop bleeding when you have a scratch or cut.',
        reported_value: '264 10^3/uL',
        reference_range: '150 - 450 10^3/uL',
        status: 'within_range',
        what_it_means: 'Normal clotting cell reserves.',
        why_it_matters: 'Ensures adequate ability to form clots without excessive risk of abnormal bleeding.',
      },
    ],
    doctor_questions: [
      'My hemoglobin (11.4) and hematocrit (34.1) were slightly below reference range. Do you recommend checking serum ferritin or iron saturation?',
      'Are there specific dietary changes or supplements you would suggest based on these results?',
      'When should we repeat this blood panel to check for improvements?',
    ],
    abbreviations_data: [
      { abbreviation: 'CBC', full_term: 'Complete Blood Count', simple_meaning: 'Routine blood test measuring all major circulating blood cell families.' },
      { abbreviation: 'Hgb', full_term: 'Hemoglobin', simple_meaning: 'Oxygen-binding iron protein inside red blood cells.' },
      { abbreviation: 'Hct', full_term: 'Hematocrit', simple_meaning: 'Percentage of blood made of red blood cells.' },
      { abbreviation: 'WBC', full_term: 'White Blood Cell Count', simple_meaning: 'Total number of immune defense cells.' },
      { abbreviation: 'RDW', full_term: 'Red Cell Distribution Width', simple_meaning: 'Measurement of cell size uniformity.' },
    ],
    unclear_sections: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export const MOCK_USER: User = {
  id: 1,
  email: 'demo.patient@clarifyhealth.ai',
  full_name: 'Alex Morgan (Demo Patient)',
  is_active: true,
  is_demo_user: true,
  created_at: new Date().toISOString(),
};

export const MOCK_AUTH_RESPONSE: AuthResponse = {
  access_token: 'mock_demo_jwt_token_clarify_health',
  token_type: 'bearer',
  user: MOCK_USER,
};
