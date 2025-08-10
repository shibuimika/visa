import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Application, JLPT, VisaKind } from '@/lib/mockData';
import { submitVisaApplication } from '@/lib/fakeApi';
import { ALL_COUNTRY_CODES } from '@/lib/countries';
import Toast from '@/components/Toast';
import Link from 'next/link';

const visaKinds: VisaKind[] = ['留学', '技術・人文知識・国際業務', '家族滞在', '日本人の配偶者等', '経営・管理'];
const jlptLevels: JLPT[] = ['N1', 'N2', 'N3', 'N4', 'N5', '未取得'];

// 共通項目
const COMMON = ['氏名','国籍','在留資格','在留期限','日本語レベル（JLPT）'] as const;

// 都道府県
const PREFECTURES = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'
];

// VISA種類別の動的項目マッピング
const VISA_FIELDS: Record<VisaKind, string[]> = {
  '技術・人文知識・国際業務': [
    '所属機関名','所在地','雇用形態','職務内容','就労場所','予定年収','労働時間','最終学歴','関連職務年数'
  ],
  '経営・管理': [
    '会社名','事業所所在地','資本金/出資総額','常勤職員数','法人番号','事業概要','事業開始状況'
  ],
  '留学': [
    '学校名','学部学科/課程','在籍区分（正規/研究生等）','在学期間','奨学金の有無'
  ],
  '日本人の配偶者等': [
    '配偶者氏名（日本人）','婚姻日','同居状況'
  ],
  '家族滞在': [
    '扶養者氏名','扶養者の在留資格/期間','扶養者の勤務先/収入','同居予定住所'
  ]
};

export default function VisaForm() {
  const [form, setForm] = useState<Application>({
    name: '',
    nationality: '',
    birthDate: '',
    gender: '',
    passportNumber: '',
    passportExpiry: '',
    visaKind: '技術・人文知識・国際業務',
    expiryDate: '',
    jlpt: 'N2',
    dynamicFields: {},
    companyContactEmail: '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [lastId, setLastId] = useState<string | null>(null);

  // 国リスト（フォールバック）
  const [countries, setCountries] = useState<string[]>([]);

  // ブラウザのIntl APIから地域コード一覧を取得し、日本語名へ変換
  useEffect(() => {
    try {
      // @ts-expect-error: supportedValuesOf はモダンブラウザで利用可能
      const supported = typeof Intl.supportedValuesOf === 'function' ? (Intl.supportedValuesOf('region') as string[]) : null;
      const regionList = supported && supported.length > 0 ? supported : ALL_COUNTRY_CODES;
      const dn = new Intl.DisplayNames(['ja'], { type: 'region' });
      const names = regionList
        .map((code) => dn.of(code) || code)
        .filter((n) => !!n && n !== '世界')
        .map((n) => String(n))
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => a.localeCompare(b, 'ja'));
      if (names.length > 0) {
        setCountries(names);
      } else {
        setCountries(['日本','アメリカ合衆国','中国','韓国','台湾','イギリス','ドイツ','フランス','インド','ベトナム']);
      }
    } catch {
      setCountries(['日本','アメリカ合衆国','中国','韓国','台湾','イギリス','ドイツ','フランス','インド','ベトナム']);
    }
  }, []);

  const canSubmit = useMemo(() => {
    // 基本フィールドのチェック
    const basicValid = form.name.trim() !== '' && 
                      form.nationality.trim() !== '' && 
                      form.expiryDate.trim() !== '';
    
    // 現在表示されている動的フィールドのチェック
    const currentFields = VISA_FIELDS[form.visaKind] || [];
    const dynamicValid = currentFields.every((field) => {
      // 特例: 在学期間は開始/終了の2つ
      if (field === '在学期間') {
        const start = (form.dynamicFields?.['在学期間（開始）'] || '').trim();
        const end = (form.dynamicFields?.['在学期間（終了）'] || '').trim();
        return start !== '' && end !== '';
      }
      // 特例: 職務内容はカテゴリ必須・詳細任意
      if (field === '職務内容') {
        const cat = (form.dynamicFields?.['職務内容（カテゴリ）'] || '').trim();
        return cat !== '';
      }
      const v = (form.dynamicFields?.[field] || '').trim();
      return v !== '';
    });
    
    return basicValid && dynamicValid;
  }, [form]);

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
        setToast('申請内容を保存しました（デモ）');
      } finally {
        setLoading(false);
      }
    },
    [canSubmit, form, loading]
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
            <h2 className="text-2xl font-bold text-gray-900">VISA申請フォーム</h2>
            <p className="text-gray-600 text-sm">必要な情報を入力してVISA申請を行います</p>
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
              基本情報
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  氏名 <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="例）山田 太郎"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h6a2 2 0 012 2v4m-3 0V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
                  </svg>
                  生年月日 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
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
                国籍 <span className="text-red-500">*</span>
              </label>
              <select
                name="nationality"
                value={form.nationality}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="" disabled>国を選択</option>
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
                性別（任意）
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="">未選択</option>
                <option value="男性">男性</option>
                <option value="女性">女性</option>
                <option value="その他">その他</option>
                <option value="回答しない">回答しない</option>
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
                パスポート番号（任意）
              </label>
              <input
                name="passportNumber"
                value={form.passportNumber}
                onChange={handleChange}
                placeholder="例）TR1234567"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h6a2 2 0 012 2v4m-3 0V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
                </svg>
                パスポート有効期限（任意）
              </label>
              <input
                type="date"
                name="passportExpiry"
                value={form.passportExpiry}
                onChange={handleChange}
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
              在留資格情報
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  在留資格
                </label>
                <select
                  name="visaKind"
                  value={form.visaKind}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  {visaKinds.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h6a2 2 0 012 2v4m-3 0V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
                  </svg>
                  在留期限 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
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
              語学スキル
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m6 0V6"/>
                </svg>
                日本語レベル（JLPT）
              </label>
              <select
                name="jlpt"
                value={form.jlpt}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                {jlptLevels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic Fields Section (VISA specific) */}
          {VISA_FIELDS[form.visaKind] && VISA_FIELDS[form.visaKind].length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                会社／学校情報（VISA別）
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {VISA_FIELDS[form.visaKind].map((field) => {
                  // セレクト候補
                  const SELECT_OPTIONS: Record<string, string[]> = {
                    '雇用形態': ['正社員', '契約社員', 'アルバイト', '派遣', '業務委託'],
                    '在籍区分（正規/研究生等）': ['正規', '研究生', '交換留学生', '聴講生'],
                    '奨学金の有無': ['あり', 'なし'],
                    '同居状況': ['同居', '別居'],
                    '労働時間': ['フルタイム', 'パートタイム', 'シフト'],
                    '最終学歴': ['高校', '短大', '学士', '修士', '博士']
                  };
                  const NUMBER_HINTS: Record<string, { min?: number; max?: number; step?: number; placeholder?: string }> = {
                    '予定年収': { min: 100, max: 2000, step: 10, placeholder: '例）年収（万円）' },
                    '常勤職員数': { min: 1, max: 100000, step: 1, placeholder: '例）50' },
                    '資本金/出資総額': { min: 1, max: 100000000, step: 1, placeholder: '例）資本金（万円）' },
                    '関連職務年数': { min: 0, max: 50, step: 1, placeholder: '例）5' }
                  };
                  const DATE_FIELDS = new Set<string>(['婚姻日']);
                  const PREF_FIELDS = new Set<string>(['所在地', '就労場所']);

                  // 在学期間（開始/終了）の特別UI
                  if (field === '在学期間') {
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
                            type="date"
                            name={`dynamic_在学期間（開始）`}
                            value={form.dynamicFields?.['在学期間（開始）'] || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                          <input
                            type="date"
                            name={`dynamic_在学期間（終了）`}
                            value={form.dynamicFields?.['在学期間（終了）'] || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                    );
                  }

                  // 会社／学校名に簡易サジェスト
                  if (field === '所属機関名' || field === '会社名' || field === '学校名') {
                    const SUGGEST = field === '学校名'
                      ? ['東京大学', '早稲田大学', '慶應義塾大学', '京都大学', '大阪大学']
                      : ['ACME KK', 'Globex', 'Soylent', 'Initech', 'Pied Piper'];
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
                          name={`dynamic_${field}`}
                          value={form.dynamicFields?.[field] || ''}
                          onChange={handleChange}
                          placeholder={`例）${SUGGEST[0]}`}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <datalist id={`suggest_${field}`}>
                          {SUGGEST.map((s) => (
                            <option key={s} value={s} />
                          ))}
                        </datalist>
                      </div>
                    );
                  }

                  // 職務内容: カテゴリ + 詳細フリーテキスト（カテゴリ必須）
                  if (field === '職務内容') {
                    const CATEGORIES = ['エンジニア', 'データ', 'デザイン', 'プロダクトマネジメント', '営業', 'バックオフィス', 'カスタマーサポート'];
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
                            name={`dynamic_職務内容（カテゴリ）`}
                            value={form.dynamicFields?.['職務内容（カテゴリ）'] || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                          >
                            <option value="" disabled>カテゴリを選択</option>
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <input
                            name={`dynamic_職務内容（詳細）`}
                            value={form.dynamicFields?.['職務内容（詳細）'] || ''}
                            onChange={handleChange}
                            placeholder="例）フロントエンド開発、API連携、UI改善など"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                    );
                  }

                  // 都道府県セレクト
                  if (PREF_FIELDS.has(field)) {
                    return (
                      <div key={field} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          {field} <span className="text-red-500">*</span>
                        </label>
                        <select
                          name={`dynamic_${field}`}
                          value={form.dynamicFields?.[field] || ''}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        >
                          <option value="" disabled>都道府県を選択</option>
                          {PREFECTURES.map((p) => (
                            <option key={p} value={p}>{p}</option>
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

                      {SELECT_OPTIONS[field] ? (
                        <select
                          name={`dynamic_${field}`}
                          value={form.dynamicFields?.[field] || ''}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        >
                          <option value="" disabled>選択してください</option>
                          {SELECT_OPTIONS[field].map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : DATE_FIELDS.has(field) ? (
                        <input
                          type="date"
                          name={`dynamic_${field}`}
                          value={form.dynamicFields?.[field] || ''}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      ) : NUMBER_HINTS[field] ? (
                        <input
                          type="number"
                          name={`dynamic_${field}`}
                          value={form.dynamicFields?.[field] || ''}
                          onChange={handleChange}
                          min={NUMBER_HINTS[field].min}
                          max={NUMBER_HINTS[field].max}
                          step={NUMBER_HINTS[field].step}
                          placeholder={NUMBER_HINTS[field].placeholder}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      ) : (
                        <input
                          name={`dynamic_${field}`}
                          value={form.dynamicFields?.[field] || ''}
                          onChange={handleChange}
                          placeholder={`例）${field}を入力してください`}
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
              添付（任意）
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  証明写真（任意）
                </label>
                <input
                  type="file"
                  accept="image/*"
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">デモのため未入力可</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  添付書類（任意）
                </label>
                <input
                  type="file"
                  multiple
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">デモのため未入力可</p>
              </div>
            </div>
          </div>

          {/* Company Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
              </svg>
              企業連絡先
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                </svg>
                所属企業担当者メール（任意）
              </label>
              <input
                name="companyContactEmail"
                type="email"
                value={form.companyContactEmail || ''}
                onChange={handleChange}
                placeholder="例）contact@company.com"
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
                    送信中...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                    申請を提出
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
                  スカウトを見る
                </Link>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


