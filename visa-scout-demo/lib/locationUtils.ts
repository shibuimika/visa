import { Language } from './i18n';

// 場所翻訳のマッピング定義
export const LOCATION_MAPPINGS = {
  // 都道府県
  '東京都': { en: 'Tokyo', zh: '东京都' },
  '神奈川県': { en: 'Kanagawa', zh: '神奈川县' },
  '千葉県': { en: 'Chiba', zh: '千叶县' },
  '埼玉県': { en: 'Saitama', zh: '埼玉县' },
  
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
