import { NextRequest, NextResponse } from 'next/server';
import { supabase, Tables } from '@/utils/supabase';

export async function POST(req: NextRequest) {
  try {
    const { propuesta_id } = await req.json();

    if (!propuesta_id) {
      return NextResponse.json({ error: 'Missing propuesta_id' }, { status: 400 });
    }

    // Obtener IP y User Agent
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : (req as any).ip || 'unknown';
    const ua = req.headers.get('user-agent') || 'unknown';

    // 1. Registrar el acceso detallado
    const { error: accessError } = await supabase
      .from(Tables.AccesosPropuesta)
      .insert([
        { 
          propuesta_id, 
          ip, 
          user_agent: ua 
        }
      ]);

    if (accessError) {
      console.error('Error recording access:', accessError);
    }

    // 2. Incrementar contador de vistas general (RPC)
    const { error: rpcError } = await supabase.rpc('increment_vistas', { propuesta_id });

    if (rpcError) {
      console.error('Error incrementing vistas via RPC:', rpcError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
