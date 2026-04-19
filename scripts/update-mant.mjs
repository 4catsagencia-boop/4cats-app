const URL_PLANES = 'https://adebzdrdwqwlskylrgiu.supabase.co/rest/v1/planes';
const URL_MANT = 'https://adebzdrdwqwlskylrgiu.supabase.co/rest/v1/planes_mantenimiento';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkZWJ6ZHJkd3F3bHNreWxyZ2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODMyNDcsImV4cCI6MjA4OTE1OTI0N30.vPIvr2y47E3FqYcXywmQNhM8luzQFkNlBC486i1ntJc';

async function update() {
  const headers = {
    'apikey': KEY,
    'Authorization': 'Bearer ' + KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    // 1. Limpiar Mantenimiento
    console.log('Limpiando planes de mantenimiento...');
    await fetch(URL_MANT + '?id=not.is.null', { method: 'DELETE', headers });

    // 2. Insertar Mantenimiento
    const planesMant = [
      {
        nombre: 'Emprendedor',
        precio: 35000,
        publicado: true,
        destacado: false,
        caracteristicas: ["Seguridad + Actualizaciones", "Respaldos Semanales", "Reporte Básico Mensual", "Soporte vía Email", "Sin bolsa de horas"]
      },
      {
        nombre: 'Profesional',
        precio: 65000,
        publicado: true,
        destacado: true,
        caracteristicas: ["Todo lo del plan anterior", "Respaldos Diarios", "1.5 Horas de cambios incl.", "Actualización de contenidos", "Soporte WhatsApp + Email"]
      },
      {
        nombre: 'Corporativo',
        precio: 95000,
        publicado: true,
        destacado: false,
        caracteristicas: ["Todo lo del plan anterior", "5 Horas mensuales incl.", "Firewall Avanzado DDoS", "Reunión Estratégica Mensual", "Soporte Prioritario 24/7"]
      }
    ];

    console.log('Insertando planes de mantenimiento...');
    const resMant = await fetch(URL_MANT, { method: 'POST', headers, body: JSON.stringify(planesMant) });
    if (resMant.ok) console.log('Planes de mantenimiento actualizados.');
    else console.error('Error Mant:', await resMant.text());

    console.log('Todo listo.');
  } catch (err) {
    console.error('Error fatal:', err);
  }
}

update();
