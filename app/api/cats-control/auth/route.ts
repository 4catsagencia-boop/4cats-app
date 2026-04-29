import { NextRequest, NextResponse } from "next/server";

/**
 * Autenticación de Cats Control.
 * Valida usuarios específicos contra variables de entorno y registra IPs para auditoría.
 */
const users: Record<string, { name: string; passwordEnvKey: string }> = {
  luis: { name: "Luis", passwordEnvKey: "USER_LUIS_PASSWORD" },
  majo: { name: "María José", passwordEnvKey: "USER_MAJO_PASSWORD" },
};

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // 0. Captura de IP para auditoría (Estándar Next.js 15)
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : (req as any).ip || 'unknown';

    if (!username || !password) {
      return NextResponse.json({ ok: false, error: "Credenciales incompletas" }, { status: 400 });
    }

    const userKey = username.toLowerCase().trim();
    const user = users[userKey];

    if (!user) {
      console.warn(`[AUTH] Intento de login con usuario inexistente: ${username} desde IP: ${ip}`);
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const expectedPassword = process.env[user.passwordEnvKey];
    if (!expectedPassword) {
      console.error(`[AUTH_CONFIG] Variable de entorno faltante: ${user.passwordEnvKey}`);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    if (password !== expectedPassword) {
      console.warn(`[AUTH] Login FALLIDO para usuario: ${username} desde IP: ${ip}`);
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    console.info(`[AUTH] Login EXITOSO para usuario: ${user.name} desde IP: ${ip}`);
    return NextResponse.json({ ok: true, name: user.name }, { status: 200 });

  } catch (error) {
    console.error('Critical error in cats-control auth API:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
