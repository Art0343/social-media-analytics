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

    console.log('[PDF Export API] Starting Playwright PDF generation for:', url);

    // Launch browser with larger viewport
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    // Navigate to the page
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for content to load
    await page.waitForSelector('main', { timeout: 10000 });
    
    // Wait for charts to render (SVG paths or canvas elements)
    await page.waitForFunction(() => {
      // Check for recharts SVG elements
      const svgs = document.querySelectorAll('svg.recharts-surface');
      // Check for canvas charts
      const canvases = document.querySelectorAll('canvas');
      return svgs.length > 0 || canvases.length > 0 || document.querySelectorAll('.recharts-wrapper').length > 0;
    }, { timeout: 10000 });
    
    // Wait for chart animations
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Hide UI elements and expand content
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

    // Get full page dimensions
    const bodyHandle = await page.$('body');
    const { height: bodyHeight, width: bodyWidth } = await bodyHandle!.evaluate((el) => ({
      height: el.scrollHeight,
      width: el.scrollWidth,
    }));
    await bodyHandle!.dispose();

    console.log('[PDF Export API] Page dimensions:', bodyWidth, 'x', bodyHeight);

    // Set viewport to full page size
    await page.setViewportSize({ width: 1920, height: Math.max(1080, bodyHeight) });
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate PDF with full page capture at exact dimensions
    const pdf = await page.pdf({
      width: 1920,
      height: bodyHeight,
      printBackground: true,
      preferCSSPageSize: false,
    });

    await browser.close();

    console.log('[PDF Export API] PDF generated successfully:', pdf.length, 'bytes');

    // Return PDF as response
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
