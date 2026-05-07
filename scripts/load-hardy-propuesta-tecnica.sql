-- Script para cargar la Propuesta Técnica de Hardy
-- Ejecutar en Supabase SQL Editor

INSERT INTO propuestas_tecnicas (
  cliente_id,
  nombre,
  descripcion,
  contenido_json,
  estado,
  expira_at,
  creado_por
) VALUES (
  '04b7464d-f01c-4216-8bce-9ebfd9f7fa4c'::uuid,
  'Sistema de Administración para Grúas Hardy',
  'Propuesta técnica integral para la gestión operativa de Grúas Hardy - Autor: María José Calderón',
  '{
    "titulo": "Sistema de Administración para Grúas Hardy",
    "autor": "María José Calderón - Ingeniera de Software",
    "fecha": "28 de Abril 2026",
    "destinatario": "Agencia 4Cats",
    "secciones": {
      "introduccion": "El presente documento tiene como objetivo presentar una propuesta de solución tecnológica para la empresa Grúas Hardy, orientada a optimizar de manera integral su operación mediante una plataforma digital centralizada.",
      "objetivo": "Mejorar la coordinación de servicios, la asignación eficiente de recursos y la comunicación entre los distintos actores involucrados, al mismo tiempo que fortalece la trazabilidad de las operaciones y la gestión de información.",
      "contexto": {
        "problema": "Desafíos asociados al crecimiento de la demanda y a la necesidad de coordinar múltiples servicios de forma simultánea. Fragmentación en los procesos operativos y de comunicación. Falta de visibilidad en tiempo real de la operación.",
        "empresa": "Grúas Hardy es una empresa con más de 20 años de trayectoria en el rubro de asistencia vehicular, con origen en la ciudad de Temuco. Actualmente se encuentra en proceso de expansión hacia nuevas ciudades, con proyección a nivel nacional."
      },
      "alcance": {
        "usuarios": [
          "Operadores: coordinación y gestión de servicios",
          "Conductores: ejecución de servicios en terreno",
          "Encargados de mantenimiento: estado operativo de activos",
          "Clientes: herramientas de seguimiento y contacto"
        ],
        "objetivos": [
          "Mejorar la eficiencia en la asignación y ejecución de servicios",
          "Aumentar la visibilidad de la operación en tiempo real",
          "Optimizar la comunicación entre todos los actores",
          "Incorporar herramientas digitales orientadas al cliente",
          "Fortalecer el registro y respaldo de información administrativa",
          "Mejorar la calidad del servicio y satisfacción del cliente",
          "Facilitar la escalabilidad del negocio"
        ]
      },
      "solucion": {
        "vision": "Plataforma digital centralizada para la gestión integral de servicios de asistencia de Grúas Hardy",
        "beneficios": [
          "Optimización de la gestión logística",
          "Mayor visibilidad de la operación",
          "Mejora en la experiencia del cliente",
          "Reducción de dependencia de procesos manuales",
          "Fortalecimiento de la trazabilidad",
          "Mejora en la gestión administrativa",
          "Mejor coordinación entre actores"
        ]
      },
      "roles": {
        "operador": "Responsable de gestión y coordinación de servicios",
        "conductor": "Ejecución de servicios en terreno",
        "mantenimiento": "Gestión del estado operativo de las grúas",
        "cliente": "Usuario externo que recibe el servicio"
      },
      "modulos": [
        "Panel del usuario Administrador",
        "Módulo de Logística",
        "Gestión de Solicitudes",
        "Módulo de Agendamiento",
        "Historial de Servicios",
        "Mantenedor de Usuarios",
        "Mantenedor de Grúas",
        "Módulo de Aseguradoras",
        "App Móvil de Usuario Conductor",
        "Vista de Tracking para Cliente (Externa)",
        "Vista del usuario de Mantenimiento",
        "Tareas de Mantenimiento"
      ],
      "integraciones": [
        "Google Maps Platform - geolocalización y mapas",
        "WhatsApp - comunicación directa y notificaciones",
        "Servicios de geolocalización - captura de ubicación en tiempo real",
        "Waze - navegación asistida en tiempo real",
        "Envío de correos electrónicos - documentación formal"
      ],
      "arquitectura": {
        "frontend": "Angular + Ionic/Capacitor para Android",
        "backend": "NestJS - arquitectura escalable y orientada a servicios",
        "base_datos": "Supabase",
        "comunicacion": "API RESTful"
      },
      "consideraciones_tecnicas": {
        "seguridad": "Autenticación y autorización basada en roles (RBAC)",
        "trazabilidad": "Registro de eventos, acciones y cambios de estado",
        "escalabilidad": "Diseño desacoplado y modular para crecimiento futuro",
        "proteccion": "HTTPS, validación de datos, manejo seguro de credenciales"
      }
    }
  }'::jsonb,
  'activo',
  NOW() + INTERVAL '90 days',
  auth.uid()  -- Será el usuario actual autenticado
);

-- Verificar la inserción
SELECT id, nombre, estado, created_at FROM propuestas_tecnicas
WHERE cliente_id = '04b7464d-f01c-4216-8bce-9ebfd9f7fa4c';
