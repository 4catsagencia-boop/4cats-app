/**
 * SCRIPT DE ACTUALIZACIÓN DE PLANES DE MANTENIMIENTO
 * Uso: SUPABASE_SERVICE_ROLE_KEY=tu_llave node update-mant.mjs
 */

const URL = 'https://adebzdrdwqwlskylrgiu.supabase.co/rest/v1/planes_mantenimiento';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!KEY) {
  console.error('❌ ERROR: Debes configurar la variable de entorno SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function update() {
  console.log('🚀 Iniciando actualización de planes de mantenimiento...');
  
  try {
    console.log('Limpiando planes antiguos...');
    const delRes = await fetch(URL + '?id=neq.0', {
      method: 'DELETE',
      headers: {
        'apikey': KEY,
        'Authorization': 'Bearer ' + KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (!delRes.ok) console.warn('Aviso al limpiar:', await delRes.text());

    const planes = [
      {
        nombre: 'Cuidado Esencial',
        precio: 35000,
        descripcion: 'Ideal para sitios informativos que necesitan estar siempre arriba y seguros.',
        publicado: true
      },
      {
        nombre: 'Soporte Pro',
        precio: 75000,
        descripcion: 'Para sitios que generan leads constantes y requieren actualizaciones mensuales.',
        publicado: true
      },
      {
        nombre: 'Mantenimiento Premium',
        precio: 150000,
        descripcion: 'Gestión total, optimización continua de performance y soporte prioritario.',
        publicado: true
      }
    ];

    console.log('Insertando planes...');
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        'apikey': KEY,
        'Authorization': 'Bearer ' + KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(planes)
    });

    if (res.ok) {
      console.log('✅ ¡Planes de mantenimiento actualizados!');
    } else {
      console.error('❌ Error al insertar:', await res.text());
    }
  } catch (err) {
    console.error('💥 Error fatal:', err);
  }
}

update();
