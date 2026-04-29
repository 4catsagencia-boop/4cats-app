import { NextRequest, NextResponse } from "next/server";

/**
 * Autenticación del Panel Admin tradicional.
 * Valida contra ADMIN_PASSWORD y registra IPs para auditoría.
 */
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    // 0. Captura de IP para auditoría (Estándar Next.js 15)
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : (req as any).ip || 'unknown';

    if (!adminPassword) {
      console.error("[AUTH_CONFIG] ADMIN_PASSWORD no está configurada en el entorno");
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    if (password === adminPassword) {
      console.info(`[AUTH] Login Admin EXITOSO desde IP: ${ip}`);
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    console.warn(`[AUTH] Login Admin FALLIDO desde IP: ${ip}`);
    return NextResponse.json({ ok: false }, { status: 401 });

  } catch (error) {
    console.error('Error in admin auth API:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
