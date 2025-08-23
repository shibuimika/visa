import { Language } from './i18n';

// 場所翻訳のマッピング定義
export const LOCATION_MAPPINGS = {
  // 都道府県
  '北海道': { en: 'Hokkaido', zh: '北海道' },
  '青森県': { en: 'Aomori', zh: '青森县' },
  '岩手県': { en: 'Iwate', zh: '岩手县' },
  '宮城県': { en: 'Miyagi', zh: '宫城县' },
  '秋田県': { en: 'Akita', zh: '秋田县' },
  '山形県': { en: 'Yamagata', zh: '山形县' },
  '福島県': { en: 'Fukushima', zh: '福岛县' },
  '茨城県': { en: 'Ibaraki', zh: '茨城县' },
  '栃木県': { en: 'Tochigi', zh: '栃木县' },
  '群馬県': { en: 'Gunma', zh: '群马县' },
  '埼玉県': { en: 'Saitama', zh: '埼玉县' },
  '千葉県': { en: 'Chiba', zh: '千叶县' },
  '東京都': { en: 'Tokyo', zh: '东京都' },
  '神奈川県': { en: 'Kanagawa', zh: '神奈川县' },
  '新潟県': { en: 'Niigata', zh: '新潟县' },
  '富山県': { en: 'Toyama', zh: '富山县' },
  '石川県': { en: 'Ishikawa', zh: '石川县' },
  '福井県': { en: 'Fukui', zh: '福井县' },
  '山梨県': { en: 'Yamanashi', zh: '山梨县' },
  '長野県': { en: 'Nagano', zh: '长野县' },
  '岐阜県': { en: 'Gifu', zh: '岐阜县' },
  '静岡県': { en: 'Shizuoka', zh: '静冈县' },
  '愛知県': { en: 'Aichi', zh: '爱知县' },
  '三重県': { en: 'Mie', zh: '三重县' },
  '滋賀県': { en: 'Shiga', zh: '滋贺县' },
  '京都府': { en: 'Kyoto', zh: '京都府' },
  '大阪府': { en: 'Osaka', zh: '大阪府' },
  '兵庫県': { en: 'Hyogo', zh: '兵库县' },
  '奈良県': { en: 'Nara', zh: '奈良县' },
  '和歌山県': { en: 'Wakayama', zh: '和歌山县' },
  '鳥取県': { en: 'Tottori', zh: '鸟取县' },
  '島根県': { en: 'Shimane', zh: '岛根县' },
  '岡山県': { en: 'Okayama', zh: '冈山县' },
  '広島県': { en: 'Hiroshima', zh: '广岛县' },
  '山口県': { en: 'Yamaguchi', zh: '山口县' },
  '徳島県': { en: 'Tokushima', zh: '德岛县' },
  '香川県': { en: 'Kagawa', zh: '香川县' },
  '愛媛県': { en: 'Ehime', zh: '爱媛县' },
  '高知県': { en: 'Kochi', zh: '高知县' },
  '福岡県': { en: 'Fukuoka', zh: '福冈县' },
  '佐賀県': { en: 'Saga', zh: '佐贺县' },
  '長崎県': { en: 'Nagasaki', zh: '长崎县' },
  '熊本県': { en: 'Kumamoto', zh: '熊本县' },
  '大分県': { en: 'Oita', zh: '大分县' },
  '宮崎県': { en: 'Miyazaki', zh: '宫崎县' },
  '鹿児島県': { en: 'Kagoshima', zh: '鹿儿岛县' },
  '沖縄県': { en: 'Okinawa', zh: '冲绳县' },
  
  // 市区町村
  '渋谷区': { en: 'Shibuya', zh: '涩谷区' },
  '港区': { en: 'Minato', zh: '港区' },
  '新宿区': { en: 'Shinjuku', zh: '新宿区' },
  '中央区': { en: 'Chuo', zh: '中央区' },
  '品川区': { en: 'Shinagawa', zh: '品川区' },
  '杉並区': { en: 'Suginami', zh: '杉并区' },
  '千代田区': { en: 'Chiyoda', zh: '千代田区' },
  '目黒区': { en: 'Meguro', zh: '目黑区' },
  '文京区': { en: 'Bunkyo', zh: '文京区' },
  '横浜市': { en: 'Yokohama', zh: '横滨市' },
  '船橋市': { en: 'Funabashi', zh: '船桥市' },
  '市川市': { en: 'Ichikawa', zh: '市川市' },
  '川口市': { en: 'Kawaguchi', zh: '川口市' },
  
  // 追加情報
  '（リモート可）': { en: ' (Remote Available)', zh: '（远程可）' },
  '（リモート一部可）': { en: ' (Partial Remote)', zh: '（部分远程可）' },
  
  // 雇用形態
  '正社員': { en: 'Full-time', zh: '正式员工' },
  '契約社員': { en: 'Contract', zh: '合同员工' },
  'アルバイト': { en: 'Part-time', zh: '兼职' },
  '派遣': { en: 'Temporary', zh: '派遣' },
  '業務委託': { en: 'Freelance', zh: '业务委托' },
};

/**
 * 場所文字列を指定言語に翻訳する
 */
export function translateLocation(location: string, language: Language): string {
  if (language === 'ja') {
    return location; // 日本語の場合はそのまま返す
  }
  
  let translatedLocation = location;
  
  // マッピングを使用して段階的に置換
  Object.entries(LOCATION_MAPPINGS).forEach(([japanese, translations]) => {
    if (translatedLocation.includes(japanese)) {
      const translation = language === 'en' ? translations.en : translations.zh;
      translatedLocation = translatedLocation.replace(japanese, translation);
    }
  });
  
  return translatedLocation;
}

/**
 * 雇用形態を指定言語に翻訳する
 */
export function translateEmploymentType(employmentType: string, language: Language): string {
  if (language === 'ja') {
    return employmentType; // 日本語の場合はそのまま返す
  }
  
  const mapping = LOCATION_MAPPINGS[employmentType as keyof typeof LOCATION_MAPPINGS];
  if (mapping) {
    return language === 'en' ? mapping.en : mapping.zh;
  }
  
  return employmentType; // マッピングが見つからない場合はそのまま返す
}
