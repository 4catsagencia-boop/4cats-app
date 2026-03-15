"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { fetchPlanesPublicados, supabase, insertCotizacion } from "@/utils/supabase";

function CotizarForm() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") ?? "";

  const [planes, setPlanes] = useState<any[]>([]);
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
    if (!form.nombre.trim()) errs.nombre = "El nombre es requerido.";
    if (!form.email.trim()) {
      errs.email = "El email es requerido.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Ingresa un email válido.";
    }
    if (!form.telefono.trim()) {
      errs.telefono = "El teléfono es requerido.";
    }
    if (!form.plan) errs.plan = "Selecciona un plan.";
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
      // 1. Buscar o Crear Cliente
      let clienteId = null;
      const { data: existingClient } = await supabase
        .from("clientes")
        .select("id")
        .eq("email", form.email.trim())
        .single();

      if (existingClient) {
        clienteId = existingClient.id;
      } else {
        const { data: newClient, error: clientError } = await supabase
          .from("clientes")
          .insert([{
            nombre: form.nombre.trim(),
            email: form.email.trim(),
            telefono: form.telefono.trim()
          }])
          .select()
          .single();
        
        if (clientError) throw clientError;
        clienteId = newClient.id;
      }

      // 2. Guardar Cotización
      const selectedPlan = planes.find(p => p.nombre === form.plan);
      const subtotal = selectedPlan?.precio || 0;
      const impuesto = subtotal * 0.19;
      const total = subtotal + impuesto;

      const { error: quoteError } = await supabase
        .from("cotizaciones")
        .insert([{
          cliente_id: clienteId,
          cliente_nombre: form.nombre.trim(),
          cliente_email: form.email.trim(),
          cliente_telefono: form.telefono.trim(),
          plan_nombre: form.plan,
          items: selectedPlan ? [{ descripcion: selectedPlan.nombre, precio: selectedPlan.precio }] : [],
          subtotal,
          impuesto,
          total,
          notas: form.mensaje,
          estado: "pendiente"
        }]);

      if (quoteError) throw quoteError;

      setSubmitted(true);
    } catch (error) {
      console.error("Error saving quote:", error);
      alert("Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-md mx-auto px-6 pt-32 pb-20 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#e5e5e5] mb-6">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10L8 14L16 6"
                stroke="#111"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[#111] mb-2">
            Cotización enviada
          </h2>
          <p className="text-sm text-[#666] mb-8 leading-relaxed">
            Recibimos tu solicitud para el plan{" "}
            <span className="font-medium text-[#111]">{form.plan}</span>.
            Nos pondremos en contacto contigo a la brevedad.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/planes"
              className="text-sm text-[#555] border border-[#e5e5e5] px-4 py-2 rounded-md hover:bg-[#f5f5f5] transition-colors"
            >
              Ver planes
            </Link>
            <button
              onClick={() => {
                setForm({ nombre: "", email: "", telefono: "", plan: "", mensaje: "" });
                setSubmitted(false);
              }}
              className="text-sm bg-[#111] text-white px-4 py-2 rounded-md hover:bg-[#333] transition-colors"
            >
              Nueva cotización
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-[1fr_420px] gap-16">
        {/* Left: info */}
        <div className="pt-2">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#888] mb-4">
            Cotización
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#111] mb-4 leading-snug">
            Cuéntanos sobre <br className="hidden md:block" />
            tu proyecto
          </h1>
          <p className="text-sm text-[#666] leading-relaxed max-w-sm mb-10">
            Completa el formulario y un consultor se comunicará contigo en
            menos de 24 horas con una propuesta a medida.
          </p>

          <div className="flex flex-col gap-5">
            {[
              {
                icon: (
                  <path
                    d="M2 6l8 5 8-5M2 6v10a1 1 0 001 1h14a1 1 0 001-1V6M2 6a1 1 0 011-1h14a1 1 0 011 1"
                    stroke="currentColor"
                    strokeWidth="1.2"
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
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ),
                label: "+56 9 3481 9569",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md border border-[#e5e5e5] flex items-center justify-center shrink-0">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-[#555]"
                  >
                    {item.icon}
                  </svg>
                </div>
                <span className="text-sm text-[#555]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="border border-[#e5e5e5] rounded-xl p-8">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Nombre */}
            <Field
              label="Nombre completo"
              error={errors.nombre}
            >
              <input
                name="nombre"
                type="text"
                placeholder="Juan Pérez"
                value={form.nombre}
                onChange={handleChange}
                disabled={loading}
                className={inputClass(!!errors.nombre)}
              />
            </Field>

            {/* Email */}
            <Field label="Correo electrónico" error={errors.email}>
              <input
                name="email"
                type="email"
                placeholder="juan@empresa.cl"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                className={inputClass(!!errors.email)}
              />
            </Field>

            {/* Teléfono */}
            <Field label="Teléfono" error={errors.telefono}>
              <input
                name="telefono"
                type="tel"
                placeholder="+56 9 0000 0000"
                value={form.telefono}
                onChange={handleChange}
                disabled={loading}
                className={inputClass(!!errors.telefono)}
              />
            </Field>

            {/* Plan */}
            <Field label="Plan de interés" error={errors.plan}>
              <select
                name="plan"
                value={form.plan}
                onChange={handleChange}
                disabled={loading}
                className={inputClass(!!errors.plan)}
              >
                <option value="">Selecciona un plan</option>
                {planes.map((p) => (
                  <option key={p.id} value={p.nombre}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </Field>

            {/* Mensaje */}
            <Field label="Mensaje (opcional)">
              <textarea
                name="mensaje"
                rows={3}
                placeholder="Cuéntanos brevemente tu proyecto o necesidad…"
                value={form.mensaje}
                onChange={handleChange}
                disabled={loading}
                className={`${inputClass(false)} resize-none`}
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full bg-[#111] text-white text-sm font-medium py-2.5 rounded-md hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar solicitud"}
            </button>

            <p className="text-xs text-center text-[#aaa]">
              Tu información no será compartida con terceros.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full text-sm px-3.5 py-2.5 rounded-md border bg-white text-[#111]",
    "placeholder:text-[#bbb] outline-none",
    "focus:ring-1 focus:ring-[#111] focus:border-[#111]",
    "transition-colors",
    hasError
      ? "border-red-400 focus:ring-red-400 focus:border-red-400"
      : "border-[#e5e5e5]",
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
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#444] tracking-wide">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
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
