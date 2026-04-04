import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';
import { auth } from '@/lib/auth';

const isDev = process.env.NODE_ENV === 'development';

export async function GET(request: NextRequest) {
  try {
    // Skip auth in dev mode
    if (!isDev) {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url') || 'http://localhost:3000/dashboard';
    const pageTitle = searchParams.get('title') || 'Pulse Analytics';
    const theme = searchParams.get('theme') === 'dark' ? 'dark' : 'light';

    console.log('[PDF Export API] Starting Playwright PDF generation for:', url, 'theme:', theme);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 2,
      colorScheme: theme === 'dark' ? 'dark' : 'light',
    });

    // Match dashboard dark mode: Tailwind `dark:` uses `.dark` on <html>; zustand persists `pulse-theme`
    if (theme === 'dark') {
      await context.addInitScript(() => {
        try {
          localStorage.setItem(
            'pulse-theme',
            JSON.stringify({ state: { theme: 'dark' }, version: 0 })
          );
        } catch {
          /* ignore */
        }
      });
    }

    const page = await context.newPage();

    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    await page.waitForSelector('main', { timeout: 10000 });

    if (theme === 'dark') {
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      });
      await new Promise((r) => setTimeout(r, 400));
    }

    try {
      await page.waitForFunction(
        () => {
          const svgs = document.querySelectorAll('svg.recharts-surface');
          const canvases = document.querySelectorAll('canvas');
          return (
            svgs.length > 0 ||
            canvases.length > 0 ||
            document.querySelectorAll('.recharts-wrapper').length > 0
          );
        },
        { timeout: 10000 }
      );
    } catch {
      console.log('[PDF Export API] Chart selectors not found (non-dashboard page); continuing');
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    await page.addStyleTag({
      content: `
        #export-pdf-btn, #sidebar-toggle, #generate-report-btn, nav, header { display: none !important; }
        main { 
          overflow: visible !important; 
          max-height: none !important; 
          height: auto !important;
          padding: 20px !important;
        }
        body {
          overflow: visible !important;
          height: auto !important;
        }
      `,
    });

    const bodyHandle = await page.$('body');
    const { height: bodyHeight, width: bodyWidth } = await bodyHandle!.evaluate((el) => ({
      height: el.scrollHeight,
      width: el.scrollWidth,
    }));
    await bodyHandle!.dispose();

    console.log('[PDF Export API] Page dimensions:', bodyWidth, 'x', bodyHeight);

    await page.setViewportSize({ width: 1920, height: Math.max(1080, bodyHeight) });
    await new Promise((resolve) => setTimeout(resolve, 500));

    const pdf = await page.pdf({
      width: 1920,
      height: bodyHeight,
      printBackground: true,
      preferCSSPageSize: false,
    });

    await browser.close();

    console.log('[PDF Export API] PDF generated successfully:', pdf.length, 'bytes');

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${pageTitle}-export-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });
  } catch (error) {
    console.error('[PDF Export API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
