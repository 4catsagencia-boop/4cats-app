"use client";

export default function InfografiaPage() {
  return (
    <div className="min-h-screen bg-[#EEF2F7] font-sans">
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <header className="relative overflow-hidden bg-[#0D1B3E] text-white px-10 py-14">
        {/* Grid tech pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-[#7C5CBF] opacity-[0.12] blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#0EA5E9] opacity-[0.08] blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-[#7C5CBF] rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">4c</span>
            </div>
            <span className="text-[#A78BFA] text-xs font-bold tracking-[0.2em] uppercase">
              4cats · Agencia Digital
            </span>
          </div>

          {/* Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-[#60A5FA] text-xs font-bold tracking-widest uppercase mb-3">
                Documento Propuesta
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4">
                Propuesta de Mantenimiento<br />
                <span className="text-[#A78BFA]">y Seguridad Web</span>
              </h1>
              <p className="text-[#94A3B8] text-base max-w-xl leading-relaxed">
                Protege tu inversión digital y asegura la continuidad de tu negocio.
              </p>
            </div>
            {/* Tech badge cluster */}
            <div className="flex flex-wrap gap-2 md:flex-col md:items-end shrink-0">
              {[
                { label: "Seguridad", color: "bg-red-500/20 text-red-300 border-red-500/30" },
                { label: "Rendimiento", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
                { label: "Continuidad", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
                { label: "Soporte", color: "bg-green-500/20 text-green-300 border-green-500/30" },
              ].map((t) => (
                <span
                  key={t.label}
                  className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${t.color}`}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── SECTION 1 ── */}
      <section className="max-w-4xl mx-auto px-8 py-12">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-[#7C5CBF] text-white rounded-xl flex items-center justify-center font-extrabold text-lg shrink-0 shadow-lg shadow-[#7C5CBF]/30">
            1
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#7C5CBF] mb-0.5">
              Contexto
            </p>
            <h2 className="text-xl font-bold text-[#0D1B3E] leading-tight">
              ¿Por qué es necesario un Plan de Mantención?
            </h2>
          </div>
        </div>

        {/* 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {/* Card 1 — Seguridad */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(13,27,62,0.1)] border border-[#E2E8F0] flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <h3 className="font-bold text-[#0D1B3E] text-sm">Vulnerabilidades de Seguridad</h3>
              </div>
              <p className="text-[#475569] text-sm leading-relaxed">
                Los sitios desactualizados son el blanco <strong>#1</strong> de los hackers.
              </p>
            </div>
          </div>

          {/* Card 2 — Incompatibilidades */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(13,27,62,0.1)] border border-[#E2E8F0] flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <h3 className="font-bold text-[#0D1B3E] text-sm">Incompatibilidades</h3>
              </div>
              <p className="text-[#475569] text-sm leading-relaxed">
                Una actualización automática puede "romper" el diseño visual o el carrito de compras.
              </p>
            </div>
          </div>

          {/* Card 3 — Lentitud */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(13,27,62,0.1)] border border-[#E2E8F0] flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                <h3 className="font-bold text-[#0D1B3E] text-sm">Lentitud</h3>
              </div>
              <p className="text-[#475569] text-sm leading-relaxed">
                Sin limpieza de base de datos, la web se vuelve lenta, afectando sus ventas y posicionamiento en Google.
              </p>
            </div>
          </div>
        </div>

        {/* Highlight band */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0EA5E9] via-[#2563EB] to-[#4F46E5] px-8 py-5 flex items-center gap-5 shadow-lg shadow-blue-500/20">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10 shrink-0 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="relative z-10 text-white font-semibold text-base leading-snug">
            "Nuestro servicio no es un gasto, es un{" "}
            <span className="font-extrabold underline decoration-white/60">
              Seguro de Continuidad Operativa
            </span>."
          </p>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-4xl mx-auto px-8">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#CBD5E1] to-transparent" />
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#7C5CBF]" style={{ opacity: 1 - i * 0.3 }} />
            ))}
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#CBD5E1] to-transparent" />
        </div>
      </div>

      {/* ── SECTION 4 ── */}
      <section className="max-w-4xl mx-auto px-8 py-12">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-[#0D1B3E] text-white rounded-xl flex items-center justify-center font-extrabold text-lg shrink-0 shadow-lg shadow-[#0D1B3E]/30">
            4
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#0D1B3E] mb-0.5 opacity-50">
              Garantía
            </p>
            <h2 className="text-xl font-bold text-[#0D1B3E] leading-tight">
              Política de "Seguro de Edición"
            </h2>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_-4px_rgba(13,27,62,0.1)] border border-[#E2E8F0] overflow-hidden">
          {/* Card header strip */}
          <div className="bg-gradient-to-r from-[#0D1B3E] to-[#1E3A5F] px-8 py-4 flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#7C5CBF] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 01.06 12.036A11.955 11.955 0 003.598 18 11.96 11.96 0 0112 21.75c2.676 0 5.147-.83 7.182-2.25A11.959 11.959 0 0023.93 12.036 11.955 11.955 0 0020.402 6 11.96 11.96 0 0012 2.25a11.96 11.96 0 00-7.404 2.589" />
              </svg>
            </div>
            <p className="text-white text-sm font-semibold">Protección incluida en planes Pyme Activa y superiores</p>
          </div>

          {/* Card body */}
          <div className="p-8 flex flex-col md:flex-row gap-8">
            {/* Icon column */}
            <div className="shrink-0 flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-[#F3EEFF] rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-[#7C5CBF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-[#7C5CBF] tracking-widest uppercase text-center">
                Sin costo<br />adicional
              </span>
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="text-[#334155] text-base leading-relaxed mb-6">
                Sabemos que usted quiere autonomía. Con nuestros planes{" "}
                <span className="font-bold text-[#7C5CBF]">Pyme Activa</span> y superiores, si usted o su
                equipo desconfiguran visualmente el sitio al intentar editarlo, nosotros lo reparamos{" "}
                <strong className="text-[#0D1B3E]">sin costo adicional</strong> utilizando su bolsa de horas.
                Sin el plan, estas reparaciones tienen costo de emergencia.
              </p>

              {/* Comparison pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-xs text-green-800 leading-snug">
                    <strong>Con plan activo:</strong> reparación incluida en bolsa de horas.
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-xs text-red-800 leading-snug">
                    <strong>Sin plan:</strong> reparación con costo de emergencia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="max-w-4xl mx-auto px-8 pb-10">
        <div className="bg-[#0D1B3E] rounded-2xl px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#7C5CBF] rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">4c</span>
            </div>
            <span className="text-[#94A3B8] text-xs font-medium">4cats · Agencia Digital</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
            <span className="text-[#475569] text-xs">luis.saez@4cats.cl</span>
            <span className="text-[#475569] text-xs">+56 9 3481 9569</span>
            <span className="text-[#475569] text-xs">4cats.cl</span>
          </div>
        </div>

        {/* Print button */}
        <div className="text-center mt-6 no-print">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7C5CBF] text-white text-sm font-semibold rounded-xl hover:bg-[#6B4DAE] transition-all shadow-lg shadow-[#7C5CBF]/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
            Imprimir / Exportar PDF
          </button>
        </div>
      </footer>
    </div>
  );
}
