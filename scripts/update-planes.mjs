const URL = 'https://adebzdrdwqwlskylrgiu.supabase.co/rest/v1/planes';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkZWJ6ZHJkd3F3bHNreWxyZ2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODMyNDcsImV4cCI6MjA4OTE1OTI0N30.vPIvr2y47E3FqYcXywmQNhM8luzQFkNlBC486i1ntJc';

async function update() {
  console.log('Limpiando planes antiguos...');
  try {
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
        precio: 560000, // Referencia base (15 UF aprox)
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
      console.log('¡Planes actualizados con éxito!');
    } else {
      console.error('Error al insertar:', await res.text());
    }
  } catch (err) {
    console.error('Error fatal:', err);
  }
}

update();
