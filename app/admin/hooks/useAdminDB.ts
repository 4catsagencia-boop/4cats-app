import { Tables } from "@/utils/supabase";

export function useAdminDB() {
  const adminRequest = async (action: "SELECT" | "INSERT" | "UPDATE" | "DELETE", table: string, options: { data?: any, id?: string, filterColumn?: string, filterValue?: any } = {}) => {
    let password = null;
    
    if (typeof window !== "undefined") {
      const isCatsControl = window.location.pathname.includes('/cats-control');
      const catsPw = localStorage.getItem("cats_control_pw");
      const adminPw = localStorage.getItem("admin_pw");
      
      // Priorizamos la contraseña según el módulo en el que estamos
      if (isCatsControl) {
        password = catsPw || adminPw;
      } else {
        password = adminPw || catsPw;
      }
    }

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
        id: options.id,
        filterColumn: options.filterColumn,
        filterValue: options.filterValue
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
        filterColumn: filter?.column, 
        filterValue: filter?.value 
      }),
    insert: (table: string, data: any) => adminRequest("INSERT", table, { data }),
    update: (table: string, id: string, data: any) => adminRequest("UPDATE", table, { id, data }),
    remove: (table: string, id: string) => adminRequest("DELETE", table, { id }),
  };
}
