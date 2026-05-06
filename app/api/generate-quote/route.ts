import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/utils/supabase";

export async function POST(req: NextRequest) {
  try {
    const { cotizacionId } = await req.json();

    if (!cotizacionId) {
      return NextResponse.json({ error: "cotizacionId requerido" }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Obtener cotización de Supabase
    const { data: cotizacion, error } = await supabase
      .from("cotizaciones")
      .select("*")
      .eq("id", cotizacionId)
      .single();

    if (error || !cotizacion) {
      return NextResponse.json({ error: "Cotización no encontrada" }, { status: 404 });
    }

    // Obtener datos del cliente
    const { data: cliente } = await supabase
      .from("clientes")
      .select("*")
      .eq("id", cotizacion.cliente_id)
      .single();

    // Preparar datos para el PDF
    const items = Array.isArray(cotizacion.items)
      ? cotizacion.items
      : JSON.parse(cotizacion.items || "[]");

    const subtotal = cotizacion.subtotal || cotizacion.total;
    const iva = cotizacion.impuesto || Math.round(subtotal * 0.19);
    const total = cotizacion.total || subtotal + iva;

    const quoteData = {
      numero: parseInt(cotizacionId.substring(0, 8), 16) % 10000,
      fecha: new Date().toLocaleDateString("es-CL"),
      cliente: {
        nombre: cliente?.nombre || cotizacion.cliente_nombre,
        empresa: cliente?.razon_social || cotizacion.cliente_nombre,
        rut: cliente?.rut || "N/A",
        email: cotizacion.cliente_email || cliente?.email || "",
        telefono: cliente?.telefono || "N/A",
      },
      items: items,
      subtotal: subtotal,
      iva: iva,
      total: total,
      notas: cotizacion.notas,
    };

    // Retornar datos para que el cliente genere el PDF
    return NextResponse.json({ success: true, data: quoteData }, { status: 200 });
  } catch (error) {
    console.error("Error generating quote:", error);
    return NextResponse.json({ error: "Error al generar cotización" }, { status: 500 });
  }
}
