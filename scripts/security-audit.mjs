import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Faltan variables de entorno (URL o Anon Key)");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runAudit() {
  console.log("🔍 Iniciando Auditoría de Seguridad RLS...");
  console.log("------------------------------------------");

  // 1. Test: Lectura de Cotizaciones (Debe fallar o devolver vacío)
  console.log("🧪 Test 1: Intento de lectura de 'cotizaciones' sin auth...");
  const { data: cot, error: err1 } = await supabase.from('cotizaciones').select('*');
  if (err1) console.log("✅ Bloqueado por error:", err1.message);
  else if (cot && cot.length > 0) console.log("❌ FALLO: Se pudieron leer cotizaciones!");
  else console.log("✅ ÉXITO: La tabla devolvió 0 resultados (RLS activo).");

  // 2. Test: Escritura de Clientes (Debe fallar)
  console.log("\n🧪 Test 2: Intento de inserción en 'clientes' sin auth...");
  const { error: err2 } = await supabase.from('clientes').insert({ nombre: 'HACKER', email: 'hack@hack.com' });
  if (err2) console.log("✅ Bloqueado por política RLS:", err2.message);
  else console.log("❌ FALLO: Se permitió la inserción en clientes!");

  // 3. Test: Lectura de Planes Públicos (Debe funcionar solo los publicados)
  console.log("\n🧪 Test 3: Verificando acceso público a 'planes' (publicados)...");
  const { data: planes, error: err3 } = await supabase.from('planes').select('*').eq('publicado', true);
  if (err3) console.log("❌ ERROR INESPERADO:", err3.message);
  else console.log(`✅ OK: Se leyeron ${planes.length} planes públicos.`);

  // 4. Test: Lectura de Planes Ocultos (Debe devolver 0)
  console.log("\n🧪 Test 4: Intento de lectura de planes NO publicados...");
  const { data: planesOcultos } = await supabase.from('planes').select('*').eq('publicado', false);
  if (planesOcultos && planesOcultos.length > 0) console.log("❌ FALLO: Se filtraron planes ocultos!");
  else console.log("✅ ÉXITO: Los planes ocultos son invisibles.");

  console.log("\n------------------------------------------");
  console.log("🏁 Auditoría finalizada.");
}

runAudit();
