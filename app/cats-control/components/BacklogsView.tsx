"use client";

import React, { useState, useEffect } from "react";
import { Backlog, Cliente, UserStory, Epica } from "@/utils/supabase";
import { useAdminDB } from "@/app/admin/hooks/useAdminDB";
import { generateBacklogPDF } from "@/utils/backlog-pdf";

// Plantilla Hardy - 19 épicas + 100+ HUs
const HARDY_BACKLOG_TEMPLATE: Epica[] = [
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 1",
    nombre: "Dashboard",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU1.1", descripcion: "Como operador quiero ver resumen general" },
      { id: crypto.randomUUID(), codigo: "HU1.2", descripcion: "Como operador quiero ver indicadores clave" },
      { id: crypto.randomUUID(), codigo: "HU1.3", descripcion: "Como operador quiero visualizar alertas" },
      { id: crypto.randomUUID(), codigo: "HU1.4", descripcion: "Como operador quiero ver disponibilidad de recursos" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 2",
    nombre: "Logística Operativa",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU2.1", descripcion: "Como operador quiero visualizar servicios en distintos estados" },
      { id: crypto.randomUUID(), codigo: "HU2.2", descripcion: "Como operador quiero priorizar servicios según criticidad" },
      { id: crypto.randomUUID(), codigo: "HU2.3", descripcion: "Como operador quiero identificar servicios críticos" },
      { id: crypto.randomUUID(), codigo: "HU2.4", descripcion: "Como operador quiero acceder al detalle de un servicio" },
      { id: crypto.randomUUID(), codigo: "HU2.5", descripcion: "Como operador quiero ejecutar acciones rápidas desde el detalle" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 3",
    nombre: "Gestión de Solicitudes",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU3.1", descripcion: "Como operador quiero crear una solicitud de servicio" },
      { id: crypto.randomUUID(), codigo: "HU3.2", descripcion: "Como operador quiero registrar datos del cliente" },
      { id: crypto.randomUUID(), codigo: "HU3.3", descripcion: "Como operador quiero registrar ubicación del servicio" },
      { id: crypto.randomUUID(), codigo: "HU3.4", descripcion: "Como operador quiero clasificar tipo de servicio" },
      { id: crypto.randomUUID(), codigo: "HU3.5", descripcion: "Como operador quiero asignar prioridad a la solicitud" },
      { id: crypto.randomUUID(), codigo: "HU3.6", descripcion: "Como operador quiero editar una solicitud" },
      { id: crypto.randomUUID(), codigo: "HU3.7", descripcion: "Como operador quiero visualizar listado de solicitudes" },
      { id: crypto.randomUUID(), codigo: "HU3.8", descripcion: "Como operador quiero cambiar estado de la solicitud" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 4",
    nombre: "Agendamiento de Servicios",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU4.1", descripcion: "Como operador quiero visualizar calendario de servicios" },
      { id: crypto.randomUUID(), codigo: "HU4.2", descripcion: "Como operador quiero navegar entre períodos" },
      { id: crypto.randomUUID(), codigo: "HU4.3", descripcion: "Como operador quiero crear un agendamiento" },
      { id: crypto.randomUUID(), codigo: "HU4.4", descripcion: "Como operador quiero registrar fecha, hora y dirección" },
      { id: crypto.randomUUID(), codigo: "HU4.5", descripcion: "Como operador quiero registrar motivo del servicio" },
      { id: crypto.randomUUID(), codigo: "HU4.6", descripcion: "Como operador quiero definir tipo de grúa requerida" },
      { id: crypto.randomUUID(), codigo: "HU4.7", descripcion: "Como operador quiero asignar grúa al agendamiento" },
      { id: crypto.randomUUID(), codigo: "HU4.8", descripcion: "Como operador quiero visualizar listado de agendamientos" },
      { id: crypto.randomUUID(), codigo: "HU4.9", descripcion: "Como operador quiero editar agendamientos" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 5",
    nombre: "Registro Histórico de Servicios",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU5.1", descripcion: "Como operador quiero registrar cierre del servicio" },
      { id: crypto.randomUUID(), codigo: "HU5.2", descripcion: "Como operador quiero agregar observaciones" },
      { id: crypto.randomUUID(), codigo: "HU5.3", descripcion: "Como operador quiero visualizar historial" },
      { id: crypto.randomUUID(), codigo: "HU5.4", descripcion: "Como operador quiero ver detalle de servicio histórico" },
      { id: crypto.randomUUID(), codigo: "HU5.5", descripcion: "Como operador quiero visualizar evidencia" },
      { id: crypto.randomUUID(), codigo: "HU5.6", descripcion: "Como operador quiero visualizar firma digital" },
      { id: crypto.randomUUID(), codigo: "HU5.7", descripcion: "Como operador quiero editar registros históricos" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 6",
    nombre: "Mantenedor de Usuarios",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU6.1", descripcion: "Como operador quiero crear nuevos usuarios" },
      { id: crypto.randomUUID(), codigo: "HU6.2", descripcion: "Como operador quiero editar usuarios" },
      { id: crypto.randomUUID(), codigo: "HU6.3", descripcion: "Como operador quiero asignar roles" },
      { id: crypto.randomUUID(), codigo: "HU6.4", descripcion: "Como operador quiero activar o desactivar usuarios" },
      { id: crypto.randomUUID(), codigo: "HU6.5", descripcion: "Como operador quiero visualizar listado de usuarios" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 7",
    nombre: "Mantenedor de Grúas",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU7.1", descripcion: "Como operador quiero registrar nuevas grúas" },
      { id: crypto.randomUUID(), codigo: "HU7.2", descripcion: "Como operador quiero editar información de grúas" },
      { id: crypto.randomUUID(), codigo: "HU7.3", descripcion: "Como operador quiero asignar patente a una grúa" },
      { id: crypto.randomUUID(), codigo: "HU7.4", descripcion: "Como operador quiero asociar grúa a conductor" },
      { id: crypto.randomUUID(), codigo: "HU7.5", descripcion: "Como operador quiero visualizar estado operativo de grúas" },
      { id: crypto.randomUUID(), codigo: "HU7.6", descripcion: "Como encargado de mantenimiento quiero visualizar listado de grúas" },
      { id: crypto.randomUUID(), codigo: "HU7.7", descripcion: "Como encargado de mantenimiento quiero consultar historial técnico" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 8",
    nombre: "Módulo Aseguradora",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU8.1", descripcion: "Como operador quiero crear formularios" },
      { id: crypto.randomUUID(), codigo: "HU8.2", descripcion: "Como operador quiero asociar formularios a servicios" },
      { id: crypto.randomUUID(), codigo: "HU8.3", descripcion: "Como operador quiero adjuntar documentos" },
      { id: crypto.randomUUID(), codigo: "HU8.4", descripcion: "Como operador quiero exportar formularios" },
      { id: crypto.randomUUID(), codigo: "HU8.5", descripcion: "Como operador quiero importar documentos" },
      { id: crypto.randomUUID(), codigo: "HU8.6", descripcion: "Como operador quiero enviar formularios por correo" },
      { id: crypto.randomUUID(), codigo: "HU8.7", descripcion: "Como operador quiero registrar envíos realizados" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 9",
    nombre: "Vista de Usuario Conductor",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU9.1", descripcion: "Como conductor quiero iniciar sesión en la app" },
      { id: crypto.randomUUID(), codigo: "HU9.2", descripcion: "Como conductor quiero ver servicios asignados" },
      { id: crypto.randomUUID(), codigo: "HU9.3", descripcion: "Como conductor quiero ver detalle del servicio" },
      { id: crypto.randomUUID(), codigo: "HU9.4", descripcion: "Como conductor quiero actualizar estado del servicio" },
      { id: crypto.randomUUID(), codigo: "HU9.5", descripcion: "Como conductor quiero iniciar un servicio" },
      { id: crypto.randomUUID(), codigo: "HU9.6", descripcion: "Como conductor quiero finalizar un servicio" },
      { id: crypto.randomUUID(), codigo: "HU9.7", descripcion: "Como conductor quiero registrar observaciones" },
      { id: crypto.randomUUID(), codigo: "HU9.8", descripcion: "Como conductor quiero capturar evidencia" },
      { id: crypto.randomUUID(), codigo: "HU9.9", descripcion: "Como conductor quiero registrar firma digital" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 10",
    nombre: "Tracking Cliente (Externo)",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU10.1", descripcion: "Como sistema quiero generar enlace único de tracking" },
      { id: crypto.randomUUID(), codigo: "HU10.2", descripcion: "Como cliente quiero acceder sin autenticación" },
      { id: crypto.randomUUID(), codigo: "HU10.3", descripcion: "Como cliente quiero ver ubicación del conductor" },
      { id: crypto.randomUUID(), codigo: "HU10.4", descripcion: "Como cliente quiero ver estado del servicio" },
      { id: crypto.randomUUID(), codigo: "HU10.5", descripcion: "Como cliente quiero ver información básica del servicio" },
      { id: crypto.randomUUID(), codigo: "HU10.6", descripcion: "Como cliente quiero contactar al conductor" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 11",
    nombre: "Vista del Usuario de Mantenimiento",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU11.1", descripcion: "Como encargado de mantenimiento quiero registrar mantenimiento" },
      { id: crypto.randomUUID(), codigo: "HU11.2", descripcion: "Como encargado de mantenimiento quiero asociar a grúa" },
      { id: crypto.randomUUID(), codigo: "HU11.3", descripcion: "Como encargado de mantenimiento quiero definir tipo de mantenimiento" },
      { id: crypto.randomUUID(), codigo: "HU11.4", descripcion: "Como encargado de mantenimiento quiero actualizar estado" },
      { id: crypto.randomUUID(), codigo: "HU11.5", descripcion: "Como encargado de mantenimiento quiero registrar detalles" },
      { id: crypto.randomUUID(), codigo: "HU11.6", descripcion: "Como encargado de mantenimiento quiero adjuntar evidencia" },
      { id: crypto.randomUUID(), codigo: "HU11.7", descripcion: "Como encargado de mantenimiento quiero consultar historial" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 12",
    nombre: "Tareas de Mantenimiento",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU12.1", descripcion: "Como encargado de mantenimiento quiero crear tareas" },
      { id: crypto.randomUUID(), codigo: "HU12.2", descripcion: "Como encargado de mantenimiento quiero organizar tareas" },
      { id: crypto.randomUUID(), codigo: "HU12.3", descripcion: "Como encargado de mantenimiento quiero actualizar estado de tareas" },
      { id: crypto.randomUUID(), codigo: "HU12.4", descripcion: "Como encargado de mantenimiento quiero registrar ejecución" },
      { id: crypto.randomUUID(), codigo: "HU12.5", descripcion: "Como encargado de mantenimiento quiero visualizar avance" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 13",
    nombre: "Tracking en Tiempo Real (Operación Interna)",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU13.1", descripcion: "Como conductor quiero enviar ubicación automáticamente" },
      { id: crypto.randomUUID(), codigo: "HU13.2", descripcion: "Como conductor quiero que la app funcione en segundo plano" },
      { id: crypto.randomUUID(), codigo: "HU13.3", descripcion: "Como sistema quiero registrar ubicaciones periódicamente" },
      { id: crypto.randomUUID(), codigo: "HU13.4", descripcion: "Como operador quiero visualizar ubicación en mapa" },
      { id: crypto.randomUUID(), codigo: "HU13.5", descripcion: "Como operador quiero visualizar ubicación por servicio" },
      { id: crypto.randomUUID(), codigo: "HU13.6", descripcion: "Como operador quiero consultar historial de rutas" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 14",
    nombre: "Comunicación y Contacto",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU14.1", descripcion: "Como operador quiero llamar al cliente" },
      { id: crypto.randomUUID(), codigo: "HU14.2", descripcion: "Como operador quiero contactar por WhatsApp al cliente" },
      { id: crypto.randomUUID(), codigo: "HU14.3", descripcion: "Como operador quiero llamar al conductor" },
      { id: crypto.randomUUID(), codigo: "HU14.4", descripcion: "Como operador quiero contactar por WhatsApp al conductor" },
      { id: crypto.randomUUID(), codigo: "HU14.5", descripcion: "Como conductor quiero llamar al cliente" },
      { id: crypto.randomUUID(), codigo: "HU14.6", descripcion: "Como conductor quiero contactar por WhatsApp al cliente" },
      { id: crypto.randomUUID(), codigo: "HU14.7", descripcion: "Como sistema quiero enviar WhatsApp al asignar servicio" },
      { id: crypto.randomUUID(), codigo: "HU14.8", descripcion: "Como sistema quiero incluir link de tracking" },
      { id: crypto.randomUUID(), codigo: "HU14.9", descripcion: "Como sistema quiero incluir contacto del conductor" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 15",
    nombre: "Gestión de Solicitudes y Asignación (Core Operacional)",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU15.1", descripcion: "Como operador quiero asignar conductor a un servicio" },
      { id: crypto.randomUUID(), codigo: "HU15.2", descripcion: "Como operador quiero asignar grúa a un servicio" },
      { id: crypto.randomUUID(), codigo: "HU15.3", descripcion: "Como operador quiero validar disponibilidad" },
      { id: crypto.randomUUID(), codigo: "HU15.4", descripcion: "Como operador quiero evitar asignar grúas en mantenimiento" },
      { id: crypto.randomUUID(), codigo: "HU15.5", descripcion: "Como operador quiero programar ejecución" },
      { id: crypto.randomUUID(), codigo: "HU15.6", descripcion: "Como operador quiero modificar asignaciones" },
      { id: crypto.randomUUID(), codigo: "HU15.7", descripcion: "Como sistema quiero activar servicio" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 16",
    nombre: "Autenticación y Control de Acceso",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU16.1", descripcion: "Como usuario quiero iniciar sesión" },
      { id: crypto.randomUUID(), codigo: "HU16.2", descripcion: "Como sistema quiero validar credenciales" },
      { id: crypto.randomUUID(), codigo: "HU16.3", descripcion: "Como sistema quiero identificar rol" },
      { id: crypto.randomUUID(), codigo: "HU16.4", descripcion: "Como sistema quiero restringir acceso" },
      { id: crypto.randomUUID(), codigo: "HU16.5", descripcion: "Como usuario quiero cerrar sesión" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 17",
    nombre: "Auditoría y Trazabilidad",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU17.1", descripcion: "Como sistema quiero registrar acciones" },
      { id: crypto.randomUUID(), codigo: "HU17.2", descripcion: "Como operador quiero consultar historial" },
      { id: crypto.randomUUID(), codigo: "HU17.3", descripcion: "Como operador quiero auditar cambios" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 18",
    nombre: "Notificaciones",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU18.1", descripcion: "Como conductor quiero recibir notificaciones push" },
      { id: crypto.randomUUID(), codigo: "HU18.2", descripcion: "Como conductor quiero recibir cambios de servicio" },
      { id: crypto.randomUUID(), codigo: "HU18.3", descripcion: "Como encargado de mantenimiento quiero recibir alertas" },
      { id: crypto.randomUUID(), codigo: "HU18.4", descripcion: "Como operador quiero recibir alertas críticas" },
    ]
  },
  {
    id: crypto.randomUUID(),
    codigo: "ÉPICA 19",
    nombre: "Capacidades Mobile del Conductor",
    historias: [
      { id: crypto.randomUUID(), codigo: "HU19.1", descripcion: "Como conductor quiero mantener sesión activa" },
      { id: crypto.randomUUID(), codigo: "HU19.2", descripcion: "Como conductor quiero permitir acceso a GPS" },
      { id: crypto.randomUUID(), codigo: "HU19.3", descripcion: "Como conductor quiero permitir acceso a cámara" },
      { id: crypto.randomUUID(), codigo: "HU19.4", descripcion: "Como conductor quiero poder seguir viendo la información si pierdo conexión" },
      { id: crypto.randomUUID(), codigo: "HU19.5", descripcion: "Como conductor quiero sincronizar datos offline" },
    ]
  },
];

export default function BacklogsView() {
  const { select, insert, update, remove } = useAdminDB();
  const [backlogs, setBacklogs] = useState<Backlog[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBacklog, setEditingBacklog] = useState<Backlog | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalEpicas, setModalEpicas] = useState<Epica[]>([]);

  // Modal form state
  const [formData, setFormData] = useState({
    nombre: "",
    cliente_nombre: "",
    cliente_id: "",
    descripcion: "",
    notas: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const backlogsData = await select("backlogs");
      const clientesData = await select("clientes");
      setBacklogs((backlogsData || []) as Backlog[]);
      setClientes((clientesData || []) as Cliente[]);
    } catch (error) {
      console.error("Error loading backlogs:", error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingBacklog(null);
    setFormData({ nombre: "", cliente_nombre: "", cliente_id: "", descripcion: "", notas: "" });
    setModalEpicas([]);
    setShowModal(true);
  }

  function loadHardyTemplate() {
    setFormData({
      nombre: "Sistema de Administración para Grúas Hardy",
      cliente_nombre: "Grúas Hardy",
      cliente_id: "",
      descripcion: "Plataforma completa de gestión operacional, logística y tracking para la flota de grúas.",
      notas: "Plantilla prediseñada con 19 épicas y 100+ historias de usuario",
    });
    // Deep clone para no mutar la plantilla original
    setModalEpicas(JSON.parse(JSON.stringify(HARDY_BACKLOG_TEMPLATE)));
  }

  function openEditModal(backlog: Backlog) {
    setEditingBacklog(backlog);
    setFormData({
      nombre: backlog.nombre,
      cliente_nombre: backlog.cliente_nombre,
      cliente_id: backlog.cliente_id || "",
      descripcion: backlog.descripcion || "",
      notas: backlog.notas || "",
    });
    setShowModal(true);
  }

  async function handleSaveModal() {
    if (!formData.nombre.trim() || !formData.cliente_nombre.trim()) {
      alert("Nombre del proyecto y cliente son requeridos");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nombre: formData.nombre,
        cliente_nombre: formData.cliente_nombre,
        cliente_id: formData.cliente_id || null,
        descripcion: formData.descripcion,
        notas: formData.notas,
        epicas: modalEpicas.length > 0 ? modalEpicas : (editingBacklog?.epicas || []),
      };

      if (editingBacklog) {
        await update("backlogs", editingBacklog.id, payload);
      } else {
        await insert("backlogs", payload);
      }

      setShowModal(false);
      await loadData();
    } catch (error) {
      console.error("Error saving backlog:", error);
      alert("Error al guardar el backlog");
    } finally {
      setSaving(false);
    }
  }

  async function handleClone(backlog: Backlog) {
    const newClientName = prompt("Nuevo nombre del cliente:");
    if (!newClientName?.trim()) return;

    setSaving(true);
    try {
      const payload = {
        nombre: backlog.nombre,
        cliente_nombre: newClientName,
        cliente_id: null,
        descripcion: backlog.descripcion,
        notas: backlog.notas,
        epicas: JSON.parse(JSON.stringify(backlog.epicas)), // Deep clone
      };

      await insert("backlogs", payload);
      await loadData();
    } catch (error) {
      console.error("Error cloning backlog:", error);
      alert("Error al clonar el backlog");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de que deseas eliminar este backlog?")) return;

    setSaving(true);
    try {
      await remove("backlogs", id);
      await loadData();
    } catch (error) {
      console.error("Error deleting backlog:", error);
      alert("Error al eliminar el backlog");
    } finally {
      setSaving(false);
    }
  }

  function handleCopyLink(backlog: Backlog) {
    const url = `${window.location.origin}/backlog/${backlog.id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert(`Link copiado: ${url}`);
    });
  }

  async function handleTogglePublico(backlog: Backlog) {
    try {
      await update("backlogs", backlog.id, { publico: !(backlog.publico ?? true) });
      loadData();
    } catch (err) {
      console.error("Error toggling publico:", err);
    }
  }

  async function handleExportPDF(backlog: Backlog) {
    try {
      generateBacklogPDF(backlog);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Error al generar el PDF");
    }
  }

  async function handleSaveEpicas(backlogId: string, epicas: Epica[]) {
    setSaving(true);
    try {
      await update("backlogs", backlogId, { epicas });
      await loadData();
      setExpandedId(null);
    } catch (error) {
      console.error("Error saving epicas:", error);
      alert("Error al guardar las épicas");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C5CBF]"></div>
          <p className="mt-4 text-sm text-[#52525B] dark:text-[#A1A1AA]">Cargando backlogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#18181B] dark:text-white">Backlogs</h1>
          <p className="text-sm text-[#A1A1AA] mt-1">Gestiona los product backlogs de tus proyectos</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-[#7C5CBF] text-white px-6 py-2 rounded-xl hover:bg-[#6B4DAE] transition-all font-medium text-sm active:scale-[0.98]"
        >
          + Nuevo Backlog
        </button>
      </div>

      {backlogs.length === 0 ? (
        <div className="text-center py-16 bg-[#F9F8FF] dark:bg-[#1A1825] rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35]">
          <svg className="w-16 h-16 mx-auto text-[#D4CCFF] dark:text-[#3D3357] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
          <p className="text-[#52525B] dark:text-[#A1A1AA] font-medium">No hay backlogs aún</p>
          <p className="text-sm text-[#A1A1AA] mt-1">Crea uno nuevo para empezar a gestionar tus proyectos</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F9F8FF] dark:bg-[#1A1825] border-b border-[#E4E4E7] dark:border-[#2A2A35]">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-[#52525B] dark:text-[#A1A1AA]">Proyecto</th>
                <th className="px-6 py-3 text-left font-semibold text-[#52525B] dark:text-[#A1A1AA]">Cliente</th>
                <th className="px-6 py-3 text-center font-semibold text-[#52525B] dark:text-[#A1A1AA]">Épicas</th>
                <th className="px-6 py-3 text-center font-semibold text-[#52525B] dark:text-[#A1A1AA]">HUs</th>
                <th className="px-6 py-3 text-left font-semibold text-[#52525B] dark:text-[#A1A1AA]">Fecha</th>
                <th className="px-6 py-3 text-center font-semibold text-[#52525B] dark:text-[#A1A1AA]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7] dark:divide-[#2A2A35]">
              {backlogs.map((backlog) => {
                const totalHUs = backlog.epicas.reduce((sum, e) => sum + e.historias.length, 0);
                const isExpanded = expandedId === backlog.id;

                return (
                  <React.Fragment key={backlog.id}>
                    <tr className="hover:bg-[#F9F8FF] dark:hover:bg-[#1A1825] transition-colors">
                      <td className="px-6 py-4 font-medium text-[#18181B] dark:text-white">{backlog.nombre}</td>
                      <td className="px-6 py-4 text-[#52525B] dark:text-[#A1A1AA]">{backlog.cliente_nombre}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block bg-[#F3EEFF] dark:bg-[#2D1F4D] text-[#7C5CBF] px-3 py-1 rounded-lg text-xs font-semibold">
                          {backlog.epicas.length}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-[#52525B] dark:text-[#A1A1AA]">{totalHUs}</td>
                      <td className="px-6 py-4 text-xs text-[#A1A1AA]">
                        {backlog.created_at ? new Date(backlog.created_at).toLocaleDateString("es-CL") : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : backlog.id)}
                            className="p-1.5 rounded-lg hover:bg-[#F3EEFF] dark:hover:bg-[#2D1F4D] text-[#7C5CBF] transition-colors"
                            title="Editar épicas"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openEditModal(backlog)}
                            className="p-1.5 rounded-lg hover:bg-[#F3EEFF] dark:hover:bg-[#2D1F4D] text-[#52525B] dark:text-[#A1A1AA] transition-colors"
                            title="Editar metadatos"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleTogglePublico(backlog)}
                            title={backlog.publico === false ? "Activar link" : "Desactivar link"}
                            className={`p-1.5 rounded-lg transition-colors ${
                              backlog.publico === false
                                ? "bg-gray-100 dark:bg-gray-900/20 text-gray-400 hover:bg-gray-200"
                                : "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200"
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={backlog.publico === false ? "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" : "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z"} />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleCopyLink(backlog)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              backlog.publico === false
                                ? "opacity-30 cursor-not-allowed text-gray-400"
                                : "hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                            }`}
                            title="Copiar link para cliente"
                            disabled={backlog.publico === false}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleExportPDF(backlog)}
                            className="p-1.5 rounded-lg hover:bg-[#F3EEFF] dark:hover:bg-[#2D1F4D] text-[#52525B] dark:text-[#A1A1AA] transition-colors"
                            title="Exportar PDF"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2m0-8v6m0-6L3 7m9 0l9-4" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleClone(backlog)}
                            className="p-1.5 rounded-lg hover:bg-[#F3EEFF] dark:hover:bg-[#2D1F4D] text-[#52525B] dark:text-[#A1A1AA] transition-colors"
                            title="Clonar"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(backlog.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition-colors"
                            title="Eliminar"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-[#F9F8FF] dark:bg-[#1A1825]">
                          <BacklogEditor backlog={backlog} onSave={handleSaveEpicas} saving={saving} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] max-w-lg w-full p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#18181B] dark:text-white">
                {editingBacklog ? "Editar Backlog" : "Nuevo Backlog"}
              </h2>
              <p className="text-sm text-[#A1A1AA] mt-1">Gestiona el nombre y detalles de tu backlog</p>
            </div>

            {!editingBacklog && (
              <button
                onClick={loadHardyTemplate}
                className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-[#D4CCFF] dark:border-[#3D3357] text-[#7C5CBF] hover:bg-[#F3EEFF] dark:hover:bg-[#2D1F4D] transition-all font-medium text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Cargar Plantilla Hardy (19 Épicas + 100+ HUs)
              </button>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#18181B] dark:text-white mb-2">
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="ej: Sistema ERP Hardy"
                  className="w-full border border-[#E4E4E7] dark:border-[#3F3F46] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] transition-all bg-white dark:bg-[#27272A] text-[#18181B] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#18181B] dark:text-white mb-2">
                  Cliente *
                </label>
                <input
                  type="text"
                  value={formData.cliente_nombre}
                  onChange={(e) => setFormData({ ...formData, cliente_nombre: e.target.value })}
                  placeholder="ej: Grúas Hardy"
                  className="w-full border border-[#E4E4E7] dark:border-[#3F3F46] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] transition-all bg-white dark:bg-[#27272A] text-[#18181B] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#18181B] dark:text-white mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción general del proyecto"
                  rows={3}
                  className="w-full border border-[#E4E4E7] dark:border-[#3F3F46] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] transition-all bg-white dark:bg-[#27272A] text-[#18181B] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#18181B] dark:text-white mb-2">
                  Notas
                </label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Notas adicionales"
                  rows={2}
                  className="w-full border border-[#E4E4E7] dark:border-[#3F3F46] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] transition-all bg-white dark:bg-[#27272A] text-[#18181B] dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-[#E4E4E7] dark:border-[#2A2A35]">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-[#E4E4E7] dark:border-[#3F3F46] text-[#18181B] dark:text-white hover:bg-[#F9F8FF] dark:hover:bg-[#27272A] transition-all font-medium"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveModal}
                className="flex-1 px-4 py-3 rounded-xl bg-[#7C5CBF] text-white hover:bg-[#6B4DAE] transition-all font-medium disabled:opacity-50"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BacklogEditor Component
// ============================================================================

interface BacklogEditorProps {
  backlog: Backlog;
  onSave: (backlogId: string, epicas: Epica[]) => Promise<void>;
  saving: boolean;
}

function BacklogEditor({ backlog, onSave, saving }: BacklogEditorProps) {
  const [epicas, setEpicas] = useState<Epica[]>(backlog.epicas || []);

  function addEpica() {
    const newEpica: Epica = {
      id: crypto.randomUUID(),
      codigo: `ÉPICA ${epicas.length + 1}`,
      nombre: "",
      historias: [],
    };
    setEpicas([...epicas, newEpica]);
  }

  function updateEpica(id: string, updates: Partial<Epica>) {
    setEpicas(epicas.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }

  function deleteEpica(id: string) {
    setEpicas(epicas.filter((e) => e.id !== id));
  }

  function addHU(epicaId: string) {
    setEpicas(
      epicas.map((e) => {
        if (e.id === epicaId) {
          const newHU: UserStory = {
            id: crypto.randomUUID(),
            codigo: `HU${e.id.slice(0, 2).toUpperCase()}.${e.historias.length + 1}`,
            descripcion: "",
          };
          return { ...e, historias: [...e.historias, newHU] };
        }
        return e;
      })
    );
  }

  function updateHU(epicaId: string, huId: string, updates: Partial<UserStory>) {
    setEpicas(
      epicas.map((e) => {
        if (e.id === epicaId) {
          return {
            ...e,
            historias: e.historias.map((hu) => (hu.id === huId ? { ...hu, ...updates } : hu)),
          };
        }
        return e;
      })
    );
  }

  function deleteHU(epicaId: string, huId: string) {
    setEpicas(
      epicas.map((e) => {
        if (e.id === epicaId) {
          return { ...e, historias: e.historias.filter((hu) => hu.id !== huId) };
        }
        return e;
      })
    );
  }

  return (
    <div className="space-y-4">
      {epicas.map((epica) => (
        <div key={epica.id} className="border border-[#E4E4E7] dark:border-[#3F3F46] rounded-xl p-4 bg-white dark:bg-[#27272A]">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <input
                type="text"
                value={epica.nombre}
                onChange={(e) => updateEpica(epica.id, { nombre: e.target.value })}
                placeholder="Nombre de la épica"
                className="w-full border border-[#E4E4E7] dark:border-[#3F3F46] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] bg-white dark:bg-[#3F3F46] text-[#18181B] dark:text-white"
              />
            </div>
            <button
              onClick={() => deleteEpica(epica.id)}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-2 ml-3">
            {epica.historias.map((hu) => (
              <div key={hu.id} className="flex items-start gap-2">
                <input
                  type="text"
                  value={hu.codigo}
                  onChange={(e) => updateHU(epica.id, hu.id, { codigo: e.target.value })}
                  placeholder="HU1.1"
                  className="w-20 border border-[#E4E4E7] dark:border-[#3F3F46] rounded-lg px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] bg-white dark:bg-[#3F3F46] text-[#18181B] dark:text-white"
                />
                <textarea
                  value={hu.descripcion}
                  onChange={(e) => updateHU(epica.id, hu.id, { descripcion: e.target.value })}
                  placeholder="Descripción de la historia de usuario"
                  rows={2}
                  className="flex-1 border border-[#E4E4E7] dark:border-[#3F3F46] rounded-lg px-3 py-1 text-xs outline-none focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] bg-white dark:bg-[#3F3F46] text-[#18181B] dark:text-white"
                />
                <button
                  onClick={() => deleteHU(epica.id, hu.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={() => addHU(epica.id)}
              className="text-sm text-[#7C5CBF] hover:underline font-medium"
            >
              + Agregar HU
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addEpica}
        className="w-full py-3 rounded-xl border-2 border-dashed border-[#D4CCFF] dark:border-[#3D3357] text-[#7C5CBF] hover:bg-[#F3EEFF] dark:hover:bg-[#2D1F4D] transition-all font-medium text-sm"
      >
        + Agregar Épica
      </button>

      <button
        onClick={() => onSave(backlog.id, epicas)}
        disabled={saving}
        className="w-full py-3 rounded-xl bg-[#7C5CBF] text-white hover:bg-[#6B4DAE] transition-all font-medium disabled:opacity-50 mt-4"
      >
        {saving ? "Guardando..." : "Guardar Épicas"}
      </button>
    </div>
  );
}
