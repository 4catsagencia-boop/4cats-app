import "server-only";

import { Tables, type Plan } from "@/utils/supabase";
import { createClient } from "./server";

export async function fetchPlanesPublicados(): Promise<Plan[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(Tables.Planes)
    .select("*")
    .eq("publicado", true)
    .order("precio", { ascending: true });

  if (error) {
    console.error("Error fetching planes:", error);
    return [];
  }

  return (data as Plan[]) || [];
}