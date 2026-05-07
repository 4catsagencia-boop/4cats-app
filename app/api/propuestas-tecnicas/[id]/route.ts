import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/utils/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: clienteId } = await params;

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("propuestas_tecnicas")
      .select("*")
      .eq("cliente_id", clienteId)
      .eq("estado", "activo")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Propuesta no encontrada" },
        { status: 404 }
      );
    }

    // Check expiration
    if (data.expira_at) {
      const expiryDate = new Date(data.expira_at);
      if (expiryDate < new Date()) {
        return NextResponse.json(
          { error: "Esta propuesta ha expirado" },
          { status: 410 }
        );
      }
    }

    // Log access asynchronously (don't wait for it)
    logAccess(clienteId, request);

    // Return the proposal content with watermark metadata
    return NextResponse.json({
      id: data.id,
      nombre: data.nombre,
      contenido: data.contenido_json,
      creado_at: data.created_at,
      expira_at: data.expira_at,
    });
  } catch (err) {
    console.error("Error fetching proposal:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Log access to the proposal (asynchronous, non-blocking)
async function logAccess(clienteId: string, request: NextRequest) {
  try {
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const supabase = getServiceSupabase();
    const { error } = await supabase
      .from("propuesta_tecnica_accesos")
      .insert({
        cliente_id: clienteId,
        ip_address: ipAddress,
        user_agent: userAgent,
        duracion_seg: 0,
        accessed_at: new Date().toISOString(),
      });

    if (error) console.error("Error logging access:", error);
    else console.log(`Access logged for cliente ${clienteId}`);
  } catch (err) {
    console.error("Error in logAccess:", err);
  }
}
