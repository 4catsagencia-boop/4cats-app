import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const strategy = searchParams.get('strategy') || 'mobile';

  if (!url) {
    return NextResponse.json({ error: 'URL requerida' }, { status: 400 });
  }

  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'PAGESPEED_API_KEY no configurada' }, { status: 500 });
  }

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${apiKey}`;

  const res = await fetch(apiUrl, { next: { revalidate: 0 } });
  const data = await res.json();

  if (!res.ok || data.error) {
    console.error('[PageSpeed API Error]', JSON.stringify(data.error));
    return NextResponse.json({ error: data.error?.message || 'Error de PageSpeed', detail: data.error }, { status: 502 });
  }

  const lhr = data.lighthouseResult;
  const score = Math.round((lhr?.categories?.performance?.score ?? 0) * 100);

  const ms = (key: string) => {
    const v = lhr?.audits?.[key]?.numericValue;
    return v != null ? Math.round(v) : null;
  };

  const metrics = {
    fcp:        ms('first-contentful-paint'),
    lcp:        ms('largest-contentful-paint'),
    tbt:        ms('total-blocking-time'),
    cls:        lhr?.audits?.['cumulative-layout-shift']?.numericValue != null
                  ? parseFloat((lhr.audits['cumulative-layout-shift'].numericValue).toFixed(3))
                  : null,
    speedIndex: ms('speed-index'),
    tti:        ms('interactive'),
  };

  return NextResponse.json({ score, strategy, url, metrics });
}
