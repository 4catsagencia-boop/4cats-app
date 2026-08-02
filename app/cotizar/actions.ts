"use server";

import { getServiceSupabase, Tables } from "@/utils/supabase";
import { headers } from "next/headers";

export async function submitAuditoria(formData: FormData) {
  try {
    const empresa = formData.get("empresa")?.toString().trim() || "";
    const web = formData.get("web")?.toString().trim() || "";
    const whatsapp = formData.get("whatsapp")?.toString().trim() || "";
    const objetivo = formData.get("objetivo")?.toString().trim() || "";

    if (!empresa || !whatsapp || !objetivo) {
      return { error: "Por favor, completa los campos obligatorios." };
    }

    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    const ua = headersList.get('user-agent') || 'unknown';

    const supabaseAdmin = getServiceSupabase();

    // Rate Limiting
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { data: recentQuotes } = await supabaseAdmin
      .from(Tables.Cotizaciones)
      .select("created_at")
      .eq("cliente_nombre", empresa)
      .gt("created_at", oneMinuteAgo)
      .limit(1);

    if (recentQuotes && recentQuotes.length > 0) {
      return { error: "Demasiadas solicitudes. Por favor espera un minuto." };
    }

    const createdAt = new Date().toISOString();
    const lead = {
      empresa,
      web,
      whatsapp,
      objetivo,
      source: "auditoria_gratuita",
      landing_page: "/cotizar",
      created_at: createdAt,
      status: "nuevo",
    };

    const quotePayload = {
      cliente_nombre: lead.empresa,
      cliente_email: `${lead.whatsapp.replace(/\D/g, "")}@lead.whatsapp`, // Fallback for DB constraint
      cliente_telefono: lead.whatsapp,
      plan_nombre: "Auditoría Gratuita",
      notas: `Web/Instagram: ${lead.web || "No informado"}\nObjetivo: ${lead.objetivo}`,
      total: 0,
      moneda: "CLP",
      metadata: {
        ...lead,
        ip,
        ua,
      },
    };

    // Preferimos estado "nuevo" cuando la DB ya permite el valor.
    const { error: quoteError } = await supabaseAdmin
      .from(Tables.Cotizaciones)
      .insert([{ ...quotePayload, estado: "nuevo" }]);

    if (quoteError) {
      const code = "code" in quoteError ? quoteError.code : undefined;
      if (code !== "23514") throw quoteError;

      const { error: fallbackError } = await supabaseAdmin
        .from(Tables.Cotizaciones)
        .insert([{ ...quotePayload, estado: "pendiente" }]);

      if (fallbackError) throw fallbackError;
    }

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error en submitAuditoria:", message);
    return { error: "Hubo un error al procesar tu solicitud." };
  }
}
