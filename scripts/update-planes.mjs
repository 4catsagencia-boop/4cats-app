/**
 * SCRIPT DE ACTUALIZACIÓN DE PLANES
 * Uso: SUPABASE_SERVICE_ROLE_KEY=tu_llave node update-planes.mjs
 */

const URL = 'https://adebzdrdwqwlskylrgiu.supabase.co/rest/v1/planes';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!KEY) {
  console.error('❌ ERROR: Debes configurar la variable de entorno SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function update() {
  console.log('🚀 Iniciando actualización de planes con privilegios de servicio...');
  
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
    
    if (!delRes.ok) {
      console.error('❌ Error al limpiar:', await delRes.text());
      return;
    }

    const planes = [
      {
        nombre: 'Layla (Presencia Local)',
        precio: 500000,
        descripcion: 'Presencia impecable y velocidad extrema para posicionar en Google. Ideal para profesionales y comercios locales.',
        publicado: true,
        destacado: false,
        caracteristicas: [
          'Hasta 5 páginas responsivas',
          'Estética minimalista (Modo Oscuro/Cyan)',
          'React/Next.js (Static Site)',
          'PageSpeed sobre 95',
          'Formulario con ruteo directo a email',
          'SEO On-page optimizado'
        ]
      },
      {
        nombre: 'Roxanne (Motor de Leads)',
        precio: 850000,
        descripcion: 'El Core Business. Diseñado para multiplicar contactos y gestionar prospectos de forma eficiente.',
        publicado: true,
        destacado: true,
        caracteristicas: [
          'Todo lo de Layla',
          'Base de datos de clientes (Supabase)',
          'Panel de administración a medida',
          'Gestión de leads limpia y funcional',
          'Alertas automatizadas',
          'Soporte prioritario'
        ]
      },
      {
        nombre: 'Lucy (Partner Tecnológico)',
        precio: 560000, 
        descripcion: 'High-Ticket. Dominio total del mercado con IA y automatización. Escala industrial para empresas ambiciosas.',
        publicado: true,
        destacado: false,
        caracteristicas: [
          'Integración de IA (Gemini/GPT)',
          'Automatización de procesos internos',
          'Saturación semántica (Asalto GEO)',
          'Despliegue en servidores propios',
          'Desarrollo continuo y evolución',
          'Contratos corporativos (Retainer)'
        ]
      }
    ];

    console.log('Insertando nuevos planes...');
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
      console.log('✅ ¡Planes actualizados con éxito!');
    } else {
      console.error('❌ Error al insertar:', await res.text());
    }
  } catch (err) {
    console.error('💥 Error fatal:', err);
  }
}

update();
