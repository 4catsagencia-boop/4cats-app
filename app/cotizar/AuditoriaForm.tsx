"use client";

import { useEffect, useRef, useState } from "react";
import { submitAuditoria } from "./actions";
import { getTrackingContext, trackFunnelEvent } from "../components/AnalyticsEvents";

function inputClass(hasError: boolean) {
  return [
    "w-full text-sm px-4 py-3 rounded-xl border bg-black/[0.03] dark:bg-white/[0.06] text-[#18181B] dark:text-white",
    "placeholder:text-[#18181B]/40 dark:placeholder:text-white/30 outline-none",
    "focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF]",
    "transition-all",
    hasError
      ? "border-red-500/60 focus:ring-red-500 focus:border-red-500"
      : "border-black/[0.12] dark:border-white/[0.12]",
  ].join(" ");
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-[#18181B]/60 dark:text-white/40 uppercase tracking-wider ml-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 font-medium ml-1">{error}</p>}
    </div>
  );
}

export default function AuditoriaForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [trackingContext, setTrackingContext] = useState(getTrackingContext);
  const started = useRef(false);

  useEffect(() => {
    setTrackingContext(getTrackingContext());
  }, []);

  function handleStarted() {
    if (started.current) return;
    started.current = true;
    trackFunnelEvent("audit_started");
  }

  async function handleAction(formData: FormData) {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await submitAuditoria(formData);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        trackFunnelEvent("audit_submitted", { objetivo: formData.get("objetivo")?.toString() || "" });
        setSubmitted(true);
      }
    } catch {
      setErrorMsg("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-black/[0.03] dark:bg-white/[0.06] rounded-3xl border border-black/[0.12] dark:border-white/[0.12]">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#7C5CBF]/20 border border-[#7C5CBF]/30 mb-6">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
            <path d="M4 10L8 14L16 6" stroke="#7C5CBF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-[#18181B] dark:text-white mb-3">Solicitud enviada</h3>
        <p className="text-[#18181B]/60 dark:text-white/50 mb-6">
          Pronto analizaremos tu caso y te contactaremos a tu WhatsApp con los próximos pasos.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-[#7C5CBF] font-bold text-sm hover:underline"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-8 border border-black/[0.10] dark:border-white/[0.10]" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}>
      <form action={handleAction} onFocusCapture={handleStarted} className="flex flex-col gap-6">
        {Object.entries(trackingContext).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} readOnly />
        ))}
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}
        
        <Field label="Empresa">
          <input name="empresa" type="text" placeholder="El nombre de tu negocio" disabled={loading} required className={inputClass(false)} />
        </Field>

        <Field label="Web / Instagram">
          <input name="web" type="text" placeholder="Link a tu sitio o red social principal" disabled={loading} className={inputClass(false)} />
        </Field>

        <Field label="WhatsApp">
          <input name="whatsapp" type="tel" placeholder="+56 9 XXXX XXXX" disabled={loading} required className={inputClass(false)} />
        </Field>

        <Field label="¿Qué quieres mejorar?">
          <select name="objetivo" disabled={loading} required className={`${inputClass(false)} [&>option]:bg-[#1A1030] [&>option]:text-[#18181B] dark:text-white`}>
            <option value="">Selecciona tu objetivo principal</option>
            <option value="Conseguir clientes">Conseguir clientes</option>
            <option value="Mejorar mi web">Mejorar mi web</option>
            <option value="Automatizar procesos">Automatizar procesos</option>
            <option value="Crear un sistema">Crear un sistema a medida</option>
          </select>
        </Field>

        <div className="mt-2 text-center">
          <button
            type="submit"
            disabled={loading}
            className="btn-squish w-full bg-[#7C5CBF] text-white font-bold py-4 rounded-xl hover:bg-[#6B4DAE] transition-all disabled:opacity-50 text-base"
            style={{ boxShadow: "0 4px 20px -4px rgba(124,92,191,0.6)" }}
          >
            {loading ? "Procesando..." : "Solicitar auditoría gratuita"}
          </button>
          <p className="text-xs text-[#18181B]/50 dark:text-white/40 font-medium mt-4">
            Revisaremos tu caso y te contactaremos con oportunidades concretas de mejora.
          </p>
        </div>
      </form>
    </div>
  );
}

