import { Tables } from "@/utils/supabase";

export function useAdminDB() {
  const adminRequest = async (action: "SELECT" | "INSERT" | "UPDATE" | "DELETE", table: string, options: { data?: any, id?: string } = {}) => {
    // Obtenemos la contraseña del localStorage (guardada en el login del admin)
    // Nota: en un sistema ideal usaríamos cookies seguras o Supabase Auth, 
    // pero mantenemos la lógica actual del proyecto de forma segura vía API Proxy.
    const password = typeof window !== "undefined" 
      ? (localStorage.getItem("admin_pw") || localStorage.getItem("cats_control_pw")) 
      : null;

    if (!password) {
      throw new Error("No hay sesión administrativa activa.");
    }

    const res = await fetch("/api/admin/db", {
      method: "POST",
      body: JSON.stringify({
        password,
        table,
        action,
        data: options.data,
        id: options.id
      }),
      headers: { "Content-Type": "application/json" }
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Error en la operación");
    
    return result.data;
  };

  return {
    select: (table: string, filter?: { column: string, value: any }) => 
      adminRequest("SELECT", table, { 
        data: filter ? { filterColumn: filter.column, filterValue: filter.value } : undefined 
      }),
    insert: (table: string, data: any) => adminRequest("INSERT", table, { data }),
    update: (table: string, id: string, data: any) => adminRequest("UPDATE", table, { id, data }),
    remove: (table: string, id: string) => adminRequest("DELETE", table, { id }),
  };
}
