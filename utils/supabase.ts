import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (process.env.NODE_ENV === 'development' && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn('Supabase URL or Anon Key is missing. Check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
}

export type Moneda = 'CLP' | 'BRL' | 'USD'
export type MetodoPago = 'transferencia' | 'tarjeta_credito' | 'efectivo' | 'otros'

export interface AccesosPropuesta {
  id: string
  propuesta_id: string
  ip: string
  user_agent: string
  creado_at?: string
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

export interface Plan {
  id: string
  nombre: string
  precio: number
  publicado: boolean
  destacado: boolean
  descripcion?: string
  caracteristicas?: string[]
  created_at?: string
}

export interface PlanMantenimiento {
  id: string
  nombre: string
  precio: number
  publicado: boolean
  destacado: boolean
  caracteristicas: string[]
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

export interface CotizacionItem {
  descripcion: string
  precio: number
}

export interface Cotizacion {
  id: string
  cliente_id?: string
  cliente_nombre: string
  cliente_email: string
  cliente_telefono?: string
  cliente_rut?: string
  cliente_razon_social?: string
  plan_nombre: string
  notas?: string
  estado: "pendiente" | "aprobada" | "rechazada"
  items?: CotizacionItem[]
  subtotal: number
  impuesto: number
  total: number
  moneda?: Moneda
  created_at?: string
}

export interface Servicio {
  id: string
  nombre: string
  tipo: 'web_dev' | 'mantenimiento' | 'asesoria' | 'otros'
  capacidad_mensual: number
  cupos_ocupados: number
  created_at?: string
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

/**
 * PLANES
 */

export const fetchPlanes = async (): Promise<Plan[]> => {
  const { data, error } = await supabase
    .from(Tables.Planes)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Plan[]) || []
}

export const fetchPlanesPublicados = async (): Promise<Plan[]> => {
  const { data, error } = await supabase
    .from(Tables.Planes)
    .select('*')
    .eq('publicado', true)
    .order('precio', { ascending: true })

  if (error) throw error
  return (data as Plan[]) || []
}

export const insertPlan = async (planData: Partial<Plan>): Promise<Plan[]> => {
  const { data, error } = await supabase
    .from(Tables.Planes)
    .insert([planData])
    .select()

  if (error) throw error
  return (data as Plan[]) || []
}

export const updatePlan = async (id: string, planData: Partial<Plan>): Promise<Plan[]> => {
  const { data, error } = await supabase
    .from(Tables.Planes)
    .update(planData)
    .eq('id', id)
    .select()

  if (error) throw error
  return (data as Plan[]) || []
}

export const deletePlan = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from(Tables.Planes)
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * PLANES MANTENIMIENTO
 */

export const fetchPlanesMantenimiento = async (): Promise<PlanMantenimiento[]> => {
  const { data, error } = await supabase
    .from(Tables.PlanesMantenimiento)
    .select('*')
    .order('precio', { ascending: true })

  if (error) throw error
  return (data as PlanMantenimiento[]) || []
}

export const fetchPlanesMantenimientoPublicados = async (): Promise<PlanMantenimiento[]> => {
  const { data, error } = await supabase
    .from(Tables.PlanesMantenimiento)
    .select('*')
    .eq('publicado', true)
    .order('precio', { ascending: true })

  if (error) throw error
  return (data as PlanMantenimiento[]) || []
}

export const insertPlanMantenimiento = async (planData: Partial<PlanMantenimiento>): Promise<PlanMantenimiento[]> => {
  const { data, error } = await supabase
    .from(Tables.PlanesMantenimiento)
    .insert([planData])
    .select()

  if (error) throw error
  return (data as PlanMantenimiento[]) || []
}

export const updatePlanMantenimiento = async (id: string, planData: Partial<PlanMantenimiento>): Promise<PlanMantenimiento[]> => {
  const { data, error } = await supabase
    .from(Tables.PlanesMantenimiento)
    .update(planData)
    .eq('id', id)
    .select()

  if (error) throw error
  return (data as PlanMantenimiento[]) || []
}

export const deletePlanMantenimiento = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from(Tables.PlanesMantenimiento)
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * CLIENTES
 */

export const fetchClientes = async (): Promise<Cliente[]> => {
  const { data, error } = await supabase
    .from(Tables.Clientes)
    .select('*')
    .order('nombre', { ascending: true })

  if (error) throw error
  return (data as Cliente[]) || []
}

export const insertCliente = async (clienteData: Partial<Cliente>): Promise<Cliente[]> => {
  const { data, error } = await supabase
    .from(Tables.Clientes)
    .insert([clienteData])
    .select()

  if (error) throw error
  return (data as Cliente[]) || []
}

export const deleteCliente = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from(Tables.Clientes)
    .delete()
    .eq('id', id)

  if (error) throw error
}

export const findClienteByEmail = async (email: string): Promise<Cliente | null> => {
  const { data, error } = await supabase
    .from(Tables.Clientes)
    .select('*')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') throw error // Ignoramos si no hay resultados (PostgREST single no rows)
  return data as Cliente | null
}

/**
 * COTIZACIONES
 */

export const fetchCotizaciones = async (): Promise<Cotizacion[]> => {
  const { data, error } = await supabase
    .from(Tables.Cotizaciones)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Cotizacion[]) || []
}

export const insertCotizacion = async (cotizacionData: Partial<Cotizacion>): Promise<Cotizacion[]> => {
  const { data, error } = await supabase
    .from(Tables.Cotizaciones)
    .insert([cotizacionData])
    .select()

  if (error) throw error
  return (data as Cotizacion[]) || []
}

export const updateCotizacionStatus = async (id: string, estado: Cotizacion["estado"]): Promise<Cotizacion[]> => {
  const { data, error } = await supabase
    .from(Tables.Cotizaciones)
    .update({ estado })
    .eq('id', id)
    .select()

  if (error) throw error
  return (data as Cotizacion[]) || []
}

/**
 * CLIENTES — update
 */

export const updateCliente = async (id: string, clienteData: Partial<Cliente>): Promise<Cliente[]> => {
  const { data, error } = await supabase
    .from(Tables.Clientes)
    .update(clienteData)
    .eq('id', id)
    .select()

  if (error) throw error
  return (data as Cliente[]) || []
}

/**
 * PAGOS
 */

export interface Pago {
  id: string
  cotizacion_id: string
  monto: number
  fecha: string
  descripcion?: string
  created_at?: string
}

export const fetchPagos = async (): Promise<Pago[]> => {
  const { data, error } = await supabase
    .from(Tables.Pagos)
    .select('*')
    .order('fecha', { ascending: false })

  if (error) throw error
  return (data as Pago[]) || []
}

export const insertPago = async (pagoData: Partial<Pago>): Promise<Pago[]> => {
  const { data, error } = await supabase
    .from(Tables.Pagos)
    .insert([pagoData])
    .select()

  if (error) throw error
  return (data as Pago[]) || []
}

export const deletePago = async (id: string): Promise<void> => {
  const { error } = await supabase.from(Tables.Pagos).delete().eq('id', id)
  if (error) throw error
}

/**
 * METAS
 */

export interface Meta {
  id: string
  mes: number
  anio: number
  monto: number
  created_at?: string
}

export const fetchMeta = async (mes: number, anio: number): Promise<Meta | null> => {
  const { data, error } = await supabase
    .from(Tables.Metas)
    .select('*')
    .eq('mes', mes)
    .eq('anio', anio)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as Meta | null
}

export const upsertMeta = async (mes: number, anio: number, monto: number): Promise<void> => {
  const { error } = await supabase
    .from(Tables.Metas)
    .upsert({ mes, anio, monto }, { onConflict: 'mes,anio' })

  if (error) throw error
}

/**
 * SERVICIOS (CAPACITY)
 */

export const fetchServicios = async (): Promise<Servicio[]> => {
  const { data, error } = await supabase
    .from(Tables.Servicios)
    .select('*')
    .order('nombre', { ascending: true })

  if (error && error.code !== 'PGRST116') throw error
  return (data as Servicio[]) || []
}

/**
 * FACTURAS & HITOS
 */

export const fetchFacturas = async (): Promise<Factura[]> => {
  const { data, error } = await supabase
    .from(Tables.Facturas)
    .select('*')
    .order('created_at', { ascending: false })

  if (error && error.code !== 'PGRST116') throw error
  return (data as Factura[]) || []
}

export const fetchHitosPago = async (facturaId?: string): Promise<HitoPago[]> => {
  let query = supabase.from(Tables.HitosPago).select('*')
  if (facturaId) query = query.eq('factura_id', facturaId)
  
  const { data, error } = await query.order('created_at', { ascending: true })

  if (error && error.code !== 'PGRST116') throw error
  return (data as HitoPago[]) || []
}

export const updateHitoStatus = async (id: string, estado: HitoPago['estado'], fecha_pago?: string, metodo_pago?: MetodoPago): Promise<void> => {
  const { error } = await supabase
    .from(Tables.HitosPago)
    .update({ estado, fecha_pago, metodo_pago })
    .eq('id', id)

  if (error) throw error
}

/**
 * COLABORADORES & COMISIONES
 */

export const fetchColaboradores = async (): Promise<Colaborador[]> => {
  const { data, error } = await supabase
    .from(Tables.Colaboradores)
    .select('*')
    .eq('activo', true)

  if (error && error.code !== 'PGRST116') throw error
  return (data as Colaborador[]) || []
}

export const insertColaborador = async (colaborador: Omit<Colaborador, 'id' | 'created_at'>): Promise<Colaborador> => {
  const { data, error } = await supabase
    .from(Tables.Colaboradores)
    .insert([colaborador])
    .select()
    .single()

  if (error) throw error
  return data as Colaborador
}

export const fetchComisiones = async (colaboradorId?: string): Promise<Comision[]> => {
  let query = supabase.from('comisiones').select('*')
  if (colaboradorId) query = query.eq('colaborador_id', colaboradorId)

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error && error.code !== 'PGRST116') throw error
  return (data as Comision[]) || []
}

export interface Gasto {
  id: string
  descripcion: string
  monto: number
  moneda: Moneda
  categoria: 'ia' | 'nube' | 'hosting' | 'infraestructura' | 'marketing' | 'otros'
  tipo: 'fijo' | 'variable'
  fecha: string
  estado: 'pendiente' | 'pagado'
  created_at?: string
}

/**
 * GASTOS
 */

export const fetchGastos = async (): Promise<Gasto[]> => {
  const { data, error } = await supabase
    .from('gastos')
    .select('*')
    .order('fecha', { ascending: false })

  if (error && error.code !== 'PGRST116') throw error
  return (data as Gasto[]) || []
}

export const insertGasto = async (gastoData: Partial<Gasto>): Promise<Gasto[]> => {
  const { data, error } = await supabase
    .from('gastos')
    .insert([gastoData])
    .select()

  if (error) throw error
  return (data as Gasto[]) || []
}


/**
 * PROPUESTAS
 */

export const METRICAS_ROI_TEMPLATE: MetricaBenchmark[] = [
  { nombre: "PageSpeed Mobile",   actual: 0, competidor: 0, propuesta: 0, unidad: "/100" },
  { nombre: "CTR (Click-to-Call)", actual: 0, competidor: 0, propuesta: 0, unidad: "%" },
  { nombre: "Tasa Conversión",     actual: 0, competidor: 0, propuesta: 0, unidad: "%" },
  { nombre: "Ranking Keywords",    actual: 0, competidor: 0, propuesta: 0, unidad: "pos" },
  { nombre: "Uptime (24/7)",       actual: 0, competidor: 0, propuesta: 0, unidad: "%" },
  { nombre: "Accesibilidad (A11y)", actual: 0, competidor: 0, propuesta: 0, unidad: "/100" },
  { nombre: "Security Score",      actual: 0, competidor: 0, propuesta: 0, unidad: "/100" },
  { nombre: "Tiempo Tarea Crítica", actual: 0, competidor: 0, propuesta: 0, unidad: "s" },
  { nombre: "Costo por Lead",      actual: 0, competidor: 0, propuesta: 0, unidad: "CLP" },
];

export const METRIC_HIGHER_IS_BETTER: Record<string, boolean> = {
  'PageSpeed Mobile':    true,
  'PageSpeed Desktop':   true,
  'CTR (Click-to-Call)': true,
  'Tasa Conversión':     true,
  'Engagement Rate':     true,
  'Scroll Depth':        true,
  'Ranking Keywords':    false,
  'Visibilidad Maps':    true,
  'Autoridad Dominio':   true,
  'Uptime (24/7)':       true,
  'Accesibilidad (A11y)': true,
  'Security Score':      true,
  'Tiempo Tarea Crítica': false,
  'Costo por Lead':      false,
  'FCP (mobile)':        false,
  'LCP (mobile)':        false,
  'TBT (mobile)':        false,
  'CLS (mobile)':        false,
  'Speed Index (mobile)':false,
};

export const fetchPropuestas = async (): Promise<Propuesta[]> => {
  const { data, error } = await supabase
    .from(Tables.Propuestas)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Propuesta[]) || []
}

export const fetchPropuestasByCliente = async (clienteId: string): Promise<Propuesta[]> => {
  const { data, error } = await supabase
    .from(Tables.Propuestas)
    .select('*')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Propuesta[]) || []
}

export const fetchPropuestaBySlug = async (slug: string): Promise<Propuesta | null> => {
  const { data, error } = await supabase
    .from(Tables.Propuestas)
    .select('*')
    .eq('slug', slug)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as Propuesta | null
}

export const insertPropuesta = async (propuestaData: Partial<Propuesta>): Promise<Propuesta> => {
  const { data, error } = await supabase
    .from(Tables.Propuestas)
    .insert([propuestaData])
    .select()
    .single()

  if (error) throw error
  return data as Propuesta
}

export const updatePropuesta = async (id: string, propuestaData: Partial<Propuesta>): Promise<Propuesta> => {
  const { data, error } = await supabase
    .from(Tables.Propuestas)
    .update(propuestaData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Propuesta
}

export const deletePropuesta = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from(Tables.Propuestas)
    .delete()
    .eq('id', id)

  if (error) throw error
}

export const incrementVistas = async (id: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_vistas', { propuesta_id: id })
  if (error) console.error('Error incrementing vistas:', error)
}

