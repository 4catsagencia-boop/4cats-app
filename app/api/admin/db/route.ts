import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase, Tables } from "@/utils/supabase";

/**
 * API Proxy para operaciones administrativas.
 * Verifica la contraseña y utiliza el Service Role para saltar el RLS.
 */
export async function POST(req: NextRequest) {
  try {
    const { password, table, action, data, id } = await req.json();
    
    // Capturar IP para auditoría según estándar del proyecto
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : (req as any).ip || 'unknown';
    
    const adminPassword = process.env.ADMIN_PASSWORD;
    const luisPassword = process.env.USER_LUIS_PASSWORD;
    const majoPassword = process.env.USER_MAJO_PASSWORD;

    const authorizedPasswords = [adminPassword, luisPassword, majoPassword].filter(Boolean);

    // 1. Verificación de Seguridad
    if (!password || !authorizedPasswords.includes(password)) {
      console.warn(`[SECURITY] Intento de acceso administrativo FALLIDO desde IP: ${ip} para tabla: ${table}`);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.info(`[ADMIN] Operación ${action} en tabla ${table} desde IP: ${ip}`);

    const supabaseAdmin = getServiceSupabase();
    let result;

    // 2. Ejecución de Operaciones
    switch (action) {
      case "SELECT": {
        let queryBuilder = supabaseAdmin.from(table).select("*");
        
        // Soporte para filtros básicos vía proxy
        const { filterColumn, filterValue } = await req.json().catch(() => ({}));
        if (filterColumn && filterValue !== undefined) {
          queryBuilder = queryBuilder.eq(filterColumn, filterValue);
        }
        
        result = await queryBuilder.order("created_at", { ascending: false });
        break;
      }
      
      case "INSERT":
        result = await supabaseAdmin.from(table).insert([data]).select();
        break;

      case "UPDATE":
        result = await supabaseAdmin.from(table).update(data).eq("id", id).select();
        break;

      case "DELETE":
        result = await supabaseAdmin.from(table).delete().eq("id", id);
        break;

      default:
        return NextResponse.json({ error: "Acción no permitida" }, { status: 400 });
    }

    if (result.error) throw result.error;

    return NextResponse.json({ data: result.data, ok: true }, { status: 200 });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error en operación de DB";
    console.error("Admin DB Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
