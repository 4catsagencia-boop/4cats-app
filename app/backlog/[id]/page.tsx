import { notFound } from "next/navigation";
import Image from "next/image";
import { Backlog, getServiceSupabase } from "@/utils/supabase";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getBacklog(id: string): Promise<Backlog | null> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("backlogs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  if (data.publico === false) return null;
  return data as Backlog;
}

export default async function BacklogPublicPage({ params }: PageProps) {
  const { id } = await params;
  const backlog = await getBacklog(id);

  if (!backlog) notFound();

  const totalHUs = backlog.epicas.reduce((sum, e) => sum + e.historias.length, 0);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      {/* Header */}
      <div className="bg-[#7C5CBF] text-white px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <Image src="/logo-4cats.png" alt="4cats Agency" width={100} height={40} className="object-contain brightness-0 invert" />
          <p className="text-sm font-medium opacity-60 uppercase tracking-widest">Product Backlog</p>
        </div>
        <h1 className="text-3xl font-black mb-2">{backlog.nombre}</h1>
        <p className="text-white/80 text-sm">Cliente: {backlog.cliente_nombre}</p>
        {backlog.descripcion && (
          <p className="mt-3 text-white/70 text-sm max-w-2xl">{backlog.descripcion}</p>
        )}
        <div className="mt-6 flex gap-6 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {backlog.epicas.length} Épicas
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {totalHUs} Historias de Usuario
          </span>
        </div>
      </div>

      {/* Épicas */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {backlog.epicas.map((epica, idx) => (
          <div key={epica.id} className="bg-white rounded-2xl border border-[#E4E4E7] overflow-hidden shadow-sm">
            <div className="bg-[#F3EEFF] px-6 py-4 flex items-center gap-3">
              <span className="text-[#7C5CBF] font-black text-sm">{epica.codigo}</span>
              <h2 className="font-bold text-[#18181B]">{epica.nombre}</h2>
              <span className="ml-auto text-xs text-[#7C5CBF] font-medium">
                {epica.historias.length} HU
              </span>
            </div>
            {epica.descripcion && (
              <p className="px-6 pt-3 text-sm text-gray-500">{epica.descripcion}</p>
            )}
            <div className="divide-y divide-[#F4F4F5]">
              {epica.historias.map((hu, huIdx) => (
                <div key={hu.id} className="px-6 py-3 flex gap-3">
                  <span className="text-xs text-gray-400 font-mono mt-0.5 flex-shrink-0 w-16">{hu.codigo}</span>
                  <p className="text-sm text-gray-700 leading-relaxed">{hu.descripcion}</p>
                </div>
              ))}
              {epica.historias.length === 0 && (
                <p className="px-6 py-3 text-sm text-gray-400 italic">Sin historias de usuario</p>
              )}
            </div>
          </div>
        ))}

        {backlog.notas && (
          <div className="bg-[#F3EEFF] border border-[#7C5CBF]/20 rounded-2xl p-6">
            <p className="text-sm font-bold text-[#7C5CBF] mb-2">Notas</p>
            <p className="text-sm text-gray-700">{backlog.notas}</p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-8">
          Documento confidencial — 4cats Agency
        </p>
      </div>
    </div>
  );
}
