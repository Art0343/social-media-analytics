import { prisma } from '@/lib/prisma';
import PlatformsClient from './PlatformsClient';

async function getPlatforms() {
  const platforms = await prisma.socialPlatform.findMany({
    orderBy: { name: 'asc' },
  });
  return platforms.map((p: { id: string; name: string; slug: string; brandColor: string; iconUrl: string | null; isActive: boolean; isBuiltIn: boolean }) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    brandColor: p.brandColor,
    icon: p.iconUrl || 'extension',
    isActive: p.isActive,
    isBuiltIn: p.isBuiltIn,
  }));
}

export default async function PlatformRegistryPage() {
  const platforms = await getPlatforms();
  return <PlatformsClient initialPlatforms={platforms} />;
}
