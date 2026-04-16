import { NextRequest, NextResponse } from "next/server";
import { supabase, Tables } from "@/utils/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, telefono, plan, mensaje, items, subtotal, impuesto, total } = body;

    // 1. Validaciones básicas
    if (!nombre || !email || !plan) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    // 2. RATE LIMITING (Server-side)
    // Buscamos la última cotización de este email en los últimos 60 segundos
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    
    const { data: recentQuotes, error: fetchError } = await supabase
      .from(Tables.Cotizaciones)
      .select("created_at")
      .eq("cliente_email", email.trim())
      .gt("created_at", oneMinuteAgo)
      .limit(1);

    if (fetchError) {
      console.error("Error checking rate limit:", fetchError);
    }

    if (recentQuotes && recentQuotes.length > 0) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Por favor espera un minuto antes de intentar de nuevo." },
        { status: 429 }
      );
    }

    // 3. LÓGICA DE NEGOCIO (Insertar en Supabase)
    // A. Buscar o Crear Cliente
    let clienteId: string | undefined;
    const { data: existingClient } = await supabase
      .from(Tables.Clientes)
      .select("id")
      .eq("email", email.trim())
      .single();

    if (existingClient) {
      clienteId = existingClient.id;
    } else {
      const { data: newClient, error: clientError } = await supabase
        .from(Tables.Clientes)
        .insert([{
          nombre: nombre.trim(),
          email: email.trim(),
          telefono: telefono?.trim()
        }])
        .select()
        .single();

      if (clientError) throw clientError;
      clienteId = newClient.id;
    }

    // B. Guardar Cotización
    const { error: quoteError } = await supabase
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
        estado: "pendiente"
      }]);

    if (quoteError) throw quoteError;

    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error: any) {
    console.error("Error in cotizar API:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la cotización" },
      { status: 500 }
    );
  }
}
