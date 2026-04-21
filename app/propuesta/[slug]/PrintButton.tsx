"use client";

export default function PrintButton() {
  return (
    <div className="print:hidden fixed bottom-6 right-6 z-50">
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 bg-[#7C5CBF] text-white px-5 py-3 rounded-2xl font-semibold text-sm shadow-xl shadow-[#7C5CBF]/30 hover:bg-[#6B4DAE] transition-all"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Descargar PDF
      </button>
    </div>
  );
}
