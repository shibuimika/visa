// 多言語対応用の辞書とユーティリティ
export type Language = 'ja' | 'en' | 'zh';

export type TranslationKey =
  // 共通
  | 'app_title'
  | 'professional_platform'
  | 'visa_application'
  | 'scout'
  | 'local_demo'
  | 'submit_application'
  | 'see_scout'
  | 'apply_now'

  // ホームページ
  | 'hero_title'
  | 'hero_subtitle'
  | 'hero_description'
  | 'feature_visa_title'
  | 'feature_visa_description'
  | 'feature_scout_title'
  | 'feature_scout_description'
  | 'quick_start_title'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'visa_application_title'
  | 'scout_title'

  // VISA申請フォーム
  | 'visa_form_title'
  | 'visa_form_subtitle'
  | 'basic_info'
  | 'visa_info'
  | 'language_skills'
  | 'company_school_info'
  | 'attachments'
  | 'company_contact'
  | 'name'
  | 'birth_date'
  | 'nationality'
  | 'gender'
  | 'passport_number'
  | 'passport_expiry'
  | 'visa_type'
  | 'visa_expiry'
  | 'jlpt_level'
  | 'company_contact_email'
  | 'proof_photo'
  | 'attachment_files'
  | 'demo_only'
  | 'submit_button'

  // プレースホルダー
  | 'placeholder_name'
  | 'placeholder_passport'
  | 'placeholder_email'
  | 'placeholder_job_description'
  | 'select_country'
  | 'select_gender'
  | 'select_visa_type'
  | 'select_jlpt'
  | 'select_prefecture'
  | 'male'
  | 'female'
  | 'other'
  | 'prefer_not_say'

  // VISA種類（翻訳版）
  | 'visa_type_student'
  | 'visa_type_work'
  | 'visa_type_family'
  | 'visa_type_spouse'
  | 'visa_type_business'

  // 都道府県（翻訳版）
  | 'prefecture_tokyo'
  | 'prefecture_osaka'
  | 'prefecture_kyoto'
  | 'prefecture_kanagawa'
  | 'prefecture_aichi'
  | 'prefecture_fukuoka'
  | 'prefecture_hokkaido'

  // 雇用形態（翻訳版）
  | 'employment_fulltime'
  | 'employment_contract'
  | 'employment_parttime'
  | 'employment_dispatch'
  | 'employment_freelance'

  // 職務カテゴリ（翻訳版）
  | 'job_category_engineer'
  | 'job_category_data'
  | 'job_category_design'
  | 'job_category_product'
  | 'job_category_sales'
  | 'job_category_backoffice'
  | 'job_category_support'

  // 学歴（翻訳版）
  | 'education_highschool'
  | 'education_college'
  | 'education_bachelor'
  | 'education_master'
  | 'education_phd'

  // 労働時間（翻訳版）
  | 'worktime_fulltime'
  | 'worktime_parttime'
  | 'worktime_shift'

  // 国名（翻訳版）
  | 'country_japan'
  | 'country_usa'
  | 'country_china'
  | 'country_korea'
  | 'country_taiwan'
  | 'country_uk'
  | 'country_germany'
  | 'country_france'
  | 'country_india'
  | 'country_vietnam'

  // スカウトページ
  | 'your_recommended_jobs'
  | 'matching_application_info'
  | 'jlpt_visa_match'
  | 'no_matching_jobs'
  | 'no_matches_description'
  | 'retry_application'
  | 'start_visa_application'
  | 'no_application_found'
  | 'no_application_description'
  | 'loading_jobs'
  | 'apply_success'

  // 求人カード
  | 'japanese_level'
  | 'visa_type_label'
  | 'location'
  | 'remote'
  | 'employment_type'
  | 'applicants'
  | 'required_skills'
  | 'match_reasons'
  | 'posted_date'
  | 'view_details'
  | 'applied'
  | 'apply_job'

  // 言語ボタン
  | 'language_ja'
  | 'language_en'
  | 'language_zh'

  // VISAフォームの動的フィールド名
  | 'field_所属機関名'
  | 'field_所在地'
  | 'field_雇用形態'
  | 'field_職務内容'
  | 'field_就労場所'
  | 'field_予定年収'
  | 'field_労働時間'
  | 'field_最終学歴'
  | 'field_関連職務年数'
  | 'field_会社名'
  | 'field_事業所所在地'
  | 'field_資本金/出資総額'
  | 'field_常勤職員数'
  | 'field_法人番号'
  | 'field_事業概要'
  | 'field_事業開始状況'
  | 'field_学校名'
  | 'field_学部学科/課程'
  | 'field_在籍区分（正規/研究生等）'
  | 'field_在学期間'
  | 'field_奨学金の有無'
  | 'field_配偶者氏名（日本人）'
  | 'field_婚姻日'
  | 'field_同居状況'
  | 'field_扶養者氏名'
  | 'field_扶養者の在留資格/期間'
  | 'field_扶養者の勤務先/収入'
  | 'field_同居予定住所'

  // VISAフォームの固定ラベル
  | 'passport_number_label'
  | 'passport_expiry_label'
  | 'company_contact_label'
  | 'demo_saved_message'

  // プレースホルダー
  | 'placeholder_year_income'
  | 'placeholder_employee_count'
  | 'placeholder_capital'
  | 'placeholder_work_experience'
  | 'placeholder_company_email'

  // セレクトオプション
  | 'select_category'
  | 'select_employment_type'
  | 'select_education_level'
  | 'select_work_time'
  | 'select_enrollment_type'
  | 'select_scholarship'
  | 'select_living_arrangement'
  | 'option_fulltime'
  | 'option_contract'
  | 'option_parttime'
  | 'option_dispatch'
  | 'option_freelance'
  | 'option_regular'
  | 'option_researcher'
  | 'option_exchange'
  | 'option_auditor'
  | 'option_yes'
  | 'option_no'
  | 'option_together'
  | 'option_separate'
  | 'option_highschool'
  | 'option_college'
  | 'option_bachelor'
  | 'option_master'
  | 'option_phd'
  | 'option_fulltime_work'
  | 'option_parttime_work'
  | 'option_shift_work'

  // JobCard
  | 'apply_now_available'

  // JobDetailModal
  | 'location_label'
  | 'employment_type_label'
  | 'working_hours_label'
  | 'holidays_label'
  | 'work_language_label'
  | 'japanese_read_speak_label'
  | 'visa_type_label'
  | 'visa_sponsorship_label'
  | 'required_skills_label'
  | 'welcome_skills_label'
  | 'job_description_label'
  | 'benefits_label'
  | 'salary_range_label'
  | 'posted_label'
  | 'updated_label'
  | 'applicants_label'
  | 'view_company_site'
  | 'close_button'

  // MetaRow
  | 'posted_label'
  | 'updated_label'
  | 'applicants_label'
  | 'status_label'
  | 'status_open'
  | 'status_closed'
  
  // JLPTレベル
  | 'jlpt_n1'
  | 'jlpt_n2'
  | 'jlpt_n3'
  | 'jlpt_n4'
  | 'jlpt_n5'
  | 'jlpt_none';

// 翻訳辞書
export const translations: Record<Language, Record<TranslationKey, string>> = {
  ja: {
    // 共通
    app_title: 'VISA Scout',
    professional_platform: 'Professional Platform',
    visa_application: 'VISA申請',
    scout: 'スカウト',
    local_demo: 'ローカル完結デモ',
    submit_application: '申請を提出',
    see_scout: 'スカウトを見る',
    apply_now: '応募する',

    // ホームページ
    hero_title: 'VISA申請からキャリアマッチングまで',
    hero_subtitle: 'ローカル完結デモ',
    hero_description: 'APIなし・メモリ＋localStorage＋擬似非同期処理で、リアルなVISA申請体験とスカウト機能を体験できます',
    feature_visa_title: 'VISA申請',
    feature_visa_description: '在留資格、期限、日本語レベルなど、必要な情報を入力してVISA申請を行います',
    feature_scout_title: 'スカウト機能',
    feature_scout_description: '申請情報に基づいて、あなたに最適な求人が自動的にマッチングされます',
    quick_start_title: '簡単3ステップで始める',
    step1: '基本情報を入力',
    step2: 'VISA申請を送信',
    step3: 'マッチング求人を確認',
    visa_application_title: 'VISA申請',
    scout_title: 'スカウト',

    // VISA申請フォーム
    visa_form_title: 'VISA申請フォーム',
    visa_form_subtitle: '必要な情報を入力してVISA申請を行います',
    basic_info: '基本情報',
    visa_info: '在留資格情報',
    language_skills: '語学スキル',
    company_school_info: '会社/学校情報（VISA別）',
    attachments: '添付（任意）',
    company_contact: '企業連絡先',
    name: '氏名',
    birth_date: '生年月日',
    nationality: '国籍',
    gender: '性別',
    passport_number: 'パスポート番号（任意）',
    passport_expiry: 'パスポート有効期限（任意）',
    visa_type: '在留資格',
    visa_expiry: '在留期限',
    jlpt_level: '日本語レベル（JLPT）',
    company_contact_email: '所属企業担当者メール（任意）',
    proof_photo: '証明写真（任意）',
    attachment_files: '添付書類（任意）',
    demo_only: 'デモのため未入力可',
    submit_button: '申請を提出',

    // プレースホルダー
    placeholder_name: '例）山田 太郎',
    placeholder_passport: '例）TR1234567',
    placeholder_email: '例）contact@company.com',
    placeholder_job_description: '例）フロントエンド開発、API連携、UI改善など',
    select_country: '国を選択',
    select_gender: '未選択',
    select_visa_type: '在留資格を選択',
    select_jlpt: 'JLPTレベルを選択',
    select_prefecture: '都道府県を選択',
    male: '男性',
    female: '女性',
    other: 'その他',
    prefer_not_say: '回答しない',

    // VISA種類（翻訳版）
    visa_type_student: '留学',
    visa_type_work: '技術・人文知識・国際業務',
    visa_type_family: '家族滞在',
    visa_type_spouse: '日本人の配偶者等',
    visa_type_business: '経営・管理',

    // 都道府県（翻訳版）
    prefecture_tokyo: '東京都',
    prefecture_osaka: '大阪府',
    prefecture_kyoto: '京都府',
    prefecture_kanagawa: '神奈川県',
    prefecture_aichi: '愛知県',
    prefecture_fukuoka: '福岡県',
    prefecture_hokkaido: '北海道',

    // 雇用形態（翻訳版）
    employment_fulltime: '正社員',
    employment_contract: '契約社員',
    employment_parttime: 'アルバイト',
    employment_dispatch: '派遣',
    employment_freelance: '業務委託',

    // 職務カテゴリ（翻訳版）
    job_category_engineer: 'エンジニア',
    job_category_data: 'データ',
    job_category_design: 'デザイン',
    job_category_product: 'プロダクトマネジメント',
    job_category_sales: '営業',
    job_category_backoffice: 'バックオフィス',
    job_category_support: 'カスタマーサポート',

    // 学歴（翻訳版）
    education_highschool: '高校',
    education_college: '短大',
    education_bachelor: '学士',
    education_master: '修士',
    education_phd: '博士',

    // 労働時間（翻訳版）
    worktime_fulltime: 'フルタイム',
    worktime_parttime: 'パートタイム',
    worktime_shift: 'シフト',

    // 国名（翻訳版）
    country_japan: '日本',
    country_usa: 'アメリカ合衆国',
    country_china: '中国',
    country_korea: '韓国',
    country_taiwan: '台湾',
    country_uk: 'イギリス',
    country_germany: 'ドイツ',
    country_france: 'フランス',
    country_india: 'インド',
    country_vietnam: 'ベトナム',

    // スカウトページ
    your_recommended_jobs: 'あなたに最適な求人',
    matching_application_info: '直近のVISA申請の「在留資格」と「日本語レベル」に合致する求人のみを表示しています',
    jlpt_visa_match: '申請情報連動',
    no_matching_jobs: '条件に合致する求人がありません',
    no_matches_description: '申請は確認できましたが、現在の条件（在留資格/JLPT）に合致する求人が見つかりませんでした。条件を変更して再申請をお試しください。',
    retry_application: 'VISA申請をやり直す',
    start_visa_application: 'VISA申請を開始',
    no_application_found: 'VISA申請から始めましょう',
    no_application_description: '直近のVISA申請が見つかりません。まずはVISA申請を行って、あなたに最適な求人を見つけましょう。',
    loading_jobs: '求人情報を読み込んでいます...',
    apply_success: '応募しました',

    // 求人カード
    japanese_level: '日本語レベル',
    location: '勤務地',
    remote: 'リモート',
    employment_type: '雇用形態',
    applicants: '応募者数',
    required_skills: '必須スキル',
    match_reasons: 'マッチ理由',
    posted_date: '掲載日',
    view_details: '詳細を見る',
    applied: '応募済み',
    apply_job: '応募する',

    // JobCard
    apply_now_available: '今すぐ応募可能',

    // JobDetailModal
    location_label: '勤務地',
    employment_type_label: '雇用形態',
    working_hours_label: '勤務時間',
    holidays_label: '休日',
    work_language_label: '言語(業務)',
    japanese_read_speak_label: '日本語 読み/会話',
    visa_type_label: '在留資格',
    visa_sponsorship_label: 'ビザ支援',
    required_skills_label: '必須スキル',
    welcome_skills_label: '歓迎スキル',
    job_description_label: '仕事内容',
    benefits_label: '福利厚生',
    salary_range_label: '年収レンジ:',
    posted_label: '掲載:',
    updated_label: '更新:',
    applicants_label: '応募者数:',
    view_company_site: '企業サイトを見る',
    close_button: '閉じる',

    // MetaRow
    status_label: '状態:',
    status_open: '募集中',
    status_closed: '募集終了',

    // 言語ボタン
    language_ja: '日本語',
    language_en: 'English',
    language_zh: '中文',

    // JLPTレベル
    jlpt_n1: 'N1',
    jlpt_n2: 'N2',
    jlpt_n3: 'N3',
    jlpt_n4: 'N4',
    jlpt_n5: 'N5',
    jlpt_none: '未取得',

    // VISAフォームの動的フィールド名
    field_所属機関名: '所属機関名',
    field_所在地: '所在地',
    field_雇用形態: '雇用形態',
    field_職務内容: '職務内容',
    field_就労場所: '就労場所',
    field_予定年収: '予定年収',
    field_労働時間: '労働時間',
    field_最終学歴: '最終学歴',
    field_関連職務年数: '関連職務年数',
    field_会社名: '会社名',
    field_事業所所在地: '事業所所在地',
    'field_資本金/出資総額': '資本金/出資総額',
    field_常勤職員数: '常勤職員数',
    field_法人番号: '法人番号',
    field_事業概要: '事業概要',
    field_事業開始状況: '事業開始状況',
    field_学校名: '学校名',
    'field_学部学科/課程': '学部学科/課程',
    'field_在籍区分（正規/研究生等）': '在籍区分（正規/研究生等）',
    field_在学期間: '在学期間',
    'field_奨学金の有無': '奨学金の有無',
    'field_配偶者氏名（日本人）': '配偶者氏名（日本人）',
    field_婚姻日: '婚姻日',
    field_同居状況: '同居状況',
    field_扶養者氏名: '扶養者氏名',
    'field_扶養者の在留資格/期間': '扶養者の在留資格/期間',
    'field_扶養者の勤務先/収入': '扶養者の勤務先/収入',
    field_同居予定住所: '同居予定住所',

    // VISAフォームの固定ラベル
    passport_number_label: 'パスポート番号（任意）',
    passport_expiry_label: 'パスポート有効期限（任意）',
    company_contact_label: '所属企業担当者メール（任意）',
    demo_saved_message: '申請内容を保存しました（デモ）',

    // プレースホルダー
    placeholder_year_income: 'e.g., Annual Salary (in 10,000 yen)',
    placeholder_employee_count: 'e.g., 50',
    placeholder_capital: 'e.g., Capital (in 10,000 yen)',
    placeholder_work_experience: 'e.g., 5',
    placeholder_company_email: 'e.g., contact@company.com',

    // セレクトオプション
    select_category: 'Select category',
    select_employment_type: 'Select employment type',
    select_education_level: 'Select education level',
    select_work_time: 'Select working hours',
    select_enrollment_type: 'Select enrollment status',
    select_scholarship: 'Please select',
    select_living_arrangement: 'Please select',
    option_fulltime: 'Full-time',
    option_contract: 'Contract',
    option_parttime: 'Part-time',
    option_dispatch: 'Temporary',
    option_freelance: 'Freelance',
    option_regular: 'Regular',
    option_researcher: 'Research Student',
    option_exchange: 'Exchange Student',
    option_auditor: 'Auditor',
    option_yes: 'Yes',
    option_no: 'No',
    option_together: 'Living Together',
    option_separate: 'Living Separately',
    option_highschool: 'High School',
    option_college: 'College',
    option_bachelor: 'Bachelor\'s',
    option_master: 'Master\'s',
    option_phd: 'PhD',
    option_fulltime_work: 'Full-time',
    option_parttime_work: 'Part-time',
    option_shift_work: 'Shift Work'
  },

  en: {
    // 共通
    app_title: 'VISA Scout',
    professional_platform: 'Professional Platform',
    visa_application: 'VISA Application',
    scout: 'Scout',
    local_demo: 'Local Demo',
    submit_application: 'Submit Application',
    see_scout: 'See Scout',
    apply_now: 'Apply Now',

    // ホームページ
    hero_title: 'From VISA Application to Career Matching',
    hero_subtitle: 'Local Demo',
    hero_description: 'Experience realistic VISA application and scout features with no API, using memory + localStorage + pseudo-async processing',
    feature_visa_title: 'VISA Application',
    feature_visa_description: 'Enter required information including visa status, expiration date, and Japanese level for VISA application',
    feature_scout_title: 'Scout Feature',
    feature_scout_description: 'Automatically match you with optimal job opportunities based on your application information',
    quick_start_title: 'Start in 3 Easy Steps',
    step1: 'Enter basic information',
    step2: 'Submit VISA application',
    step3: 'Check matching jobs',
    visa_application_title: 'VISA Application',
    scout_title: 'Scout',

    // VISA申請フォーム
    visa_form_title: 'VISA Application Form',
    visa_form_subtitle: 'Enter required information to submit your VISA application',
    basic_info: 'Basic Information',
    visa_info: 'Visa Information',
    language_skills: 'Language Skills',
    company_school_info: 'Company/School Information (VISA-specific)',
    attachments: 'Attachments (Optional)',
    company_contact: 'Company Contact',
    name: 'Full Name',
    birth_date: 'Date of Birth',
    nationality: 'Nationality',
    gender: 'Gender',
    passport_number: 'Passport Number (Optional)',
    passport_expiry: 'Passport Expiry Date (Optional)',
    visa_type: 'Visa Type',
    visa_expiry: 'Visa Expiration Date',
    jlpt_level: 'Japanese Level (JLPT)',
    company_contact_email: 'Company Contact Email (Optional)',
    proof_photo: 'Proof Photo (Optional)',
    attachment_files: 'Attachment Files (Optional)',
    demo_only: 'Available for demo only',
    submit_button: 'Submit Application',

    // プレースホルダー
    placeholder_name: 'e.g., John Doe',
    placeholder_passport: 'e.g., TR1234567',
    placeholder_email: 'e.g., contact@company.com',
    placeholder_job_description: 'e.g., Frontend development, API integration, UI improvements, etc.',
    select_country: 'Select country',
    select_gender: 'Not selected',
    select_visa_type: 'Select visa type',
    select_jlpt: 'Select JLPT level',
    select_prefecture: 'Select prefecture',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    prefer_not_say: 'Prefer not to say',

    // VISA種類（翻訳版）
    visa_type_student: 'Student',
    visa_type_work: 'Skilled Worker',
    visa_type_family: 'Family Stay',
    visa_type_spouse: 'Spouse of Japanese National',
    visa_type_business: 'Business Manager',

    // 都道府県（翻訳版）
    prefecture_tokyo: 'Tokyo',
    prefecture_osaka: 'Osaka',
    prefecture_kyoto: 'Kyoto',
    prefecture_kanagawa: 'Kanagawa',
    prefecture_aichi: 'Aichi',
    prefecture_fukuoka: 'Fukuoka',
    prefecture_hokkaido: 'Hokkaido',

    // 雇用形態（翻訳版）
    employment_fulltime: 'Full-time',
    employment_contract: 'Contract',
    employment_parttime: 'Part-time',
    employment_dispatch: 'Temporary',
    employment_freelance: 'Freelance',

    // 職務カテゴリ（翻訳版）
    job_category_engineer: 'Engineering',
    job_category_data: 'Data',
    job_category_design: 'Design',
    job_category_product: 'Product Management',
    job_category_sales: 'Sales',
    job_category_backoffice: 'Back Office',
    job_category_support: 'Customer Support',

    // 学歴（翻訳版）
    education_highschool: 'High School',
    education_college: 'College',
    education_bachelor: 'Bachelor\'s',
    education_master: 'Master\'s',
    education_phd: 'PhD',

    // 労働時間（翻訳版）
    worktime_fulltime: 'Full-time',
    worktime_parttime: 'Part-time',
    worktime_shift: 'Shift Work',

    // 国名（翻訳版）
    country_japan: 'Japan',
    country_usa: 'United States',
    country_china: 'China',
    country_korea: 'South Korea',
    country_taiwan: 'Taiwan',
    country_uk: 'United Kingdom',
    country_germany: 'Germany',
    country_france: 'France',
    country_india: 'India',
    country_vietnam: 'Vietnam',

    // スカウトページ
    your_recommended_jobs: 'Your Recommended Jobs',
    matching_application_info: 'Showing only jobs that match your recent VISA application\'s visa type and Japanese level',
    jlpt_visa_match: 'Application Linked',
    no_matching_jobs: 'No Matching Jobs Found',
    no_matches_description: 'Your application was found, but no jobs match your current criteria (visa type/JLPT level). Please try reapplying with different conditions.',
    retry_application: 'Retry VISA Application',
    start_visa_application: 'Start VISA Application',
    no_application_found: 'Start with VISA Application',
    no_application_description: 'No recent VISA application found. Please submit a VISA application first to find your optimal job matches.',
    loading_jobs: 'Loading job information...',
    apply_success: 'Application submitted',

    // 求人カード
    japanese_level: 'Japanese Level',
    location: 'Location',
    remote: 'Remote',
    employment_type: 'Employment Type',
    applicants: 'Applicants',
    required_skills: 'Required Skills',
    match_reasons: 'Match Reasons',
    posted_date: 'Posted Date',
    view_details: 'View Details',
    applied: 'Applied',
    apply_job: 'Apply',

    // JobCard
    apply_now_available: 'Apply Now Available',

    // JobDetailModal
    location_label: 'Location',
    employment_type_label: 'Employment Type',
    working_hours_label: 'Working Hours',
    holidays_label: 'Holidays',
    work_language_label: 'Work Language',
    japanese_read_speak_label: 'Japanese Reading/Speaking',
    visa_type_label: 'Visa Type',
    visa_sponsorship_label: 'Visa Sponsorship',
    required_skills_label: 'Required Skills',
    welcome_skills_label: 'Welcome Skills',
    job_description_label: 'Job Description',
    benefits_label: 'Benefits',
    salary_range_label: 'Salary Range:',
    posted_label: 'Posted:',
    updated_label: 'Updated:',
    applicants_label: 'Applicants:',
    view_company_site: 'View Company Site',
    close_button: 'Close',

    // MetaRow
    status_label: 'Status:',
    status_open: 'Open',
    status_closed: 'Closed',

    // 言語ボタン
    language_ja: '日本語',
    language_en: 'English',
    language_zh: '中文',

    // JLPTレベル
    jlpt_n1: 'N1',
    jlpt_n2: 'N2',
    jlpt_n3: 'N3',
    jlpt_n4: 'N4',
    jlpt_n5: 'N5',
    jlpt_none: 'Not obtained',

    // VISAフォームの動的フィールド名
    field_所属機関名: 'Company/Organization Name',
    field_所在地: 'Location',
    field_雇用形態: 'Employment Type',
    field_職務内容: 'Job Description',
    field_就労場所: 'Work Location',
    field_予定年収: 'Expected Annual Salary',
    field_労働時間: 'Working Hours',
    field_最終学歴: 'Highest Education',
    field_関連職務年数: 'Years of Relevant Experience',
    field_会社名: 'Company Name',
    field_事業所所在地: 'Office Location',
    'field_資本金/出資総額': 'Capital/Investment Amount',
    field_常勤職員数: 'Number of Full-time Employees',
    field_法人番号: 'Corporate Number',
    field_事業概要: 'Business Overview',
    field_事業開始状況: 'Business Start Status',
    field_学校名: 'School Name',
    'field_学部学科/課程': 'Faculty/Department/Course',
    'field_在籍区分（正規/研究生等）': 'Enrollment Status (Regular/Research Student, etc.)',
    field_在学期間: 'Study Period',
    'field_奨学金の有無': 'Scholarship Status',
    'field_配偶者氏名（日本人）': 'Spouse Name (Japanese National)',
    field_婚姻日: 'Marriage Date',
    field_同居状況: 'Living Situation',
    field_扶養者氏名: 'Supporter Name',
    'field_扶養者の在留資格/期間': 'Supporter\'s Visa Status/Period',
    'field_扶養者の勤務先/収入': 'Supporter\'s Workplace/Income',
    field_同居予定住所: 'Planned Address for Living Together',

    // VISAフォームの固定ラベル
    passport_number_label: 'Passport Number (Optional)',
    passport_expiry_label: 'Passport Expiry Date (Optional)',
    company_contact_label: 'Company Contact Email (Optional)',
    demo_saved_message: 'Application saved successfully (Demo)',

    // プレースホルダー
    placeholder_year_income: 'e.g., Annual Salary (in 10,000 yen)',
    placeholder_employee_count: 'e.g., 50',
    placeholder_capital: 'e.g., Capital (in 10,000 yen)',
    placeholder_work_experience: 'e.g., 5',
    placeholder_company_email: 'e.g., contact@company.com',

    // セレクトオプション
    select_category: 'Select category',
    select_employment_type: 'Select employment type',
    select_education_level: 'Select education level',
    select_work_time: 'Select working hours',
    select_enrollment_type: 'Select enrollment status',
    select_scholarship: 'Please select',
    select_living_arrangement: 'Please select',
    option_fulltime: 'Full-time',
    option_contract: 'Contract',
    option_parttime: 'Part-time',
    option_dispatch: 'Temporary',
    option_freelance: 'Freelance',
    option_regular: 'Regular',
    option_researcher: 'Research Student',
    option_exchange: 'Exchange Student',
    option_auditor: 'Auditor',
    option_yes: 'Yes',
    option_no: 'No',
    option_together: 'Living Together',
    option_separate: 'Living Separately',
    option_highschool: 'High School',
    option_college: 'College',
    option_bachelor: 'Bachelor\'s',
    option_master: 'Master\'s',
    option_phd: 'PhD',
    option_fulltime_work: 'Full-time',
    option_parttime_work: 'Part-time',
    option_shift_work: 'Shift Work'
  },

  zh: {
    // 共通
    app_title: 'VISA Scout',
    professional_platform: 'Professional Platform',
    visa_application: '签证申请',
    scout: '人才发掘',
    local_demo: '本地演示',
    submit_application: '提交申请',
    see_scout: '查看人才发掘',
    apply_now: '立即申请',

    // ホームページ
    hero_title: '从签证申请到职业匹配',
    hero_subtitle: '本地演示',
    hero_description: '无需API，使用内存+localStorage+伪异步处理，体验真实的签证申请和人才发掘功能',
    feature_visa_title: '签证申请',
    feature_visa_description: '输入必要的在留资格、期限、日语水平等信息进行签证申请',
    feature_scout_title: '人才发掘功能',
    feature_scout_description: '基于您的申请信息，自动匹配最适合的工作机会',
    quick_start_title: '3个简单步骤开始',
    step1: '输入基本信息',
    step2: '提交签证申请',
    step3: '查看匹配的工作',
    visa_application_title: '签证申请',
    scout_title: '人才发掘',

    // VISA申請フォーム
    visa_form_title: '签证申请表',
    visa_form_subtitle: '输入必要信息提交签证申请',
    basic_info: '基本信息',
    visa_info: '在留资格信息',
    language_skills: '语言能力',
    company_school_info: '公司/学校信息（根据签证类型）',
    attachments: '附件（可选）',
    company_contact: '公司联系人',
    name: '姓名',
    birth_date: '出生日期',
    nationality: '国籍',
    gender: '性别',
    passport_number: '护照号码（可选）',
    passport_expiry: '护照有效期（可选）',
    visa_type: '在留资格',
    visa_expiry: '在留期限',
    jlpt_level: '日语水平（JLPT）',
    company_contact_email: '所属公司负责人邮箱（可选）',
    proof_photo: '证件照（可选）',
    attachment_files: '附件文件（可选）',
    demo_only: '仅用于演示',
    submit_button: '提交申请',

    // プレースホルダー
    placeholder_name: '例如：山田太郎',
    placeholder_passport: '例如：TR1234567',
    placeholder_email: '例如：contact@company.com',
    placeholder_job_description: '例如：前端开发、API整合、UI改善等',
    select_country: '选择国家',
    select_gender: '未选择',
    select_visa_type: '选择在留资格',
    select_jlpt: '选择JLPT等级',
    select_prefecture: '选择都道府县',
    male: '男性',
    female: '女性',
    other: '其他',
    prefer_not_say: '不愿回答',

    // VISA種類（翻訳版）
    visa_type_student: '留学',
    visa_type_work: '技术・人文知识・国际业务',
    visa_type_family: '家属滞在',
    visa_type_spouse: '日本人配偶者等',
    visa_type_business: '经营・管理',

    // 都道府県（翻訳版）
    prefecture_tokyo: '东京都',
    prefecture_osaka: '大阪府',
    prefecture_kyoto: '京都府',
    prefecture_kanagawa: '神奈川县',
    prefecture_aichi: '爱知县',
    prefecture_fukuoka: '福冈县',
    prefecture_hokkaido: '北海道',

    // 雇用形態（翻訳版）
    employment_fulltime: '正式员工',
    employment_contract: '合同员工',
    employment_parttime: '兼职',
    employment_dispatch: '派遣',
    employment_freelance: '业务委托',

    // 職務カテゴリ（翻訳版）
    job_category_engineer: '工程师',
    job_category_data: '数据',
    job_category_design: '设计',
    job_category_product: '产品管理',
    job_category_sales: '销售',
    job_category_backoffice: '后台办公',
    job_category_support: '客户支持',

    // 学歴（翻訳版）
    education_highschool: '高中',
    education_college: '专科',
    education_bachelor: '学士',
    education_master: '硕士',
    education_phd: '博士',

    // 労働時間（翻訳版）
    worktime_fulltime: '全职',
    worktime_parttime: '兼职',
    worktime_shift: '轮班',

    // 国名（翻訳版）
    country_japan: '日本',
    country_usa: '美国',
    country_china: '中国',
    country_korea: '韩国',
    country_taiwan: '台湾',
    country_uk: '英国',
    country_germany: '德国',
    country_france: '法国',
    country_india: '印度',
    country_vietnam: '越南',

    // スカウトページ
    your_recommended_jobs: '为您推荐的工作',
    matching_application_info: '仅显示符合您最近签证申请的在留资格和日语水平的工作',
    jlpt_visa_match: '申请信息联动',
    no_matching_jobs: '未找到符合条件的工作',
    no_matches_description: '您的申请已确认，但没有符合当前条件（在留资格/JLPT水平）的工作。请尝试修改条件重新申请。',
    retry_application: '重新进行签证申请',
    start_visa_application: '开始签证申请',
    no_application_found: '从签证申请开始',
    no_application_description: '未找到最近的签证申请。请先提交签证申请，找到最适合您的工作匹配。',
    loading_jobs: '正在加载工作信息...',
    apply_success: '申请已提交',

    // 求人カード
    japanese_level: '日语水平',
    location: '工作地点',
    remote: '远程',
    employment_type: '雇用形态',
    applicants: '申请人数',
    required_skills: '必需技能',
    match_reasons: '匹配理由',
    posted_date: '发布日期',
    view_details: '查看详情',
    applied: '已申请',
    apply_job: '申请',

    // JobCard
    apply_now_available: '立即申请',

    // JobDetailModal
    location_label: '工作地点',
    employment_type_label: '雇用形态',
    working_hours_label: '工作时间',
    holidays_label: '休息日',
    work_language_label: '工作语言',
    japanese_read_speak_label: '日语读/说',
    visa_type_label: '在留资格',
    visa_sponsorship_label: '签证支援',
    required_skills_label: '必需技能',
    welcome_skills_label: '欢迎技能',
    job_description_label: '工作内容',
    benefits_label: '福利待遇',
    salary_range_label: '年收入范围:',
    posted_label: '发布:',
    updated_label: '更新:',
    applicants_label: '申请人数:',
    view_company_site: '查看企业网站',
    close_button: '关闭',

    // MetaRow
    status_label: '状态:',
    status_open: '正在招聘',
    status_closed: '招聘结束',

    // 言語ボタン
    language_ja: '日本語',
    language_en: 'English',
    language_zh: '中文',

    // JLPTレベル
    jlpt_n1: 'N1',
    jlpt_n2: 'N2',
    jlpt_n3: 'N3',
    jlpt_n4: 'N4',
    jlpt_n5: 'N5',
    jlpt_none: '未获得',

    // VISAフォームの動的フィールド名
    field_所属機関名: '所属机构名称',
    field_所在地: '所在地',
    field_雇用形態: '雇用形态',
    field_職務内容: '职务内容',
    field_就労場所: '工作地点',
    field_予定年収: '预计年收入',
    field_労働時間: '工作时间',
    field_最終学歴: '最终学历',
    field_関連職務年数: '相关职务年数',
    field_会社名: '公司名称',
    field_事業所所在地: '事务所所在地',
    'field_資本金/出資総額': '资本金/出资总额',
    field_常勤職員数: '常勤职员数',
    field_法人番号: '法人编号',
    field_事業概要: '事业概要',
    field_事業開始状況: '事业开始情况',
    field_学校名: '学校名称',
    'field_学部学科/課程': '学部/学科/课程',
    'field_在籍区分（正規/研究生等）': '在籍区分（正规/研究生等）',
    field_在学期間: '在学期间',
    'field_奨学金の有無': '奖学金的有无',
    'field_配偶者氏名（日本人）': '配偶者姓名（日本人）',
    field_婚姻日: '结婚日期',
    field_同居状況: '同居情况',
    field_扶養者氏名: '抚养者姓名',
    'field_扶養者の在留資格/期間': '抚养者的在留资格/期间',
    'field_扶養者の勤務先/収入': '抚养者的工作单位/收入',
    field_同居予定住所: '计划同居地址',

    // VISAフォームの固定ラベル
    passport_number_label: '护照号码（可选）',
    passport_expiry_label: '护照有效期（可选）',
    company_contact_label: '所属企业负责人邮箱（可选）',
    demo_saved_message: '申请内容已保存（演示）',

    // プレースホルダー
    placeholder_year_income: '例如：年收入（万日元）',
    placeholder_employee_count: '例如：50',
    placeholder_capital: '例如：资本金（万日元）',
    placeholder_work_experience: '例如：5',
    placeholder_company_email: '例如：contact@company.com',

    // セレクトオプション
    select_category: '选择类别',
    select_employment_type: '选择雇用形态',
    select_education_level: '选择学历',
    select_work_time: '选择工作时间',
    select_enrollment_type: '选择在籍区分',
    select_scholarship: '请选择',
    select_living_arrangement: '请选择',
    option_fulltime: '正式员工',
    option_contract: '合同员工',
    option_parttime: '兼职',
    option_dispatch: '派遣',
    option_freelance: '业务委托',
    option_regular: '正规',
    option_researcher: '研究生',
    option_exchange: '交换留学生',
    option_auditor: '旁听生',
    option_yes: '有',
    option_no: '无',
    option_together: '同居',
    option_separate: '别居',
    option_highschool: '高中',
    option_college: '专科',
    option_bachelor: '学士',
    option_master: '硕士',
    option_phd: '博士',
    option_fulltime_work: '全职',
    option_parttime_work: '兼职',
    option_shift_work: '轮班'
  }
};

// 翻訳関数
export function t(key: TranslationKey, language: Language): string {
  return translations[language]?.[key] || key;
}

// localStorageキー
export const LANGUAGE_STORAGE_KEY = 'visa_scout_language';

// デフォルト言語
export const DEFAULT_LANGUAGE: Language = 'ja';

// 言語の保存
export function saveLanguage(language: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
}

// 言語の読み込み
export function loadLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && ['ja', 'en', 'zh'].includes(stored)) {
    return stored as Language;
  }

  return DEFAULT_LANGUAGE;
}
