"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import LaylaCat from "../components/cats/LaylaCat";
import { fetchPlanesPublicados, type Plan } from "@/utils/supabase";
import { useLang } from "../context/LanguageContext";
import { t } from "../translations";
import { FadeUp } from "../components/FadeUp";

function inputClass(hasError: boolean) {
  return [
    "w-full text-sm px-4 py-3 rounded-xl border bg-white/[0.06] text-white",
    "placeholder:text-white/25 outline-none",
    "focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF]",
    "transition-all",
    hasError
      ? "border-red-500/60 focus:ring-red-500 focus:border-red-500"
      : "border-white/[0.12]",
  ].join(" ")
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 font-medium ml-1">{error}</p>}
    </div>
  )
}

function CotizarForm() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") ?? "";
  const { lang } = useLang();
  const tr = t[lang].cotizar;
  const es = lang === "es"

  const [planes, setPlanes] = useState<Plan[]>([]);
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", plan: "", mensaje: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  useEffect(() => {
    fetchPlanesPublicados().then(data => {
      setPlanes(data || []);
      if (data?.some(p => p.nombre === planParam)) {
        setForm(f => ({ ...f, plan: planParam }));
      }
    })
  }, [planParam])

  function validate() {
    const errs: Partial<typeof form> = {};
    if (!form.nombre.trim()) errs.nombre = tr.errNombre;
    if (!form.email.trim()) {
      errs.email = tr.errEmailReq;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = tr.errEmailInvalid;
    }
    if (!form.telefono.trim()) errs.telefono = tr.errTelefono;
    if (!form.plan) errs.plan = tr.errPlan;
    return errs;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(er => ({ ...er, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const selectedPlan = planes.find(p => p.nombre === form.plan);
      const subtotal = selectedPlan?.precio || 0;
      const impuesto = subtotal * 0.19;
      const total = subtotal + impuesto;

      const res = await fetch("/api/cotizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: selectedPlan ? [{ descripcion: selectedPlan.nombre, precio: selectedPlan.precio }] : [],
          subtotal, impuesto, total
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar la solicitud");
      setSubmitted(true);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#06030F] overflow-x-hidden">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <FadeUp>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#7C5CBF]/20 border border-[#7C5CBF]/30 mb-8">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <path d="M4 10L8 14L16 6" stroke="#7C5CBF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white mb-3">{tr.successTitle}</h2>
            <p className="text-white/40 mb-10 leading-relaxed max-w-sm">
              {tr.successDesc} <span className="font-bold text-[#C4B5FD]">{form.plan}</span>. {tr.successDesc2}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/planes" className="px-6 py-3 text-sm font-bold text-white/60 border border-white/10 rounded-xl hover:bg-white/[0.06] transition-all">
                {tr.successBack}
              </Link>
              <button
                onClick={() => { setForm({ nombre: "", email: "", telefono: "", plan: "", mensaje: "" }); setSubmitted(false); }}
                className="px-6 py-3 text-sm font-bold bg-[#7C5CBF] text-white rounded-xl hover:bg-[#6B4DAE] transition-all"
                style={{ boxShadow: "0 4px 20px -4px rgba(124,92,191,0.6)" }}
              >
                {tr.successNew}
              </button>
            </div>
          </FadeUp>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#06030F] overflow-x-hidden">
      <Navbar />

      {/* Atmospheric blobs */}
      <div className="fixed top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[200px] opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(ellipse, #9370db, transparent)" }} />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[160px] opacity-[0.06] pointer-events-none" style={{ background: "radial-gradient(ellipse, #D4788A, transparent)" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24 grid md:grid-cols-[1fr_440px] gap-16 items-start">

        {/* Left: intro */}
        <div className="pt-4">
          <FadeUp>
            <div className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#C4B5FD] bg-white/[0.07] px-5 py-2.5 rounded-full border border-white/[0.12] mb-10">
              {tr.badge}
            </div>
          </FadeUp>

          <FadeUp delay={80}>
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 blur-[50px] scale-[1.5] opacity-30 pointer-events-none rounded-full" style={{ background: "radial-gradient(circle, #9370db40, transparent)" }} />
              <LaylaCat className="w-[140px] h-[168px] relative z-10" />
            </div>
          </FadeUp>

          <FadeUp delay={160}>
            <p className="flex items-center gap-3 text-[#9370db] font-bold tracking-[0.2em] uppercase text-xs mb-5">
              <span className="w-10 h-px bg-[#9370db]/40" />
              {es ? "Layla te recibe" : "Layla receives you"}
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[0.95] mb-5">
              {tr.h1.split("\n").map((line, i) => (
                <span key={i}>
                  {i === 1 ? (
                    <span className="bg-gradient-to-r from-[#9370db] to-[#C4B5FD] bg-clip-text text-transparent">{line}</span>
                  ) : line}
                  {i === 0 && <br />}
                </span>
              ))}
            </h1>
            <p className="text-white/40 text-lg leading-relaxed mb-12">{tr.subtitle}</p>
          </FadeUp>

          <FadeUp delay={240}>
            <div className="flex flex-col gap-5">
              {[
                { label: "luis.saez@4cats.cl", icon: "M2 6l8 5 8-5M2 6v10a1 1 0 001 1h14a1 1 0 001-1V6M2 6a1 1 0 011-1h14a1 1 0 011 1" },
                { label: "+56 9 3481 9569", icon: "M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.05 3.16a1 1 0 01-.23 1.02L7.91 9.09a11.05 11.05 0 005 5l1.23-1.14a1 1 0 011.02-.23l3.16 1.05a1 1 0 01.68.95V17a2 2 0 01-2 2C7.16 19 1 12.84 1 5a2 2 0 012-2z" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.10] flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-[#7C5CBF]">
                      <path d={item.icon} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-white/60 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* Right: form */}
        <FadeUp delay={200}>
          <div className="rounded-3xl p-8 border border-white/[0.10]" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              <Field label={tr.labelNombre} error={errors.nombre}>
                <input name="nombre" type="text" placeholder={tr.placeholderNombre} value={form.nombre} onChange={handleChange} disabled={loading} className={inputClass(!!errors.nombre)} />
              </Field>

              <Field label={tr.labelEmail} error={errors.email}>
                <input name="email" type="email" placeholder={tr.placeholderEmail} value={form.email} onChange={handleChange} disabled={loading} className={inputClass(!!errors.email)} />
              </Field>

              <Field label={tr.labelTelefono} error={errors.telefono}>
                <input name="telefono" type="tel" placeholder={tr.placeholderTelefono} value={form.telefono} onChange={handleChange} disabled={loading} className={inputClass(!!errors.telefono)} />
              </Field>

              <Field label={tr.labelPlan} error={errors.plan}>
                <select name="plan" value={form.plan} onChange={handleChange} disabled={loading} className={`${inputClass(!!errors.plan)} [&>option]:bg-[#1A1030] [&>option]:text-white`}>
                  <option value="">{tr.placeholderPlan}</option>
                  {planes.map(p => (
                    <option key={p.id} value={p.nombre}>{p.nombre}</option>
                  ))}
                </select>
              </Field>

              <Field label={tr.labelMensaje}>
                <textarea name="mensaje" rows={3} placeholder={tr.placeholderMensaje} value={form.mensaje} onChange={handleChange} disabled={loading} className={`${inputClass(false)} resize-none`} />
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="btn-squish mt-2 w-full bg-[#7C5CBF] text-white font-bold py-3.5 rounded-xl hover:bg-[#6B4DAE] transition-all disabled:opacity-50"
                style={{ boxShadow: "0 4px 20px -4px rgba(124,92,191,0.6)" }}
              >
                {loading ? tr.sending : tr.submitBtn}
              </button>

              <p className="text-xs text-center text-white/25 font-medium">{tr.privacy}</p>
            </form>
          </div>
        </FadeUp>
      </div>
    </main>
  )
}

export default function CotizarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#06030F]"><Navbar /></div>}>
      <CotizarForm />
    </Suspense>
  )
}
