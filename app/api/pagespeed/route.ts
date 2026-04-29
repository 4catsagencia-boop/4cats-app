import { NextRequest, NextResponse } from 'next/server';

/**
 * API Proxy para Google PageSpeed Insights.
 * Protegida por contraseña administrativa para evitar abuso de la API Key.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const strategy = searchParams.get('strategy') || 'mobile';
    const password = searchParams.get('pw'); // Nueva capa de seguridad

    // 0. Captura de IP para auditoría
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : (req as any).ip || 'unknown';

    if (!url) {
      return NextResponse.json({ error: 'URL requerida' }, { status: 400 });
    }

    // 1. Verificación de Seguridad
    const authorizedPasswords = [
      process.env.ADMIN_PASSWORD,
      process.env.USER_LUIS_PASSWORD,
      process.env.USER_MAJO_PASSWORD
    ].filter(Boolean);

    if (!password || !authorizedPasswords.includes(password)) {
      console.warn(`[SECURITY] Intento de uso no autorizado de PageSpeed API desde IP: ${ip}`);
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    console.info(`[PAGESPEED] Analizando ${url} [Strategy: ${strategy}] desde IP: ${ip}`);

    const apiKey = process.env.PAGESPEED_API_KEY;
    if (!apiKey) {
      console.error('[CONFIG] PAGESPEED_API_KEY missing');
      return NextResponse.json({ error: 'Configuración incompleta' }, { status: 500 });
    }

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${apiKey}`;

    const res = await fetch(apiUrl, { next: { revalidate: 3600 } }); // Cacheamos 1 hora el mismo análisis
    const data = await res.json();

    if (!res.ok || data.error) {
      console.error('[PageSpeed API Error]', JSON.stringify(data.error));
      return NextResponse.json({ 
        error: data.error?.message || 'Error de Google PageSpeed', 
        detail: data.error 
      }, { status: 502 });
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

  } catch (error) {
    console.error('PageSpeed API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
