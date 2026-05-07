import { notFound } from "next/navigation";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getPropuesta(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/propuestas-tecnicas/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function PropuestaTecnicaPublicPage({ params }: PageProps) {
  const { id } = await params;
  const propuesta = await getPropuesta(id);

  if (!propuesta) notFound();

  const contenido = propuesta.contenido;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans select-none"
      style={{ WebkitUserSelect: "none", userSelect: "none" } as React.CSSProperties}>

      {/* Header */}
      <div className="bg-[#7C5CBF] text-white px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <Image src="/logo-4cats.png" alt="4cats Agency" width={100} height={40} className="object-contain brightness-0 invert" />
          <p className="text-sm font-medium opacity-60 uppercase tracking-widest">Propuesta Técnica</p>
        </div>
        <h1 className="text-3xl font-black mb-2">{propuesta.nombre}</h1>
        {contenido?.destinatario && (
          <p className="text-white/80 text-sm">Para: {contenido.destinatario}</p>
        )}
      </div>

      {/* Watermark */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 opacity-[0.03]"
        style={{ fontSize: "8rem", fontWeight: "bold", color: "#7C5CBF", transform: "rotate(-45deg)", whiteSpace: "nowrap" }}>
        CONFIDENCIAL
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8 relative z-10">
        {contenido?.introduccion && (
          <section className="bg-white rounded-2xl border border-[#E4E4E7] p-6">
            <h2 className="font-bold text-[#18181B] mb-3">Introducción</h2>
            <p className="text-gray-700 leading-relaxed text-sm">{contenido.introduccion}</p>
          </section>
        )}

        {contenido?.objetivos && Array.isArray(contenido.objetivos) && (
          <section className="bg-white rounded-2xl border border-[#E4E4E7] p-6">
            <h2 className="font-bold text-[#18181B] mb-3">Objetivos</h2>
            <ul className="space-y-2">
              {contenido.objetivos.map((obj: string, idx: number) => (
                <li key={idx} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-[#7C5CBF] font-bold flex-shrink-0">•</span>
                  {obj}
                </li>
              ))}
            </ul>
          </section>
        )}

        {contenido?.secciones && (
          <div className="space-y-4">
            {Object.entries(contenido.secciones).map(([key, value]: [string, unknown]) => (
              <section key={key} className="bg-white rounded-2xl border border-[#E4E4E7] p-6">
                <h2 className="font-bold text-[#18181B] mb-3 capitalize">{key.replace(/_/g, " ")}</h2>
                {typeof value === "string" && (
                  <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
                )}
                {typeof value === "object" && !Array.isArray(value) && value !== null && (
                  <div className="space-y-3">
                    {Object.entries(value as Record<string, unknown>).map(([subkey, subvalue]) => (
                      <div key={subkey}>
                        <p className="text-xs font-semibold text-[#7C5CBF] uppercase tracking-wide mb-1">{subkey.replace(/_/g, " ")}</p>
                        {typeof subvalue === "string" && <p className="text-sm text-gray-700">{subvalue}</p>}
                        {Array.isArray(subvalue) && (
                          <ul className="space-y-1 mt-1">
                            {(subvalue as unknown[]).map((item, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex gap-2">
                                <span className="text-[#7C5CBF]">•</span>
                                {typeof item === "string" ? item : JSON.stringify(item)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {Array.isArray(value) && (
                  <ul className="space-y-1">
                    {(value as unknown[]).map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-[#7C5CBF]">•</span>
                        {typeof item === "string" ? item : JSON.stringify(item)}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-[#E4E4E7]">
          <Image src="/logo-4cats.png" alt="4cats Agency" width={60} height={24} className="object-contain opacity-40" />
          <p className="text-xs text-gray-400">Documento confidencial — Prohibida su reproducción</p>
        </div>
      </div>
    </div>
  );
}
