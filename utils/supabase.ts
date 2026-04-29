import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (process.env.NODE_ENV === 'development' && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn('Supabase URL or Anon Key is missing. Check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Cliente de servidor con privilegios de Service Role.
 * Únicamente para uso en API Routes (Server Side).
 * Salta el RLS.
 */
export const getServiceSupabase = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing. Check your environment variables.')
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export enum Tables {
  Planes = 'planes',
  PlanesMantenimiento = 'planes_mantenimiento',
  Clientes = 'clientes',
  Cotizaciones = 'cotizaciones',
  Pagos = 'pagos',
  Metas = 'metas',
  Servicios = 'servicios',
  Facturas = 'facturas',
  HitosPago = 'hitos_pago',
  Colaboradores = 'colaboradores',
  Propuestas = 'propuestas',
  AccesosPropuesta = 'accesos_propuesta',
  Gastos = 'gastos',
  Comisiones = 'comisiones'
}

export type Moneda = 'CLP' | 'BRL' | 'USD'
export type MetodoPago = 'transferencia' | 'tarjeta_credito' | 'efectivo' | 'otros'

export interface Plan {
  id: string
  nombre: string
  precio: number
  destacado: boolean
  publicado: boolean
  descripcion?: string
  caracteristicas?: string[]
  created_at?: string
}

export interface PlanMantenimiento {
  id: string
  nombre: string
  precio: number
  publicado: boolean
  destacado?: boolean
  descripcion?: string
  caracteristicas?: string[]
  created_at?: string
}

export interface Cliente {
  id: string
  nombre: string
  email: string
  telefono?: string
  sitio_web?: string
  persona_encargada?: string
  razon_social?: string
  rut?: string
  giro?: string
  direccion_facturacion?: string
  comuna?: string
  ciudad?: string
  clasificacion?: string
  condicion_pago?: string
  tipo_documento?: string
  instagram?: string
  linkedin?: string
  facebook?: string
  tiktok?: string
  twitter?: string
  created_at?: string
}

export interface Cotizacion {
  id: string
  cliente_id: string
  cliente_nombre: string
  plan_id?: string
  plan_nombre: string
  total: number
  moneda: Moneda
  estado: 'pendiente' | 'aprobada' | 'rechazada'
  notas?: string
  items?: CotizacionItem[]
  created_at?: string
}

export interface CotizacionItem {
  descripcion: string
  precio: number
}

export interface Pago {
  id: string
  cotizacion_id: string
  monto: number
  moneda: Moneda
  fecha_pago: string
  metodo_pago: MetodoPago
  comprobante_url?: string
  created_at?: string
}

export interface Meta {
  id: string
  mes: number
  anio: number
  monto: number
  created_at?: string
}

export interface Servicio {
  id: string
  nombre: string
  tipo: 'mantenimiento' | 'web_dev' | 'asesoria' | 'otros'
  capacidad_mensual: number
  cupos_ocupados: number
}

export interface Factura {
  id: string
  cotizacion_id: string
  cliente_id: string
  numero_factura?: string
  monto_total: number
  moneda: Moneda
  estado: 'pendiente' | 'pagada' | 'anulada'
  created_at?: string
}

export interface HitoPago {
  id: string
  factura_id: string
  nombre: string
  monto: number
  moneda: Moneda
  estado: 'pendiente' | 'pagado'
  fecha_pago?: string
  metodo_pago?: MetodoPago
  created_at?: string
}

export interface Gasto {
  id: string
  descripcion: string
  monto: number
  moneda: Moneda
  categoria: string
  fecha: string
  tipo?: string
  estado?: string
  pago_id?: string
  created_at?: string
}

export interface Colaborador {
  id: string
  nombre: string
  email: string
  rol: string
  rut?: string
  telefono?: string
  direccion?: string
  banco?: string
  tipo_cuenta?: string
  numero_cuenta?: string
  comision_porcentaje: number
  activo: boolean
  created_at?: string
}

export interface Comision {
  id: string
  colaborador_id: string
  hito_pago_id: string
  monto: number
  estado: 'pendiente' | 'pagada'
  created_at?: string
}

export interface AccesosPropuesta {
  id: string
  propuesta_id: string
  ip: string
  user_agent: string
  dispositivo?: string
  tiempo_permanencia?: number
  cta_click?: boolean
  created_at?: string
}

export interface MetricaBenchmark {
  nombre: string
  actual: number
  competidor: number
  propuesta: number
  unidad: string
}

export interface Ventaja {
  icono: string
  titulo: string
  descripcion: string
}

export interface LinkRecurso {
  label: string
  url: string
  tipo: 'cliente' | 'competidor' | 'prototipo' | 'reporte'
}

export interface Propuesta {
  id: string
  cliente_id: string
  slug: string
  titulo: string
  subtitulo?: string
  estado: 'borrador' | 'enviada' | 'vista' | 'aprobada'
  tipo: 'web' | 'app' | 'crm' | 'erp' | 'saas'
  problema?: string
  competidor_nombre?: string
  competidor_url?: string
  solucion_titulo?: string
  solucion_descripcion?: string
  metricas: MetricaBenchmark[]
  ventajas: Ventaja[]
  links: LinkRecurso[]
  vistas: number
  expira_at?: string
  created_at?: string
  updated_at?: string
}

// =============================================================================
// ROI & METRICS TEMPLATES (Contexto Alpha)
// =============================================================================

export const METRICAS_ROI_TEMPLATE: MetricaBenchmark[] = [
  { nombre: 'PageSpeed Mobile', actual: 0, competidor: 0, propuesta: 0, unidad: '/100' },
  { nombre: 'CTR (Click-to-Call)', actual: 0, competidor: 0, propuesta: 0, unidad: '%' },
  { nombre: 'Tasa Conversión', actual: 0, competidor: 0, propuesta: 0, unidad: '%' },
  { nombre: 'Ranking Keywords', actual: 0, competidor: 0, propuesta: 0, unidad: 'pos' },
  { nombre: 'Uptime (24/7)', actual: 0, competidor: 0, propuesta: 0, unidad: '%' },
  { nombre: 'Security Score', actual: 0, competidor: 0, propuesta: 0, unidad: '/100' },
];

export const METRIC_HIGHER_IS_BETTER: Record<string, boolean> = {
  'PageSpeed Mobile': true,
  'PageSpeed Desktop': true,
  'CTR (Click-to-Call)': true,
  'Tasa Conversión': true,
  'Ranking Keywords': false, // Menor posición es mejor (ej: pos 1 > pos 10)
  'Uptime (24/7)': true,
  'Security Score': true,
  'FCP (mobile)': false,
  'LCP (mobile)': false,
  'TBT (mobile)': false,
  'CLS (mobile)': false,
  'Speed Index (mobile)': false,
  'Accesibilidad (A11y)': true,
  'SEO Score': true,
  'Best Practices': true,
  'Tiempo Tarea Crítica': false,
  'Costo por Lead': false,
  'Retención': true
};

// =============================================================================
// PUBLIC FUNCTIONS (Safe for Client-Side with RLS)
// =============================================================================

export const fetchPlanesPublicados = async (): Promise<Plan[]> => {
  const { data, error } = await supabase
    .from(Tables.Planes)
    .select('*')
    .eq('publicado', true)
    .order('precio', { ascending: true })

  if (error) {
    console.error('Error fetching planes:', error)
    return []
  }
  return (data as Plan[]) || []
}

export const fetchPlanesMantenimientoPublicados = async (): Promise<PlanMantenimiento[]> => {
  const { data, error } = await supabase
    .from(Tables.PlanesMantenimiento)
    .select('*')
    .eq('publicado', true)
    .order('precio', { ascending: true })

  if (error) {
    console.error('Error fetching planes mantenimiento:', error)
    return []
  }
  return (data as PlanMantenimiento[]) || []
}

export const fetchPropuestaBySlug = async (slug: string): Promise<Propuesta | null> => {
  const { data, error } = await supabase
    .from(Tables.Propuestas)
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching propuesta:', error)
    return null
  }
  return data as Propuesta
}

// =============================================================================
// DEPRECATED / REDIRECT TO PROXY (Use useAdminDB instead)
// =============================================================================

/** 
 * ADVERTENCIA: Las funciones que se eliminaron de aquí ahora deben llamarse 
 * a través de 'useAdminDB' para cumplir con Row-Level Security (RLS).
 */
