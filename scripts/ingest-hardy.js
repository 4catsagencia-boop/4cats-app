#!/usr/bin/env node

/**
 * Script para cargar la Propuesta Técnica de Hardy
 * Ejecutar: node scripts/ingest-hardy.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HARDY_CLIENT_ID = '04b7464d-f01c-4216-8bce-9ebfd9f7fa4c';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Faltan variables de entorno: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const contenido = {
  titulo: 'Sistema de Administración para Grúas Hardy',
  autor: 'María José Calderón - Ingeniera de Software',
  fecha: '28 de Abril 2026',
  destinatario: 'Agencia 4Cats',
  introduccion: 'Plataforma digital centralizada orientada a optimizar de manera integral la operación de Grúas Hardy mediante gestión de servicios, asignación eficiente de recursos y comunicación entre actores.',
  objetivos: [
    'Mejorar la eficiencia en la asignación y ejecución de servicios',
    'Aumentar la visibilidad de la operación en tiempo real',
    'Optimizar la comunicación entre todos los actores',
    'Incorporar herramientas digitales orientadas al cliente',
    'Fortalecer el registro y respaldo de información administrativa',
    'Mejorar la calidad del servicio y satisfacción del cliente',
    'Facilitar la escalabilidad del negocio'
  ],
  modulos: [
    'Panel del usuario Administrador',
    'Módulo de Logística',
    'Gestión de Solicitudes',
    'Módulo de Agendamiento',
    'Historial de Servicios',
    'Mantenedor de Usuarios',
    'Mantenedor de Grúas',
    'Módulo de Aseguradoras',
    'App Móvil de Usuario Conductor',
    'Vista de Tracking para Cliente',
    'Vista del usuario de Mantenimiento',
    'Tareas de Mantenimiento'
  ],
  integraciones: [
    'Google Maps Platform',
    'WhatsApp',
    'Servicios de geolocalización',
    'Waze',
    'Envío de correos electrónicos'
  ],
  arquitectura: {
    frontend: 'Angular + Ionic/Capacitor (Android)',
    backend: 'NestJS',
    database: 'Supabase',
    comunicacion: 'API RESTful'
  },
  roles: [
    'Operador - Gestión y coordinación de servicios',
    'Conductor - Ejecución de servicios en terreno',
    'Encargado de mantenimiento - Estado operativo de activos',
    'Cliente - Usuario externo'
  ]
};

async function ingestHardy() {
  try {
    console.log('📥 Cargando Propuesta Técnica de Hardy...\n');

    const { data, error } = await supabase
      .from('propuestas_tecnicas')
      .insert({
        cliente_id: HARDY_CLIENT_ID,
        nombre: 'Sistema de Administración para Grúas Hardy',
        descripcion: 'Propuesta técnica integral para la gestión operativa de Grúas Hardy - Autor: María José Calderón',
        contenido_json: contenido,
        estado: 'activo',
        expira_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select();

    if (error) {
      console.error('❌ Error al insertar:', error.message);
      process.exit(1);
    }

    console.log('✅ Propuesta Técnica de Hardy cargada exitosamente!\n');
    console.log('📋 Detalles:');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Cliente: ${HARDY_CLIENT_ID}`);
    console.log(`   Estado: ${data[0].estado}`);
    console.log(`   Creada: ${data[0].created_at}`);
    console.log(`   Expira: ${data[0].expira_at}\n`);
    console.log('🎉 Ya podés verla en el admin panel → Propuestas Técnicas');
  } catch (err) {
    console.error('❌ Error inesperado:', err);
    process.exit(1);
  }
}

ingestHardy();
