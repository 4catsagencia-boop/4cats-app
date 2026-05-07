"use client";

import { Propuesta } from "@/utils/supabase";
import { generatePropuestaPDF } from "@/utils/propuesta-pdf";
import { FileDown } from "lucide-react";

interface PrintButtonProps {
  propuesta: Propuesta;
}

export default function PrintButton({ propuesta }: PrintButtonProps) {
  return (
    <div className="print:hidden fixed bottom-6 right-6 z-50">
      <button
        onClick={() => generatePropuestaPDF(propuesta)}
        className="flex items-center gap-2 bg-[#7C5CBF] text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-[#7C5CBF]/30 hover:bg-[#6B4DAE] hover:scale-105 transition-all"
      >
        <FileDown className="w-4 h-4" />
        Propuesta Formal (PDF)
      </button>
    </div>
  );
}
