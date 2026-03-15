"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../../utils/supabase";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface FormState {
  nombre: string;
  descripcion: string;
  precio: string;
  caracteristicas: string; // una por línea → se guarda como string[]
}

type Status = "idle" | "loading" | "success" | "error";

const EMPTY: FormState = {
  nombre: "",
  descripcion: "",
  precio: "",
  caracteristicas: "",
};

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function AdminPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [apiError, setApiError] = useState<string | null>(null);

  /* ---- validation ---- */
  function validate(): Partial<FormState> {
    const e: Partial<FormState> = {};
    if (!form.nombre.trim()) e.nombre = "Requerido.";
    if (!form.descripcion.trim()) e.descripcion = "Requerido.";
    if (!form.precio.trim()) {
      e.precio = "Requerido.";
    } else if (isNaN(Number(form.precio)) || Number(form.precio) < 0) {
      e.precio = "Debe ser un número válido.";
    }
    if (!form.caracteristicas.trim()) e.caracteristicas = "Agrega al menos una.";
    return e;
  }

  /* ---- handlers ---- */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name as keyof FormState]) {
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

    setStatus("loading");
    setApiError(null);

    // Convertir características: una por línea → array limpio
    const caracteristicasArr = form.caracteristicas
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const { error } = await supabase.from("catalogo").insert([
      {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio),
        caracteristicas: caracteristicasArr,
      },
    ]);

    if (error) {
      setApiError(error.message);
      setStatus("error");
      return;
    }

    setStatus("success");
    setForm(EMPTY);
  }

  function handleReset() {
    setForm(EMPTY);
    setErrors({});
    setStatus("idle");
    setApiError(null);
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-14 pb-24 grid md:grid-cols-[220px_1fr] gap-12">

        {/* ---- Sidebar ---- */}
        <aside className="pt-1">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#bbb] mb-5">
            Panel
          </p>
          <nav className="flex flex-col gap-0.5">
            {[
              { label: "Catálogo", active: true },
              { label: "Pedidos", active: false },
              { label: "Clientes", active: false },
              { label: "Configuración", active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={`text-left text-sm px-3 py-2 rounded-md transition-colors w-full ${
                  item.active
                    ? "bg-[#f3f3f3] text-[#111] font-medium"
                    : "text-[#888] hover:text-[#111] hover:bg-[#f7f7f7]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ---- Main area ---- */}
        <main className="min-w-0">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#e5e5e5]">
            <div>
              <h1 className="text-xl font-semibold text-[#111] tracking-tight">
                Nuevo producto
              </h1>
              <p className="text-sm text-[#888] mt-0.5">
                Los datos se insertan directamente en la tabla{" "}
                <code className="text-[#555] font-mono text-xs bg-[#f3f3f3] px-1.5 py-0.5 rounded">
                  catalogo
                </code>
              </p>
            </div>
          </div>

          {/* Success banner */}
          {status === "success" && (
            <div className="flex items-center justify-between gap-4 border border-[#e5e5e5] rounded-lg px-4 py-3 mb-6 bg-[#fafafa]">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-[#222]">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M1.5 5L4 7.5L8.5 2.5"
                      stroke="#111"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p className="text-sm text-[#111]">
                  Producto agregado al catálogo correctamente.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-[#555] border border-[#e5e5e5] px-2.5 py-1 rounded hover:bg-[#f0f0f0] transition-colors shrink-0"
              >
                Agregar otro
              </button>
            </div>
          )}

          {/* Error banner */}
          {status === "error" && apiError && (
            <div className="border border-red-200 bg-red-50 rounded-lg px-4 py-3 mb-6">
              <p className="text-sm text-red-600">
                <span className="font-medium">Error de Supabase:</span> {apiError}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="max-w-xl flex flex-col gap-6">

            {/* Nombre */}
            <Field label="Nombre del producto" error={errors.nombre} required>
              <input
                name="nombre"
                type="text"
                placeholder="ej. Croquetas Premium Adulto"
                value={form.nombre}
                onChange={handleChange}
                disabled={status === "loading"}
                className={input(!!errors.nombre)}
              />
            </Field>

            {/* Descripción */}
            <Field label="Descripción" error={errors.descripcion} required>
              <textarea
                name="descripcion"
                rows={3}
                placeholder="Breve descripción del producto…"
                value={form.descripcion}
                onChange={handleChange}
                disabled={status === "loading"}
                className={`${input(!!errors.descripcion)} resize-none`}
              />
            </Field>

            {/* Precio */}
            <Field label="Precio (MXN)" error={errors.precio} required>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#bbb] select-none pointer-events-none">
                  $
                </span>
                <input
                  name="precio"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.precio}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  className={`${input(!!errors.precio)} pl-7`}
                />
              </div>
            </Field>

            {/* Características */}
            <Field
              label="Características"
              hint="Una característica por línea"
              error={errors.caracteristicas}
              required
            >
              <textarea
                name="caracteristicas"
                rows={5}
                placeholder={`Sin conservadores\nAlto en proteína\nGrano pequeño`}
                value={form.caracteristicas}
                onChange={handleChange}
                disabled={status === "loading"}
                className={`${input(!!errors.caracteristicas)} resize-none font-mono text-xs leading-relaxed`}
              />
              {/* Preview pills */}
              {form.caracteristicas.trim() && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.caracteristicas
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean)
                    .map((tag, i) => (
                      <span
                        key={i}
                        className="inline-block text-[11px] bg-[#f3f3f3] text-[#555] border border-[#e5e5e5] rounded-full px-2.5 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              )}
            </Field>

            {/* Divider */}
            <div className="border-t border-[#e5e5e5]" />

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center gap-2 bg-[#111] text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status === "loading" ? (
                  <>
                    <Spinner />
                    Guardando…
                  </>
                ) : (
                  "Guardar en catálogo"
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={status === "loading"}
                className="text-sm text-[#888] hover:text-[#111] transition-colors disabled:opacity-40"
              >
                Limpiar
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                      */
/* ------------------------------------------------------------------ */

function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-medium text-[#444] tracking-wide">
          {label}
          {required && <span className="text-[#bbb] ml-0.5">*</span>}
        </label>
        {hint && !error && (
          <span className="text-[10px] text-[#bbb]">{hint}</span>
        )}
        {error && <span className="text-[10px] text-red-500">{error}</span>}
      </div>
      {children}
    </div>
  );
}

function input(hasError: boolean) {
  return [
    "w-full text-sm px-3.5 py-2.5 rounded-md border bg-white text-[#111]",
    "placeholder:text-[#ccc] outline-none",
    "focus:ring-1 transition-colors",
    hasError
      ? "border-red-300 focus:ring-red-300 focus:border-red-300"
      : "border-[#e5e5e5] focus:ring-[#111] focus:border-[#111]",
    "disabled:bg-[#fafafa] disabled:text-[#aaa]",
  ].join(" ");
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <circle
        cx="7"
        cy="7"
        r="5.5"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
      <path
        d="M7 1.5A5.5 5.5 0 0112.5 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
