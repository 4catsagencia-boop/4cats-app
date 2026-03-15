'use server'

import { supabase } from '@/utils/supabase' // Use the previously created client
import { revalidatePath } from 'next/cache'

/**
 * Server Action to insert a new plan into the 'catalogo' table.
 * @param {Object} formData - The data for the new plan.
 */
export async function createPlan(formData) {
  // Destructure the data from the form
  const nombre = formData.get('nombre')
  const descripcion = formData.get('descripcion')
  const precio = parseFloat(formData.get('precio'))
  const caracteristicas = formData.get('caracteristicas') // Could be an array or JSON string

  // Basic validation
  if (!nombre || !descripcion || isNaN(precio)) {
    return { success: false, error: 'Missing or invalid required fields.' }
  }

  try {
    const { data, error } = await supabase
      .from('catalogo')
      .insert([
        {
          nombre,
          descripcion,
          precio,
          caracteristicas: caracteristicas ? JSON.parse(caracteristicas) : []
        }
      ])
      .select()

    if (error) {
      console.error('Database Error:', error.message)
      return { success: false, error: `Error saving to database: ${error.message}` }
    }

    // Revalidate the path to refresh the data on the client side
    revalidatePath('/admin')
    
    return { success: true, data }
  } catch (err) {
    console.error('Unexpected Server Error:', err)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
