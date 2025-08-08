export function formatYenMan(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) return '- 円';
  const n = Math.round(value);
  return `¥${n.toLocaleString()} 万円`;
}

export function formatSalaryRange(min?: number, max?: number, base?: number): string {
  if (typeof min === 'number' && typeof max === 'number') {
    return `¥${Math.round(min).toLocaleString()}〜${Math.round(max).toLocaleString()} 万円`;
  }
  if (typeof base === 'number') {
    return formatYenMan(base);
  }
  return '-';
}

export function formatRelative(dateStr?: string): string {
  if (!dateStr) return '-';
  const time = new Date(dateStr).getTime();
  if (Number.isNaN(time)) return '-';
  const diffMs = Date.now() - time;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays < 0) {
    const d = Math.ceil(-diffDays);
    return `${d}日後`;
  }
  if (diffDays < 1) return '今日';
  const d = Math.floor(diffDays);
  return `${d}日前`;
}


