import { NextResponse } from 'next/server';
import { resetDemoConnectedAccounts } from '@/lib/demo-connection-reset';

/** Dev-only: restore CONNECTED status for the demo workspace (used after full page load). */
export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await resetDemoConnectedAccounts();
  return NextResponse.json({ ok: true });
}
