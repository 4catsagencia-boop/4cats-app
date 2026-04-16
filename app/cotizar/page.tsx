"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { fetchPlanesPublicados, type Plan } from "@/utils/supabase";
import { useLang } from "../context/LanguageContext";
import { t } from "../translations";

function PeekingCat() {
  const c = "#7C5CBF"
  return (
    <svg width="120" height="82" viewBox="0 0 108 82" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Orejas — sobresalen arriba de la tarjeta */}
      <path d="M24 48 L14 14 L42 40 Z" fill={c} />
      <path d="M84 48 L94 14 L66 40 Z" fill={c} />
      {/* Cabeza — se asoma desde abajo, parte baja cortada por la tarjeta */}
      <circle cx="54" cy="76" r="46" fill={c} />
      {/* Ojos grandes y curiosos */}
      <circle cx="38" cy="62" r="9" fill="white" />
      <circle cx="70" cy="62" r="9" fill="white" />
      <circle cx="39" cy="62" r="5.5" fill={c} />
      <circle cx="71" cy="62" r="5.5" fill={c} />
      <circle cx="41" cy="60" r="2" fill="white" />
      <circle cx="73" cy="60" r="2" fill="white" />
      {/* Nariz */}
      <path d="M51 74 L54 78 L57 74" fill="white" opacity="0.7" />
    </svg>
  );
}

function CotizarForm() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") ?? "";
  const { lang } = useLang();
  const tr = t[lang].cotizar;

  const [planes, setPlanes] = useState<Plan[]>([]);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    plan: "",
    mensaje: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  useEffect(() => {
    async function loadPlanes() {
      const data = await fetchPlanesPublicados();
      setPlanes(data || []);
      if (data && data.some(p => p.nombre === planParam)) {
        setForm(f => ({ ...f, plan: planParam }));
      }
    }
    loadPlanes();
  }, [planParam]);

  function validate() {
    const errs: Partial<typeof form> = {};
    if (!form.nombre.trim()) errs.nombre = tr.errNombre;
    if (!form.email.trim()) {
      errs.email = tr.errEmailReq;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = tr.errEmailInvalid;
    }
    if (!form.telefono.trim()) {
      errs.telefono = tr.errTelefono;
    }
    if (!form.plan) errs.plan = tr.errPlan;
    return errs;
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((er) => ({ ...er, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

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
          subtotal,
          impuesto,
          total
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al procesar la solicitud");
      }

      setSubmitted(true);
    } catch (error: any) {
      if (process.env.NODE_ENV === "development") console.error("Error saving quote:", error);
      alert(error.message || "Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-md mx-auto px-6 pt-40 pb-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F3EEFF] border border-[#E5D8FF] mb-8">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10L8 14L16 6"
                stroke="#7C5CBF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#18181B] mb-3">
            {tr.successTitle}
          </h2>
          <p className="text-[#52525B] mb-10 leading-relaxed">
            {tr.successDesc}{" "}
            <span className="font-bold text-[#7C5CBF]">{form.plan}</span>.{" "}
            {tr.successDesc2}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/planes"
              className="px-6 py-2.5 text-sm font-bold text-[#52525B] border border-[#E4E4E7] rounded-xl hover:bg-[#FAFAFA] transition-all"
            >
              {tr.successBack}
            </Link>
            <button
              onClick={() => {
                setForm({ nombre: "", email: "", telefono: "", plan: "", mensaje: "" });
                setSubmitted(false);
              }}
              className="px-6 py-2.5 text-sm font-bold bg-[#7C5CBF] text-white rounded-xl hover:bg-[#6B4DAE] transition-all shadow-lg shadow-[#7C5CBF]/20"
            >
              {tr.successNew}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24 grid md:grid-cols-[1fr_420px] gap-20">
        {/* Left: info */}
        <div className="pt-4">
          <p className="text-xs font-bold tracking-widest uppercase text-[#7C5CBF] mb-4">
            {tr.badge}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-[#18181B] mb-6 leading-tight">
            {tr.h1.split("\n").map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br className="hidden md:block" />}</span>
            ))}
          </h1>
          <p className="text-[#52525B] text-lg leading-relaxed mb-12">
            {tr.subtitle}
          </p>

          <div className="flex flex-col gap-6">
            {[
              {
                icon: (
                  <path
                    d="M2 6l8 5 8-5M2 6v10a1 1 0 001 1h14a1 1 0 001-1V6M2 6a1 1 0 011-1h14a1 1 0 011 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ),
                label: "luis.saez@4cats.cl",
              },
              {
                icon: (
                  <path
                    d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.05 3.16a1 1 0 01-.23 1.02L7.91 9.09a11.05 11.05 0 005 5l1.23-1.14a1 1 0 011.02-.23l3.16 1.05a1 1 0 01.68.95V17a2 2 0 01-2 2C7.16 19 1 12.84 1 5a2 2 0 012-2z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ),
                label: "+56 9 3481 9569",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F3EEFF] border border-[#E5D8FF] flex items-center justify-center shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-[#7C5CBF]"
                  >
                    {item.icon}
                  </svg>
                </div>
                <span className="text-[#18181B] font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="relative pt-[80px]">
          {/* Gatita asomándose desde detrás de la tarjeta */}
          <style>{`
            @keyframes peek-bob {
              0%, 100% { transform: translateX(-50%) translateY(0px); }
              50%       { transform: translateX(-50%) translateY(-7px); }
            }
          `}</style>
          <div
            className="hidden md:block absolute top-0 left-1/2"
            style={{ transform: "translateX(-50%)", animation: "peek-bob 3s ease-in-out infinite", zIndex: 0 }}
          >
            <PeekingCat />
          </div>

          <div className="bg-white border border-[#E4E4E7] rounded-3xl p-8 shadow-xl shadow-[#18181B]/5 relative z-10">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              <Field label={tr.labelNombre} error={errors.nombre}>
                <input
                  name="nombre"
                  type="text"
                  placeholder={tr.placeholderNombre}
                  value={form.nombre}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClass(!!errors.nombre)}
                />
              </Field>

              <Field label={tr.labelEmail} error={errors.email}>
                <input
                  name="email"
                  type="email"
                  placeholder={tr.placeholderEmail}
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClass(!!errors.email)}
                />
              </Field>

              <Field label={tr.labelTelefono} error={errors.telefono}>
                <input
                  name="telefono"
                  type="tel"
                  placeholder={tr.placeholderTelefono}
                  value={form.telefono}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClass(!!errors.telefono)}
                />
              </Field>

              <Field label={tr.labelPlan} error={errors.plan}>
                <select
                  name="plan"
                  value={form.plan}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClass(!!errors.plan)}
                >
                  <option value="">{tr.placeholderPlan}</option>
                  {planes.map((p) => (
                    <option key={p.id} value={p.nombre}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={tr.labelMensaje}>
                <textarea
                  name="mensaje"
                  rows={3}
                  placeholder={tr.placeholderMensaje}
                  value={form.mensaje}
                  onChange={handleChange}
                  disabled={loading}
                  className={`${inputClass(false)} resize-none`}
                />
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-[#7C5CBF] text-white font-bold py-3.5 rounded-xl hover:bg-[#6B4DAE] transition-all disabled:opacity-50 shadow-lg shadow-[#7C5CBF]/20 active:scale-[0.98]"
              >
                {loading ? tr.sending : tr.submitBtn}
              </button>

              <p className="text-xs text-center text-[#A1A1AA] font-medium">
                {tr.privacy}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full text-sm px-4 py-3 rounded-xl border bg-white text-[#18181B]",
    "placeholder:text-[#A1A1AA] outline-none",
    "focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF]",
    "transition-all",
    hasError
      ? "border-red-400 focus:ring-red-400 focus:border-red-400"
      : "border-[#E4E4E7]",
  ].join(" ");
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-[#52525B] uppercase tracking-wider ml-1">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 font-medium ml-1">{error}</p>
      )}
    </div>
  );
}

export default function CotizarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white"><Navbar /></div>}>
      <CotizarForm />
    </Suspense>
  );
}
