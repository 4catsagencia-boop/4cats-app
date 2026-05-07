UPDATE propuestas_tecnicas
SET contenido_json = '{
  "titulo": "Sistema de Administración para Grúas Hardy",
  "autor": "María José Calderón - Ingeniera de Software",
  "fecha": "28 de Abril 2026",
  "destinatario": "Grúas Hardy",
  "introduccion": "El presente documento presenta una propuesta de solución tecnológica para Grúas Hardy, orientada a optimizar su operación mediante una plataforma digital centralizada. Esta solución mejora la coordinación de servicios, la asignación eficiente de recursos y la comunicación entre los distintos actores involucrados, fortaleciendo la trazabilidad de las operaciones y la gestión de información.",
  "secciones": {
    "contexto_del_problema": "La operación presenta desafíos asociados al crecimiento de la demanda y la necesidad de coordinar múltiples servicios simultáneamente. Se identifica una fragmentación en los procesos operativos y de comunicación, donde distintas herramientas no integradas dificultan la visibilidad en tiempo real. La falta de visibilidad sobre el estado del servicio y la ubicación del recurso asignado impacta negativamente en la percepción del cliente.",
    "contexto_de_la_empresa": "Grúas Hardy es una empresa con más de 20 años de trayectoria en asistencia vehicular, con origen en Temuco. Ha consolidado su presencia en el sur de Chile y se encuentra en proceso de expansión hacia nuevas ciudades, con proyección nacional.",
    "alcance_de_la_solucion": {
      "descripcion": "La solución consiste en el desarrollo de una plataforma digital que centraliza la gestión de servicios, asignación de recursos, seguimiento en tiempo real y administración de procesos operativos y administrativos.",
      "actores": ["Operadores: coordinación y gestión de servicios", "Conductores: ejecución de servicios en terreno con captura de evidencia", "Encargados de mantenimiento: estado operativo de los activos", "Clientes: herramientas de seguimiento y contacto"],
      "objetivos": ["Mejorar la eficiencia en asignación y ejecución de servicios", "Aumentar la visibilidad de la operación en tiempo real", "Optimizar la comunicación entre todos los actores", "Incorporar herramientas digitales orientadas al cliente", "Fortalecer el registro y respaldo de información administrativa", "Facilitar la escalabilidad del negocio"]
    },
    "descripcion_general": {
      "vision_general": "Plataforma digital centralizada para la gestión integral de servicios de asistencia. El sistema es multiusuario, adaptándose a las necesidades específicas de cada rol. Integra procesos actualmente dispersos en un solo entorno digital.",
      "beneficios_esperados": ["Optimización de la gestión logística: mejora en asignación de recursos y tiempos de respuesta", "Mayor visibilidad de la operación en tiempo real", "Mejora en la experiencia del cliente con herramientas de seguimiento", "Reducción de dependencia de procesos manuales", "Fortalecimiento de la trazabilidad y registro de eventos", "Mejora en la gestión administrativa y documentación para aseguradoras"]
    },
    "roles_del_sistema": {
      "operador_administrador": "Responsable de la gestión y coordinación de servicios. Crea solicitudes, asigna conductores y grúas, monitorea el estado de la operación en tiempo real, gestiona usuarios y recursos, y administra documentación.",
      "conductor": "Responsable de la ejecución de servicios en terreno. Accede a servicios asignados, actualiza estados, comparte ubicación en tiempo real, captura evidencia y valida información mediante firma digital.",
      "encargado_de_mantenimiento": "Responsable del estado operativo de las grúas. Registra y gestiona mantenimientos, define tareas, actualiza estados y mantiene el historial técnico de los activos.",
      "cliente": "Usuario externo que accede a información del servicio, seguimiento en tiempo real y opciones de contacto directo."
    },
    "flujos_principales": {
      "gestion_de_servicios": "El operador registra una solicitud, evalúa disponibilidad y asigna grúa y conductor. El sistema actualiza el estado y habilita herramientas de seguimiento y comunicación para operador y cliente.",
      "ejecucion_del_conductor": "El conductor accede a la información del servicio desde su dispositivo, actualiza estados durante la ejecución, comparte ubicación en tiempo real y al finalizar registra evidencia, observaciones y firma digital.",
      "mantenimiento": "El encargado registra un mantenimiento preventivo o correctivo, define tareas, ejecuta y actualiza estados, registra detalles y evidencia. Al finalizar, queda disponible en el historial técnico del activo.",
      "comunicacion_con_cliente": "Una vez asignado el servicio, se habilitan mecanismos de información sobre el estado de la atención y seguimiento en tiempo real. Se facilitan canales de contacto directo entre cliente y conductor."
    },
    "modulos_del_sistema": {
      "panel_administrador": "Vista principal con visión global de la operación en tiempo real. Incluye indicadores clave de servicios, alertas, disponibilidad de recursos y acceso rápido a todos los módulos.",
      "logistica": "Núcleo operativo. Visualización de solicitudes, asignación de conductores y grúas, seguimiento de estados y acceso al detalle completo de cada servicio.",
      "tracking_tiempo_real": "Visualización de la ubicación de conductores en tiempo real sobre mapa interactivo. Disponible también para el cliente mediante enlace. Integración con Google Maps Platform.",
      "gestion_de_solicitudes": "Creación y gestión de solicitudes, registro de información del cliente, clasificación del tipo de atención, asignación de conductor y grúa, activación del servicio.",
      "agendamiento": "Planificación de servicios programados con vista de calendario. Creación de agendamientos, registro de fecha/hora/dirección, asignación de grúa y seguimiento de carga operativa futura.",
      "historial_de_servicios": "Registro estructurado de servicios finalizados. Consulta de información histórica, evidencia, observaciones y documentación. Soporte para procesos administrativos y aseguradoras.",
      "mantenedor_de_usuarios": "Gestión centralizada de cuentas y roles. Creación, edición, activación y desactivación de usuarios. Control de permisos por rol.",
      "mantenedor_de_gruas": "Registro y gestión de activos operativos. Asociación grúa-conductor, estado operativo y disponibilidad para asignación de servicios.",
      "modulo_aseguradoras": "Gestión estructurada de documentación para compañías de seguros. Formularios, integración con evidencia del servicio, exportación e importación de documentos.",
      "app_movil_conductor": "Aplicación Android independiente (Angular + Ionic + Capacitor). Gestión de jornada, servicios asignados, actualización de estados, tracking, contacto con cliente, captura de evidencia, firma digital, navegación con Waze.",
      "tracking_cliente": "Vista externa sin autenticación. El cliente visualiza la ubicación del conductor en tiempo real, el estado del servicio y tiene acceso a contacto directo. Optimizado para móvil.",
      "vista_mantenimiento": "Interfaz para el encargado de mantenimiento. Registro de mantenimientos preventivos y correctivos, gestión de tareas, historial técnico de grúas y actualización del estado operativo.",
      "tareas_de_mantenimiento": "Descomposición de mantenimientos en actividades específicas. Creación, organización, actualización de estados y registro de detalles de ejecución."
    },
    "integraciones": {
      "google_maps_platform": "Visualización de ubicaciones en mapa interactivo, seguimiento en tiempo real, interpretación de coordenadas en direcciones legibles.",
      "whatsapp": "Envío de notificaciones automáticas al cliente al asignar un servicio, compartir enlaces de tracking, contacto directo entre cliente y conductor.",
      "geolocalizacion": "Captura periódica de ubicación del conductor desde dispositivos móviles, asociación a servicios activos, mejora en visibilidad y tiempos de respuesta.",
      "waze": "Generación automática de ruta desde la ubicación del conductor hasta el destino del cliente, optimizando tiempos de desplazamiento.",
      "correo_electronico": "Envío de formularios y documentos a aseguradoras, adjuntar evidencia y respaldos, registro de comunicaciones formales."
    },
    "consideraciones_tecnicas": {
      "arquitectura": "Frontend: Angular (web) + Ionic con Capacitor (app móvil Android). Backend: NestJS con API RESTful. Base de datos: Supabase. Arquitectura desacoplada que permite escalar frontend y backend de forma independiente.",
      "seguridad": "Control de acceso basado en roles (RBAC). Protección de endpoints mediante autenticación, manejo seguro de credenciales, validación en frontend y backend, uso de HTTPS.",
      "trazabilidad": "Registro de eventos relevantes: creación y modificación de servicios, asignación de recursos, cambios de estado, acciones de usuarios. Historial completo para auditoría y análisis.",
      "escalabilidad": "Arquitectura moderna y desacoplada que permite incorporar nuevas funcionalidades sin afectar la estructura existente. API facilita integración futura con sistemas externos."
    },
    "conclusion": {
      "resumen": "Plataforma digital integral que centraliza la gestión de servicios de Grúas Hardy, optimizando la coordinación operativa, mejorando la asignación de recursos y fortaleciendo la comunicación entre todos los actores del sistema.",
      "impacto_esperado": ["Mayor eficiencia en gestión y coordinación de servicios", "Reducción de errores en asignación de recursos", "Mejora en tiempos de respuesta y ejecución", "Aumento de visibilidad y control en tiempo real", "Fortalecimiento de la experiencia del cliente", "Mejora en gestión administrativa para aseguradoras", "Disminución de dependencia de procesos manuales"],
      "proximos_pasos": "Revisión y validación del alcance presentado para asegurar alineación con las necesidades de la operación. A partir de esa validación, definición detallada de funcionalidades, priorización y organización en etapas de implementación."
    }
  }
}'::jsonb
WHERE cliente_id = '04b7464d-f01c-4216-8bce-9ebfd9f7fa4c';
