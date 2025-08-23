import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Application } from '@/lib/mockData';
import type { TranslationKey } from '@/lib/i18n';
import { submitVisaApplication } from '@/lib/fakeApi';
import { ALL_COUNTRY_CODES } from '@/lib/countries';
import Toast from '@/components/Toast';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';



// JLPTレベルの定義（翻訳キー対応）
const JLPT_LEVEL_KEYS = ['jlpt_n1', 'jlpt_n2', 'jlpt_n3', 'jlpt_n4', 'jlpt_n5', 'jlpt_none'] as const;

// 都道府県の翻訳キー一覧
const PREFECTURE_KEYS = [
  'prefecture_hokkaido',
  'prefecture_aomori',
  'prefecture_iwate',
  'prefecture_miyagi',
  'prefecture_akita',
  'prefecture_yamagata',
  'prefecture_fukushima',
  'prefecture_ibaraki',
  'prefecture_tochigi',
  'prefecture_gunma',
  'prefecture_saitama',
  'prefecture_chiba',
  'prefecture_tokyo',
  'prefecture_kanagawa',
  'prefecture_niigata',
  'prefecture_toyama',
  'prefecture_ishikawa',
  'prefecture_fukui',
  'prefecture_yamanashi',
  'prefecture_nagano',
  'prefecture_gifu',
  'prefecture_shizuoka',
  'prefecture_aichi',
  'prefecture_mie',
  'prefecture_shiga',
  'prefecture_kyoto',
  'prefecture_osaka',
  'prefecture_hyogo',
  'prefecture_nara',
  'prefecture_wakayama',
  'prefecture_tottori',
  'prefecture_shimane',
  'prefecture_okayama',
  'prefecture_hiroshima',
  'prefecture_yamaguchi',
  'prefecture_tokushima',
  'prefecture_kagawa',
  'prefecture_ehime',
  'prefecture_kochi',
  'prefecture_fukuoka',
  'prefecture_saga',
  'prefecture_nagasaki',
  'prefecture_kumamoto',
  'prefecture_oita',
  'prefecture_miyazaki',
  'prefecture_kagoshima',
  'prefecture_okinawa'
] as const;

// VISA種類別の動的項目マッピング（翻訳キー対応）
const VISA_FIELD_KEYS: Record<string, string[]> = {
  'visa_type_student': [
    'field_学校名',
    'field_学部学科_課程',
    'field_在籍区分（正規/研究生等）',
    'field_在学期間',
    'field_奨学金の有無'
  ],
  'visa_type_work': [
    'field_所属機関名',
    'field_所在地',
    'field_雇用形態',
    'field_職務内容',
    'field_就労場所',
    'field_予定年収',
    'field_労働時間',
    'field_最終学歴',
    'field_関連職務年数'
  ],
  'visa_type_business': [
    'field_会社名',
    'field_事業所所在地',
    'field_資本金_出資総額',
    'field_常勤職員数',
    'field_法人番号',
    'field_事業概要',
    'field_事業開始状況'
  ],
  'visa_type_spouse': [
    'field_配偶者氏名（日本人）',
    'field_婚姻日',
    'field_同居状況'
  ],
  'visa_type_family': [
    'field_扶養者氏名',
    'field_扶養者の在留資格_期間',
    'field_扶養者の勤務先_収入',
    'field_同居予定住所'
  ]
};

export default function VisaForm() {
  const { t, language } = useLanguage();
  const [form, setForm] = useState<Application>({
    name: '',
    nationality: '',
    birthDate: '',
    gender: '',
    passportNumber: '',
    passportExpiry: '',
    visaKind: 'visa_type_work', // 翻訳キー対応
    expiryDate: '',
    jlpt: 'N2',
    dynamicFields: {},
    companyContactEmail: '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [lastId, setLastId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File[] }>({});

  // 国リスト（フォールバック）
  const [countries, setCountries] = useState<string[]>([]);

  // ブラウザのIntl APIから地域コード一覧を取得し、現在の言語で表示名へ変換
  useEffect(() => {
    try {
      // @ts-expect-error: supportedValuesOf はモダンブラウザで利用可能
      const supported = typeof Intl.supportedValuesOf === 'function' ? (Intl.supportedValuesOf('region') as string[]) : null;
      const regionList = supported && supported.length > 0 ? supported : ALL_COUNTRY_CODES;

      // 現在の言語で地域名を取得
      const langCode = language === 'zh' ? 'zh-CN' : language; // 中国語の場合、zh-CNを使用
      const dn = new Intl.DisplayNames([langCode], { type: 'region' });
      const names = regionList
        .map((code) => dn.of(code) || code)
        .filter((n) => !!n && n !== (language === 'en' ? 'World' : language === 'zh' ? '世界' : '世界'))
        .map((n) => String(n))
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => a.localeCompare(b, langCode));

      if (names.length > 0) {
        setCountries(names);
      } else {
        // フォールバック：翻訳された国リスト
        setCountries([
          t('country_japan'),
          t('country_usa'),
          t('country_china'),
          t('country_korea'),
          t('country_taiwan'),
          t('country_uk'),
          t('country_germany'),
          t('country_france'),
          t('country_india'),
          t('country_vietnam')
        ]);
      }
    } catch {
      // エラーフォールバック：翻訳された国リスト
      setCountries([
        t('country_japan'),
        t('country_usa'),
        t('country_china'),
        t('country_korea'),
        t('country_taiwan'),
        t('country_uk'),
        t('country_germany'),
        t('country_france'),
        t('country_india'),
        t('country_vietnam')
      ]);
    }
  }, [language, t]);

  const canSubmit = useMemo(() => {
    // 基本フィールドのチェック
    const basicValid = form.name.trim() !== '' && 
                      form.nationality.trim() !== '' && 
                      form.expiryDate.trim() !== '';
    
    // 現在表示されている動的フィールドのチェック
    const currentFieldKeys = VISA_FIELD_KEYS[form.visaKind] || [];
    const dynamicValid = currentFieldKeys.every((fieldKey) => {
      // 特例: 在学期間は開始/終了の2つ
      if (fieldKey === 'field_在学期間') {
        const start = (form.dynamicFields?.[t('field_在学期間') + '（開始）'] || '').trim();
        const end = (form.dynamicFields?.[t('field_在学期間') + '（終了）'] || '').trim();
        return start !== '' && end !== '';
      }
      // 特例: 職務内容はカテゴリ必須・詳細任意
      if (fieldKey === 'field_職務内容') {
        const cat = (form.dynamicFields?.[t('field_職務内容') + '（カテゴリ）'] || '').trim();
        return cat !== '';
      }
      const v = (form.dynamicFields?.[t(fieldKey as TranslationKey)] || '').trim();
      return v !== '';
    });
    
    return basicValid && dynamicValid;
  }, [form, t]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      if (name.startsWith('dynamic_')) {
        // 動的フィールド
        const fieldName = name.replace('dynamic_', '');
        setForm((prev) => ({
          ...prev,
          dynamicFields: { ...prev.dynamicFields, [fieldName]: value }
        }));
      } else {
        // 通常フィールド
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
      const files = e.target.files;
      if (files) {
        const fileList = Array.from(files);
        setSelectedFiles((prev) => ({
          ...prev,
          [fieldId]: fileList
        }));
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit || loading) return;
      setLoading(true);
      try {
        // ワンクリック保存：localStorageに保存
        if (typeof window !== 'undefined') {
          localStorage.setItem('lastApplication', JSON.stringify(form));
          if (form.companyContactEmail) {
            localStorage.setItem('companyContact', form.companyContactEmail);
          }
        }
        
        const res = await submitVisaApplication(form);
        setLastId(res.id);
        setToast(t('demo_saved_message'));
      } finally {
        setLoading(false);
      }
    },
    [canSubmit, form, loading, t]
  );

  return (
    <div className="max-w-4xl mx-auto">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      {/* Form Header */}
      <div className="bg-white rounded-t-2xl border border-gray-200 border-b-0 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('visa_form_title')}</h2>
            <p className="text-gray-600 text-sm">{t('visa_form_subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-b-2xl shadow-lg border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Personal Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              {t('basic_info')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  {t('name')} <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t('placeholder_name')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h6a2 2 0 012 2v4m-3 0V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
                  </svg>
                  {t('birth_date')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  placeholder={t('date_placeholder')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Nationality & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
                </svg>
                {t('nationality')} <span className="text-red-500">*</span>
              </label>
              <select
                name="nationality"
                value={form.nationality}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="" disabled>{t('select_country')}</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m6 0V6"/>
                </svg>
                {t('gender')}
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="">{t('select_gender')}</option>
                <option value="male">{t('male')}</option>
                <option value="female">{t('female')}</option>
                <option value="other">{t('other')}</option>
                <option value="prefer_not_say">{t('prefer_not_say')}</option>
              </select>
            </div>
          </div>

          {/* Passport */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h6a2 2 0 012 2v4m-3 0V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
                </svg>
{t('passport_number_label')}
              </label>
              <input
                name="passportNumber"
                value={form.passportNumber}
                onChange={handleChange}
                placeholder={t('placeholder_passport')}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h6a2 2 0 012 2v4m-3 0V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
                </svg>
{t('passport_expiry_label')}
              </label>
                              <input
                                type="text"
                                name="passportExpiry"
                                value={form.passportExpiry}
                                onChange={handleChange}
                                placeholder={t('date_placeholder')}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              />
            </div>
          </div>

          {/* VISA Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              {t('visa_info')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  {t('visa_type')}
                </label>
                <select
                  name="visaKind"
                  value={form.visaKind}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="visa_type_student">{t('visa_type_student')}</option>
                  <option value="visa_type_work">{t('visa_type_work')}</option>
                  <option value="visa_type_family">{t('visa_type_family')}</option>
                  <option value="visa_type_spouse">{t('visa_type_spouse')}</option>
                  <option value="visa_type_business">{t('visa_type_business')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h6a2 2 0 012 2v4m-3 0V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
                  </svg>
                  {t('visa_expiry')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  placeholder={t('date_placeholder')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Language Skills Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m6 0V6"/>
              </svg>
              {t('language_skills')}
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m6 0V6"/>
                </svg>
                {t('jlpt_level')}
              </label>
              <select
                name="jlpt"
                value={form.jlpt}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="" disabled>{t('select_jlpt')}</option>
                {JLPT_LEVEL_KEYS.map((jlptKey) => (
                  <option key={jlptKey} value={jlptKey.replace('jlpt_', '').toUpperCase()}>
                    {t(jlptKey as TranslationKey)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic Fields Section (VISA specific) */}
          {VISA_FIELD_KEYS[form.visaKind] && VISA_FIELD_KEYS[form.visaKind].length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                {t('company_school_info')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {VISA_FIELD_KEYS[form.visaKind].map((fieldKey) => {
                  const field = t(fieldKey as TranslationKey);

                  // セレクト候補
                  const SELECT_OPTIONS: Record<string, string[]> = {
                    'field_雇用形態': [t('option_fulltime'), t('option_contract'), t('option_parttime'), t('option_dispatch'), t('option_freelance')],
                    'field_在籍区分（正規/研究生等）': [t('employment_regular'), t('employment_researcher'), t('employment_exchange'), t('employment_auditor')],
                    'field_奨学金の有無': [t('scholarship_yes'), t('scholarship_no')],
                    'field_同居状況': [t('living_together'), t('living_separate')],
                    'field_労働時間': [t('option_fulltime_work'), t('option_parttime_work'), t('option_shift_work')],
                    'field_最終学歴': [t('option_highschool'), t('option_college'), t('option_bachelor'), t('option_master'), t('option_phd')]
                  };

                  // セレクトオプションのプレースホルダーテキスト
                  const SELECT_PLACEHOLDERS: Record<string, string> = {
                    'field_雇用形態': t('select_employment_type'),
                    'field_在籍区分（正規/研究生等）': t('select_enrollment_type'),
                    'field_奨学金の有無': t('select_scholarship'),
                    'field_同居状況': t('select_living_arrangement'),
                    'field_労働時間': t('select_work_time'),
                    'field_最終学歴': t('select_education_level')
                  };
                  const NUMBER_HINTS: Record<string, { min?: number; max?: number; step?: number; placeholder?: string }> = {
                    'field_予定年収': { min: 100, max: 2000, step: 10, placeholder: t('placeholder_year_income') },
                    'field_常勤職員数': { min: 1, max: 100000, step: 1, placeholder: t('placeholder_employee_count') },
                    'field_資本金_出資総額': { min: 1, max: 100000000, step: 1, placeholder: t('placeholder_capital') },
                    'field_関連職務年数': { min: 0, max: 50, step: 1, placeholder: t('placeholder_work_experience') }
                  };

                  // フィールド別のプレースホルダーテキスト
                  const FIELD_PLACEHOLDERS: Record<string, string> = {
                    'field_所属機関名': t('placeholder_name'),
                    'field_会社名': t('placeholder_name'),
                    'field_学校名': t('placeholder_name'),
                    'field_事業概要': t('placeholder_job_description'),
                    'field_扶養者氏名': t('placeholder_name'),
                    'field_扶養者の勤務先_収入': t('placeholder_job_description'),
                    'field_同居予定住所': t('placeholder_name')
                  };
                  const DATE_FIELDS = new Set<string>(['field_婚姻日']);
                  const PREF_FIELDS = new Set<string>(['field_所在地', 'field_就労場所']);

                  // 在学期間（開始/終了）の特別UI
                  if (fieldKey === 'field_在学期間') {
                    return (
                      <div key={field} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          {field} <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            name={`dynamic_${t('field_在学期間')}（開始）`}
                            value={form.dynamicFields?.[t('field_在学期間') + '（開始）'] || ''}
                            onChange={handleChange}
                            placeholder={t('date_placeholder')}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                          <input
                            type="text"
                            name={`dynamic_${t('field_在学期間')}（終了）`}
                            value={form.dynamicFields?.[t('field_在学期間') + '（終了）'] || ''}
                            onChange={handleChange}
                            placeholder={t('date_placeholder')}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                    );
                  }

                  // 会社／学校名に簡易サジェスト
                  if (fieldKey === 'field_所属機関名' || fieldKey === 'field_会社名' || fieldKey === 'field_学校名') {
                    const SUGGEST = fieldKey === 'field_学校名'
                      ? [
                          { key: 'university_tokyo' },
                          { key: 'university_waseda' },
                          { key: 'university_keio' },
                          { key: 'university_kyoto' },
                          { key: 'university_osaka' }
                        ]
                      : [
                          { key: 'company_acme' },
                          { key: 'company_globex' },
                          { key: 'company_soylent' },
                          { key: 'company_initech' },
                          { key: 'company_piedpiper' }
                        ];
                    return (
                      <div key={field} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          {field} <span className="text-red-500">*</span>
                        </label>
                        <input
                          list={`suggest_${field}`}
                          name={`dynamic_${t((fieldKey as TranslationKey))}`}
                          value={form.dynamicFields?.[t((fieldKey as TranslationKey))] || ''}
                          onChange={handleChange}
                          placeholder={FIELD_PLACEHOLDERS[fieldKey] || t('placeholder_name')}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <datalist id={`suggest_${field}`}>
                          {SUGGEST.map((item, i) => (
                            <option key={i} value={t(item.key as TranslationKey)} />
                          ))}
                        </datalist>
                      </div>
                    );
                  }

                  // 職務内容: カテゴリ + 詳細フリーテキスト（カテゴリ必須）
                  if (fieldKey === 'field_職務内容') {
                    return (
                      <div key={field} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          {field} <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <select
                            name={`dynamic_${t('field_職務内容')}（カテゴリ）`}
                            value={form.dynamicFields?.[t('field_職務内容') + '（カテゴリ）'] || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                          >
                            <option value="" disabled>{t('select_category')}</option>
                            <option value={t('job_category_engineer')}>{t('job_category_engineer')}</option>
                            <option value={t('job_category_data')}>{t('job_category_data')}</option>
                            <option value={t('job_category_design')}>{t('job_category_design')}</option>
                            <option value={t('job_category_product')}>{t('job_category_product')}</option>
                            <option value={t('job_category_sales')}>{t('job_category_sales')}</option>
                            <option value={t('job_category_backoffice')}>{t('job_category_backoffice')}</option>
                            <option value={t('job_category_support')}>{t('job_category_support')}</option>
                          </select>
                          <input
                            name={`dynamic_${t('field_職務内容')}（詳細）`}
                            value={form.dynamicFields?.[t('field_職務内容') + '（詳細）'] || ''}
                            onChange={handleChange}
                            placeholder={t('placeholder_job_description')}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                    );
                  }

                  // 都道府県セレクト
                  if (PREF_FIELDS.has(fieldKey)) {
                    return (
                      <div key={field} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          {field} <span className="text-red-500">*</span>
                        </label>
                        <select
                          name={`dynamic_${t((fieldKey as TranslationKey))}`}
                          value={form.dynamicFields?.[t((fieldKey as TranslationKey))] || ''}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        >
                          <option value="" disabled>{t('select_prefecture')}</option>
                          {PREFECTURE_KEYS.map((prefKey) => (
                            <option key={prefKey} value={t(prefKey as TranslationKey)}>
                              {t(prefKey as TranslationKey)}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  return (
                    <div key={field} className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        {field} <span className="text-red-500">*</span>
                      </label>

                      {SELECT_OPTIONS[fieldKey] ? (
                        <select
                          name={`dynamic_${t((fieldKey as TranslationKey))}`}
                          value={form.dynamicFields?.[t((fieldKey as TranslationKey))] || ''}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        >
                          <option value="" disabled>{SELECT_PLACEHOLDERS[fieldKey] || t('select_employment_type')}</option>

                          {SELECT_OPTIONS[fieldKey].map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : DATE_FIELDS.has(fieldKey) ? (
                        <input
                          type="text"
                          name={`dynamic_${field}`}
                          value={form.dynamicFields?.[field] || ''}
                          onChange={handleChange}
                          placeholder={t('date_placeholder')}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      ) : NUMBER_HINTS[fieldKey] ? (
                        <input
                          type="number"
                          name={`dynamic_${t((fieldKey as TranslationKey))}`}
                          value={form.dynamicFields?.[t((fieldKey as TranslationKey))] || ''}
                          onChange={handleChange}
                          min={NUMBER_HINTS[fieldKey].min}
                          max={NUMBER_HINTS[fieldKey].max}
                          step={NUMBER_HINTS[fieldKey].step}
                          placeholder={NUMBER_HINTS[fieldKey].placeholder}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      ) : (
                                                  <input
                            name={`dynamic_${t((fieldKey as TranslationKey))}`}
                            value={form.dynamicFields?.[t((fieldKey as TranslationKey))] || ''}
                            onChange={handleChange}
                            placeholder={FIELD_PLACEHOLDERS[fieldKey] || t('placeholder_name')}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* File Upload Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              {t('attachments')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {t('proof_photo')}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    disabled
                    onChange={(e) => handleFileChange(e, 'proof_photo')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed flex items-center justify-between">
                    <span className="text-gray-500">
                      {selectedFiles['proof_photo'] && selectedFiles['proof_photo'].length > 0
                        ? selectedFiles['proof_photo'].map(f => f.name).join(', ')
                        : t('no_file_selected')
                      }
                    </span>
                    <button
                      type="button"
                      disabled
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md cursor-not-allowed opacity-50"
                    >
                      {t('file_select_text')}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{t('demo_file_disabled')}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  {t('attachment_files')}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    disabled
                    onChange={(e) => handleFileChange(e, 'attachment_files')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed flex items-center justify-between">
                    <span className="text-gray-500">
                      {selectedFiles['attachment_files'] && selectedFiles['attachment_files'].length > 0
                        ? selectedFiles['attachment_files'].map(f => f.name).join(', ')
                        : t('no_file_selected')
                      }
                    </span>
                    <button
                      type="button"
                      disabled
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md cursor-not-allowed opacity-50"
                    >
                      {t('file_select_text')}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{t('demo_file_disabled')}</p>
              </div>
            </div>
          </div>

          {/* Company Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
              </svg>
              {t('company_contact')}
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                </svg>
{t('company_contact_label')}
              </label>
              <input
                name="companyContactEmail"
                type="email"
                value={form.companyContactEmail || ''}
                onChange={handleChange}
                placeholder={t('placeholder_email')}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Submit Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('submitting_text')}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                    {t('submit_button')}
                  </>
                )}
              </button>
              {lastId && (
                <Link
                  href="/scout"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all duration-200 font-semibold border border-blue-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"/>
                  </svg>
                  {t('view_scout_button')}
                </Link>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


