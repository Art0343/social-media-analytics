import { prisma } from '@/lib/prisma';

const DEMO_WORKSPACE_ID = 'ws-demo-pulse';

/**
 * Development / demo: reconnect all integrations for the demo workspace so disconnect
 * from Connect Accounts does not persist across a full page reload or server restart.
 */
export async function resetDemoConnectedAccounts(): Promise<void> {
  if (process.env.NODE_ENV !== 'development') return;

  await prisma.connectedAccount.updateMany({
    where: { workspaceId: DEMO_WORKSPACE_ID },
    data: { status: 'CONNECTED' },
  });
}
