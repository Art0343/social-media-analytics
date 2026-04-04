import { format, subDays, eachDayOfInterval } from 'date-fns';
import { AD_SPEND_STACK_KEYS, isAdAccountPlatformSlug } from '@/lib/platform-colors';

export type AdSpendChartRow = { month: string } & Record<string, string | number>;

export type AdSpendStackKey = { key: string; name: string };

type AdSpendSummaryInput = Readonly<{
  platformSlug: string;
  adSpend: number | null;
  date?: Date | null;
}>;

/**
 * Build stacked ad spend chart rows from platform daily summaries (already scoped to connected accounts).
 * Only includes Ads Manager / ad-account slugs (`*-ads`); organic social profile rows are omitted.
 */
export function buildAdSpendChartFromSummaries(
  summaries: ReadonlyArray<AdSpendSummaryInput>,
  days: number
): { data: AdSpendChartRow[]; stackKeys: AdSpendStackKey[] } {
  const endDate = new Date();
  const startDate = subDays(endDate, days);

  const inRange = (d: Date) => {
    const t = d.getTime();
    return t >= startDate.getTime() && t <= endDate.getTime();
  };

  const filtered = summaries.filter(
    (s): s is AdSpendSummaryInput & { date: Date } =>
      s.date != null && inRange(new Date(s.date))
  );

  const adOnly = filtered.filter((s) => isAdAccountPlatformSlug(s.platformSlug));

  const slugSet = new Set(adOnly.map((s) => s.platformSlug));
  const known = AD_SPEND_STACK_KEYS.filter((k) => slugSet.has(k.key));
  const unknownSlugs = [...slugSet].filter((s) => !AD_SPEND_STACK_KEYS.some((k) => k.key === s));
  const stackKeys: AdSpendStackKey[] = [
    ...known,
    ...unknownSlugs.map((slug) => ({ key: slug, name: slug })),
  ];

  if (stackKeys.length === 0) {
    return { data: [], stackKeys: [] };
  }

  const initRow = (label: string): AdSpendChartRow => {
    const row: AdSpendChartRow = { month: label };
    stackKeys.forEach((k) => {
      row[k.key] = 0;
    });
    return row;
  };

  const isLongPeriod = days > 90;

  if (isLongPeriod) {
    const monthlyData: Record<string, Record<string, number>> = {};
    adOnly.forEach((s) => {
      const monthKey = format(new Date(s.date), 'MMM');
      if (!monthlyData[monthKey]) monthlyData[monthKey] = {};
      const spend = s.adSpend || 0;
      monthlyData[monthKey][s.platformSlug] =
        (monthlyData[monthKey][s.platformSlug] || 0) + spend;
    });
    const data = Object.entries(monthlyData).map(([month, spending]) => {
      const row = initRow(month);
      stackKeys.forEach((k) => {
        row[k.key] = spending[k.key] || 0;
      });
      return row;
    });
    return { data, stackKeys };
  }

  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
  const dailyData: Record<string, Record<string, number>> = {};
  dateRange.forEach((date) => {
    dailyData[format(date, 'MMM dd')] = {};
  });

  adOnly.forEach((s) => {
    const key = format(new Date(s.date), 'MMM dd');
    if (!(key in dailyData)) return;
    const spend = s.adSpend || 0;
    dailyData[key][s.platformSlug] = (dailyData[key][s.platformSlug] || 0) + spend;
  });

  const data = Object.keys(dailyData).map((label) => {
    const spending = dailyData[label];
    const row = initRow(label);
    stackKeys.forEach((k) => {
      row[k.key] = spending[k.key] || 0;
    });
    return row;
  });

  return { data, stackKeys };
}
