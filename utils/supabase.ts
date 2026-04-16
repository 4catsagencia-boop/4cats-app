import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (process.env.NODE_ENV === 'development' && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn('Supabase URL or Anon Key is missing. Check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export enum Tables {
  Planes = 'planes',
  Clientes = 'clientes',
  Cotizaciones = 'cotizaciones',
  Pagos = 'pagos',
  Metas = 'metas',
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

export interface Cliente {
  id: string
  nombre: string
  email: string
  telefono?: string
  sitio_web?: string
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
  plan_nombre: string
  notas?: string
  estado: "pendiente" | "aprobada" | "rechazada"
  items?: CotizacionItem[]
  subtotal: number
  impuesto: number
  total: number
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
