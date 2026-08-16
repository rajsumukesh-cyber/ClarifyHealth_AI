export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'zh' | 'ar';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', name: 'Mandarin', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    summaryTitle: 'Plain-Language Educational Summary',
    termsTitle: 'Medical Terms & Laboratory Values',
    doctorQuestionsTitle: 'Questions to Ask Your Doctor',
    listen: 'Listen',
    withinRange: 'Within Reference Range',
    high: 'Higher Than Standard Range',
    low: 'Lower Than Standard Range',
    needsAttention: 'Outside Range — Review with Doctor',
    reportedValue: 'Your Reported Value',
    refInterval: 'Reference Interval',
  },
  es: {
    summaryTitle: 'Resumen Educativo en Lenguaje Sencillo',
    termsTitle: 'Términos Médicos y Valores de Laboratorio',
    doctorQuestionsTitle: 'Preguntas para hacerle a su Médico',
    listen: 'Escuchar',
    withinRange: 'Dentro del Rango de Referencia',
    high: 'Más Alto que el Rango Estándar',
    low: 'Más Bajo que el Rango Estándar',
    needsAttention: 'Fuera de Rango — Consultar con su Médico',
    reportedValue: 'Su Valor Reportado',
    refInterval: 'Intervalo de Referencia',
  },
  fr: {
    summaryTitle: 'Résumé Éducatif en Langage Clair',
    termsTitle: 'Termes Médicaux et Valeurs de Laboratoire',
    doctorQuestionsTitle: 'Questions à Poser à Votre Médecin',
    listen: 'Écouter',
    withinRange: 'Dans la Plage de Référence',
    high: 'Supérieur à la Plage Normale',
    low: 'Inférieur à la Plage Normale',
    needsAttention: 'Hors Plage — À Discuter avec Votre Médecin',
    reportedValue: 'Votre Valeur Rapportée',
    refInterval: 'Intervalle de Référence',
  },
  de: {
    summaryTitle: 'Leicht verständliche Zusammenfassung',
    termsTitle: 'Medizinische Begriffe & Laborwerte',
    doctorQuestionsTitle: 'Fragen für Ihren Arzt',
    listen: 'Anhören',
    withinRange: 'Im Normbereich',
    high: 'Höher als der Normbereich',
    low: 'Niedriger als der Normbereich',
    needsAttention: 'Außerhalb des Normbereichs — Arzt fragen',
    reportedValue: 'Ihr gemessener Wert',
    refInterval: 'Referenzbereich',
  },
  hi: {
    summaryTitle: 'सरल भाषा में शैक्षिक सारांश',
    termsTitle: 'चिकित्सा शब्द और लैब मान',
    doctorQuestionsTitle: 'अपने डॉक्टर से पूछने के लिए प्रश्न',
    listen: 'सुनें',
    withinRange: 'सामान्य संदर्भ सीमा के भीतर',
    high: 'मानक सीमा से अधिक',
    low: 'मानक सीमा से कम',
    needsAttention: 'सीमा से बाहर — डॉक्टर से परामर्श करें',
    reportedValue: 'आपकी रिपोर्ट का मान',
    refInterval: 'संदर्भ सीमा',
  },
  zh: {
    summaryTitle: '通俗易懂的医学教育摘要',
    termsTitle: '医学术语与检验指标',
    doctorQuestionsTitle: '向医生咨询的问题清单',
    listen: '朗读',
    withinRange: '在正常参考范围内',
    high: '高于标准参考范围',
    low: '低于标准参考范围',
    needsAttention: '超出正常范围 — 请咨询医生',
    reportedValue: '您的报告数值',
    refInterval: '参考区间',
  },
  ar: {
    summaryTitle: 'ملخص تعليمي بلغة مبسطة',
    termsTitle: 'المصطلحات الطبية وقيم الفحوصات',
    doctorQuestionsTitle: 'أسئلة مقترحة لطبيبك',
    listen: 'استمع',
    withinRange: 'ضمن النطاق المرجعي الطبيعي',
    high: 'أعلى من النطاق المعياري',
    low: 'أقل من النطاق المعياري',
    needsAttention: 'خارج النطاق — يرجى مراجعة الطبيب',
    reportedValue: 'القيمة المسجلة في تقريرك',
    refInterval: 'النطاق المرجعي',
  },
};
