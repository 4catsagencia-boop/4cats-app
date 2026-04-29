import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase, Tables } from '@/utils/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabaseAdmin = getServiceSupabase();

    // Exit update: Tracker sends acceso_id on visibilitychange
    if (body.acceso_id) {
      const { acceso_id, tiempo_permanencia, cta_click } = body;
      const { error } = await supabaseAdmin
        .from(Tables.AccesosPropuesta)
        .update({ tiempo_permanencia, cta_click })
        .eq('id', acceso_id);
      if (error) console.error('Error updating acceso:', error);
      return NextResponse.json({ success: true });
    }

    // Initial tracking
    const { propuesta_id, dispositivo } = body;
    if (!propuesta_id) {
      return NextResponse.json({ error: 'Missing propuesta_id' }, { status: 400 });
    }

    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : (req as any).ip || 'unknown';
    const ua = req.headers.get('user-agent') || 'unknown';

    const { data: acceso, error: accessError } = await supabaseAdmin
      .from(Tables.AccesosPropuesta)
      .insert([{ propuesta_id, ip, user_agent: ua, dispositivo }])
      .select('id')
      .single();

    if (accessError) console.error('Error recording access:', accessError);

    const { error: rpcError } = await supabaseAdmin.rpc('increment_vistas', { propuesta_id });
    if (rpcError) console.error('Error incrementing vistas:', rpcError);

    return NextResponse.json({ success: true, acceso_id: acceso?.id });
  } catch (error) {
    console.error('Track API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
