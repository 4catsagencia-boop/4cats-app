import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase, Tables } from "@/utils/supabase";

/**
 * API para procesar nuevas cotizaciones (Leads).
 * Implementa Rate Limiting por email e IP, captura metadata de auditoría
 * y utiliza Service Role para bypass de RLS seguro.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, telefono, plan, mensaje, items, subtotal, impuesto, total } = body;

    // 0. Captura de IP y UA para auditoría (Estándar del proyecto Next.js 15)
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : (req as any).ip || 'unknown';
    const ua = req.headers.get('user-agent') || 'unknown';

    // 1. Validaciones básicas
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!nombre || !email || !plan || !emailRegex.test(email)) {
      console.warn(`[VALIDATION] Intento de cotización con datos inválidos desde IP: ${ip}`);
      return NextResponse.json({ error: "Datos inválidos o incompletos" }, { status: 400 });
    }

    const supabaseAdmin = getServiceSupabase();

    // 2. RATE LIMITING (Server-side)
    // Prevenir spam: máximo 1 cotización por minuto por email
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    
    const { data: recentQuotes, error: fetchError } = await supabaseAdmin
      .from(Tables.Cotizaciones)
      .select("created_at")
      .eq("cliente_email", email.trim())
      .gt("created_at", oneMinuteAgo)
      .limit(1);

    if (fetchError) {
      console.error("Error checking rate limit:", fetchError);
    }

    if (recentQuotes && recentQuotes.length > 0) {
      console.warn(`[RATE LIMIT] Bloqueado spam de cotización: ${email} [IP: ${ip}]`);
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Por favor espera un minuto antes de intentar de nuevo." },
        { status: 429 }
      );
    }

    // 3. LÓGICA DE NEGOCIO
    // A. Buscar o Crear Cliente
    let clienteId: string | undefined;
    const { data: existingClient } = await supabaseAdmin
      .from(Tables.Clientes)
      .select("id")
      .eq("email", email.trim())
      .single();

    if (existingClient) {
      clienteId = existingClient.id;
    } else {
      const { data: newClient, error: clientError } = await supabaseAdmin
        .from(Tables.Clientes)
        .insert([{
          nombre: nombre.trim(),
          email: email.trim(),
          telefono: telefono?.trim(),
          // Marcamos origen del lead
          clasificacion: "lead_web"
        }])
        .select()
        .single();

      if (clientError) throw clientError;
      clienteId = newClient.id;
    }

    // B. Guardar Cotización con Auditoría
    const { error: quoteError } = await supabaseAdmin
      .from(Tables.Cotizaciones)
      .insert([{
        cliente_id: clienteId,
        cliente_nombre: nombre.trim(),
        cliente_email: email.trim(),
        cliente_telefono: telefono?.trim(),
        plan_nombre: plan,
        items: items || [],
        subtotal: subtotal || 0,
        impuesto: impuesto || 0,
        total: total || 0,
        notas: mensaje,
        estado: "pendiente",
        // Metadata enriquecida para el equipo de ventas
        metadata: {
          ip,
          ua,
          source: "landing_page",
          timestamp: new Date().toISOString()
        }
      }]);

    if (quoteError) throw quoteError;

    console.info(`[LEAD] Nueva cotización generada exitosamente: ${email} [IP: ${ip}]`);
    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Error desconocido";
    console.error("Critical error in cotizar API:", errorMsg);
    return NextResponse.json(
      { error: "Error interno al procesar la cotización" },
      { status: 500 }
    );
  }
}
