
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Simple .env.local parser
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.join('=').trim();
    }
  });
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function run() {
  console.log('--- Hardy Quote Generator ---');
  
  // 1. Encontrar o crear cliente
  let { data: cliente, error: clientError } = await supabase
    .from('clientes')
    .select('id')
    .ilike('nombre', '%Hardy%')
    .single();

  if (clientError || !cliente) {
    console.log('Cliente no encontrado, creando "Grúas Hardy"...');
    const { data: newClient, error: createError } = await supabase
      .from('clientes')
      .insert([{ 
        nombre: 'Grúas Hardy', 
        email: 'contacto@gruashardy.cl',
        comuna: 'Temuco',
        ciudad: 'Temuco'
      }])
      .select('id')
      .single();
    
    if (createError) {
      console.error('Error creando cliente:', createError);
      return;
    }
    cliente = newClient;
  }

  console.log('ID Cliente:', cliente.id);

  // 2. Crear Cotización
  const items = [
    { descripcion: 'Fase 1: Fundación y Arquitectura. Arquitectura de proyecto, modelamiento de BD, conexión persistente, lógica de autenticación y vistas iniciales (Login/Home).', precio: 3000000 },
    { descripcion: 'Fase 2: Administración de Recursos y Activos. Módulos maestros para gestión de Usuarios/Roles, Grúas/Patentes y Panel de Mantenimiento con monitoreo de estados.', precio: 3000000 },
    { descripcion: 'Fase 3: Core Operacional y Logística. Módulos de Solicitudes, Agendamiento programado, Logística de trazabilidad y lógica de validación de disponibilidad de flota.', precio: 4500000 },
    { descripcion: 'Fase 4: Ejecución App Móvil y Tracking. App del Conductor (Servicios/Evidencia), Tracking en tiempo real por GPS, Vista de Cliente Externo y Notificaciones Push.', precio: 4500000 },
    { descripcion: 'Fase 5: Administración Final y Cierre. Dashboard de KPIs gerenciales, Registro Histórico avanzado, Módulo de Aseguradoras e integración automática de WhatsApp/Email.', precio: 1800000 },
    { descripcion: 'Módulo I: Plataforma Web (Landing Page) de alto rendimiento (100/100 PageSpeed). - Bonificada', precio: 0 }
  ];

  const total = items.reduce((sum, item) => sum + item.precio, 0);

  const { data: cotizacion, error: quoteError } = await supabase
    .from('cotizaciones')
    .insert([{
      cliente_id: cliente.id,
      cliente_nombre: 'Grúas Hardy',
      cliente_email: 'contacto@gruashardy.cl',
      plan_nombre: 'Ecosistema Digital Grúas Hardy',
      total: total,
      estado: 'pendiente',
      items: JSON.stringify(items),
      notas: 'Presupuesto extraído íntegramente del PDF "Ecosistema Digital Grúas Hardy".'
    }])
    .select('id')
    .single();

  if (quoteError) {
    console.error('Error creando cotización:', quoteError);
    return;
  }

  console.log('✅ Cotización creada con éxito! ID:', cotizacion.id);
  
  // 3. Crear Propuesta Estratégica (Opcional pero recomendado para Hardy Central)
  const slug = `ecosistema-digital-hardy-${Date.now().toString(36)}`;
  const { data: propuesta, error: propError } = await supabase
    .from('propuestas')
    .insert([{
      cliente_id: cliente.id,
      titulo: 'Ecosistema Digital Grúas Hardy',
      subtitulo: 'Propuesta Técnica y Económica Consolidada',
      slug: slug,
      estado: 'borrador',
      tipo: 'app',
      vistas: 0,
      problema: 'Hardy Grúas opera con un sitio WordPress estático, sin formulario de cotización ni descripción técnica de capacidades. El proceso de gestión de asistencia vial es manual y carece de trazabilidad digital.',
      solucion_titulo: 'Plataforma Web + Sistema de Administración Logística',
      solucion_descripcion: 'Desarrollo de una plataforma de alto rendimiento para captación (Landing Page) integrada con un sistema integral para la gestión total de asistencia vial, permitiendo trazabilidad y reducción de incertidumbre.',
      metricas: JSON.stringify([
        { nombre: 'PageSpeed Mobile', actual: 40, competidor: 65, propuesta: 100, unidad: '/100' },
        { nombre: 'Trazabilidad Logística', actual: 0, competidor: 20, propuesta: 100, unidad: '%' },
        { nombre: 'Reducción Incertidumbre', actual: 10, competidor: 30, propuesta: 95, unidad: '%' },
        { nombre: 'Eficiencia en Pauta', actual: 50, competidor: 60, propuesta: 90, unidad: '%' }
      ]),
      ventajas: JSON.stringify([
        { icono: '⚡', titulo: 'Rendimiento Extremo', descripcion: 'Calificación 100/100 en PageSpeed para reducir el CPC en Google Ads.' },
        { icono: '📍', titulo: 'Tracking GPS', descripcion: 'Seguimiento en tiempo real para clientes y despacho centralizado.' },
        { icono: '📊', titulo: 'Dashboard KPIs', descripcion: 'Panel administrativo para control total de flota y finanzas.' },
        { icono: '🚀', titulo: 'Ventaja SEO', descripcion: 'Superioridad estructural para posicionamiento orgánico a largo plazo.' }
      ]),
      links: JSON.stringify([
        { label: 'Ver Propuesta Hardy', url: 'https://4cats.cl/propuesta/' + slug, tipo: 'prototipo' }
      ])
    }])
    .select('id')
    .single();

  if (propError) {
    console.error('Error creando propuesta:', propError);
  } else {
    console.log('✅ Propuesta estratégica creada! Link: /propuesta/' + slug);
  }
}

run();
