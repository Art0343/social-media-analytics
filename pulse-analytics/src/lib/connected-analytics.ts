import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

/**
 * Platform slugs that still have at least one CONNECTED account for the workspace.
 * Analytics (summaries, mix, spend) are scoped to these slugs.
 */
export async function getActiveConnectedPlatformSlugs(workspaceId: string): Promise<string[]> {
  const rows = await prisma.connectedAccount.findMany({
    where: { workspaceId, status: 'CONNECTED' },
    select: { platform: { select: { slug: true } } },
  });
  return [...new Set(rows.map((r) => r.platform.slug))];
}

/** Use when no platforms are connected — matches no summary rows. */
export const NO_PLATFORM_PLACEHOLDER = '__no_connected_platform__';

export function summaryWhereForConnectedPlatforms(
  workspaceId: string,
  slugs: string[],
  dateFilter: Prisma.DateTimeFilter
): Prisma.PlatformDailySummaryWhereInput {
  if (slugs.length === 0) {
    return {
      workspaceId,
      platformSlug: NO_PLATFORM_PLACEHOLDER,
      date: dateFilter,
    };
  }
  return {
    workspaceId,
    platformSlug: { in: slugs },
    date: dateFilter,
  };
}

/** Posts only from accounts that are still connected (after disconnect, analytics hide those posts). */
export function postWhereConnected(
  workspaceId: string,
  publishedAt: Prisma.DateTimeFilter
): Prisma.PostWhereInput {
  return {
    workspaceId,
    publishedAt,
    connectedAccount: { status: 'CONNECTED' },
  };
}
