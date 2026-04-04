'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * On each full document load in development, restore demo workspace connections so
 * disconnect from Connect Accounts is not permanent until the next reload or restart.
 */
export default function DemoConnectionBootstrap() {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/dev/reset-demo-connections', { method: 'POST' });
        if (!cancelled && res.ok) {
          router.refresh();
        }
      } catch {
        // ignore — dev convenience only
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return null;
}
