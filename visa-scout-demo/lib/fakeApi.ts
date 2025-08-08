import type { Application, Job } from '@/lib/mockData';
import { jobs } from '@/lib/mockData';

// 擬似遅延を伴うAPI風ユーティリティ
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function submitVisaApplication(app: Application): Promise<{ id: string }> {
  await sleep(400);
  const id = Math.random().toString(36).slice(2, 8);
  if (typeof window !== 'undefined') {
    localStorage.setItem('lastApplication', JSON.stringify({ id, ...app }));
  }
  return { id };
}

export type LastApplication = Application & { id: string };

export function loadLastApplication(): LastApplication | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('lastApplication');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LastApplication;
  } catch {
    return null;
  }
}

export function filterJobsBy(app: { visaKind: Application['visaKind']; jlpt: Application['jlpt'] }): Job[] {
  return jobs.filter((j) => j.visaKind === app.visaKind && j.jlpt === app.jlpt);
}

export function loadAppliedJobs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('appliedJobs');
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveAppliedJobs(ids: string[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('appliedJobs', JSON.stringify(ids));
}

// ----------------------
// より現実的なスコアリング付きマッチング
// ----------------------
export type MatchReason = {
  label: string; // 例: "在留資格一致"
  weight: number; // その理由のスコア配分
};

export type ScoredJob = Job & {
  score: number; // 0-100
  reasons: MatchReason[];
};

const jlptOrder = ['未取得', 'N5', 'N4', 'N3', 'N2', 'N1'] as const;

function calcJlptScore(appJlpt: Application['jlpt'], jobJlpt: Job['jlpt']): MatchReason | null {
  const a = jlptOrder.indexOf(appJlpt);
  const b = jlptOrder.indexOf(jobJlpt);
  if (a === -1 || b === -1) return null;
  if (a === b) return { label: '日本語レベル完全一致', weight: 50 };
  if (Math.abs(a - b) === 1) return { label: '日本語レベル近似（±1）', weight: 30 };
  return null;
}

function calcVisaScore(appVisa: Application['visaKind'], jobVisa: Job['visaKind']): MatchReason | null {
  if (appVisa === jobVisa) return { label: '在留資格一致', weight: 40 };
  return null;
}

function calcRecencyScore(job: Job): MatchReason | null {
  // 掲載の新しさで最大10点ボーナス（直近14日以内なら満点、逓減）
  const dateStr = (job as Job & { postedDate?: string }).postedDate;
  if (!dateStr) return null;
  const posted = new Date(dateStr).getTime();
  if (Number.isNaN(posted)) return null;
  const days = (Date.now() - posted) / (1000 * 60 * 60 * 24);
  const weight = Math.max(0, Math.min(10, Math.round((14 - days) * (10 / 14))));
  if (weight <= 0) return null;
  return { label: '新着求人ボーナス', weight };
}

export function matchJobsWithScore(app: Application): ScoredJob[] {
  const results: ScoredJob[] = jobs
    .map((job) => {
      const reasons: MatchReason[] = [];
      const jlpt = calcJlptScore(app.jlpt, job.jlpt);
      if (jlpt) reasons.push(jlpt);
      const visa = calcVisaScore(app.visaKind, job.visaKind);
      if (visa) reasons.push(visa);
      const recency = calcRecencyScore(job);
      if (recency) reasons.push(recency);

      const score = Math.max(0, Math.min(100, reasons.reduce((s, r) => s + r.weight, 0)));
      return { ...job, score, reasons } as ScoredJob;
    })
    // スコア0の求人は除外（ヒットなし扱い）
    .filter((j) => j.score > 0)
    // スコア降順、同点は新着優先
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const ad = (a.postedDate ? new Date(a.postedDate).getTime() : 0) || 0;
      const bd = (b.postedDate ? new Date(b.postedDate).getTime() : 0) || 0;
      return bd - ad;
    });

  return results;
}


