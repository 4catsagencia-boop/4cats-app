import { fetchPropuestaBySlug } from "@/utils/supabase";
import PropuestaView from "@/app/components/PropuestaView";
import PrintButton from "./PrintButton";
import Tracker from "./Tracker";
import CTAButton from "./CTAButton";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const propuesta = await fetchPropuestaBySlug(slug);

  if (!propuesta) return { title: "Propuesta no encontrada | 4cats" };

  return {
    title: `${propuesta.titulo} | Propuesta Estratégica 4cats`,
    description: propuesta.subtitulo || propuesta.solucion_titulo,
    openGraph: {
      title: propuesta.titulo,
      description: propuesta.subtitulo || propuesta.solucion_titulo,
      type: "website",
    },
  };
}

export default async function PropuestaPublicPage({ params }: PageProps) {
  const { slug } = await params;
  const propuesta = await fetchPropuestaBySlug(slug);

  if (!propuesta) notFound();

  // Verificar expiración
  const ahora = new Date();
  const expiracion = propuesta.expira_at ? new Date(propuesta.expira_at) : null;
  const expirada = expiracion ? ahora > expiracion : false;

  if (expirada) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="text-6xl mb-6">⏳</div>
          <h1 className="text-2xl font-bold dark:text-white">Esta propuesta ha expirado</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Los links y prototipos estratégicos tienen una validez limitada. 
            Por favor, contactá a tu ejecutivo de cuentas en 4cats para renovar el acceso.
          </p>
          <a href="https://wa.me/56934819569" className="inline-block mt-4 text-[#7C5CBF] font-bold hover:underline">
            Contactar Soporte
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          .print-hide { display: none !important; }
          body { background: white !important; }
          @page { margin: 1.5cm; }
        }
      `}</style>

      {/* Tracking de vistas (Client-side trigger) */}
      <Tracker id={propuesta.id} />

      <PrintButton />

      <main className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] py-12">
        <PropuestaView propuesta={propuesta} />
        
        {/* Call to Action Final */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 mt-12 mb-20 text-center space-y-6 print-hide">
          <div className="h-px bg-gradient-to-r from-transparent via-[#E4E4E7] dark:via-[#2A2A35] to-transparent w-full mb-12"></div>
          <h2 className="text-2xl font-bold dark:text-white">¿Todo listo para arrancar?</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Hacé clic abajo para confirmar la propuesta vía WhatsApp y empezamos con la fase de implementación de inmediato.
          </p>
          <CTAButton
            href={`https://wa.me/56934819569?text=${encodeURIComponent(`¡Hola! Acabo de revisar la propuesta "${propuesta.titulo}" y me gustaría confirmar los siguientes pasos.`)}`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Confirmar Propuesta
          </CTAButton>
        </section>
      </main>
    </>
  );
}
