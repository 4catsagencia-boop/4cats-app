import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * PLANES
 */

export const fetchPlanes = async () => {
  const { data, error } = await supabase
    .from('planes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const fetchPlanesPublicados = async () => {
  const { data, error } = await supabase
    .from('planes')
    .select('*')
    .eq('publicado', true)
    .order('precio', { ascending: true })

  if (error) throw error
  return data
}

export const insertPlan = async (planData) => {
  const { data, error } = await supabase
    .from('planes')
    .insert([planData])
    .select()

  if (error) throw error
  return data
}

export const updatePlan = async (id, planData) => {
  const { data, error } = await supabase
    .from('planes')
    .update(planData)
    .eq('id', id)
    .select()

  if (error) throw error
  return data
}

export const deletePlan = async (id) => {
  const { error } = await supabase
    .from('planes')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * CLIENTES
 */

export const fetchClientes = async () => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('nombre', { ascending: true })

  if (error) throw error
  return data
}

export const insertCliente = async (clienteData) => {
  const { data, error } = await supabase
    .from('clientes')
    .insert([clienteData])
    .select()

  if (error) throw error
  return data
}

export const deleteCliente = async (id) => {
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * COTIZACIONES
 */

export const fetchCotizaciones = async () => {
  const { data, error } = await supabase
    .from('cotizaciones')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const insertCotizacion = async (cotizacionData) => {
  const { data, error } = await supabase
    .from('cotizaciones')
    .insert([cotizacionData])
    .select()

  if (error) throw error
  return data
}

export const updateCotizacionStatus = async (id, estado) => {
  const { data, error } = await supabase
    .from('cotizaciones')
    .update({ estado })
    .eq('id', id)
    .select()

  if (error) throw error
  return data
}

/**
 * CATALOGO (Keep existing for backward compatibility or the CatalogoSection)
 */

export const fetchCatalogo = async () => {
  const { data, error } = await supabase
    .from('catalogo')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getActiveCatalogo = async () => {
  const { data, error } = await supabase
    .from('catalogo')
    .select('id, nombre, descripcion, precio, caracteristicas')
    .eq('activo', true)
    .order('precio', { ascending: true })

  if (error) throw error
  return data
}
