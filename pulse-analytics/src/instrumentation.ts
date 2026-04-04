export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  if (process.env.NODE_ENV !== 'development') return;

  const { resetDemoConnectedAccounts } = await import('@/lib/demo-connection-reset');
  await resetDemoConnectedAccounts().catch((err) => {
    console.error('[instrumentation] resetDemoConnectedAccounts failed:', err);
  });
}
