"use client";

import { motion } from "framer-motion";

interface LinkItem {
  label: string;
  url: string;
  type: "primary" | "secondary" | "outline";
}

interface Step {
  number: number;
  title: string;
  description: string;
  links: LinkItem[];
}

const steps: Step[] = [
  {
    number: 1,
    title: "Visión y Concepto",
    description: "Definición inicial del proyecto, objetivos y contexto estratégico. Aquí establecemos las bases de lo que estamos construyendo.",
    links: [
      { label: "Sitio de Referencia", url: "https://c1a84f72-5e6d-4b91-9f3a-2d7c8e1ab6f4.netlify.app/", type: "primary" },
      { label: "Documento de Propuesta", url: "https://docs.google.com/document/d/1XMMrWO_CTq_-C3m72dg4Y58FTcUpcIaKWfCXdlZsuTE/edit?tab=t.0", type: "secondary" },
      { label: "Chat de Referencia", url: "https://gemini.google.com/share/e2e5b9ba308a?hl=es_419", type: "outline" },
    ],
  },
  {
    number: 2,
    title: "Planificación y Requerimientos",
    description: "Detalle técnico y seguimiento de requerimientos. El mapa de ruta que guía la implementación paso a paso.",
    links: [
      { label: "Planificación Detallada", url: "https://docs.google.com/document/d/1-46P_3-b8x32EA3jPes0TtMIDXLQFAa3TYkXcPDGkiQ/edit?tab=t.0", type: "primary" },
      { label: "Seguimiento REQ-1042", url: "https://7f3c9e2d-8a41-4b6a-b2c7-5d9f1e8a4c33.netlify.app/seguimiento/REQ-1042", type: "secondary" },
    ],
  },
  {
    number: 3,
    title: "Recursos y Presentación",
    description: "Material visual y descriptivo del proyecto. Todo lo necesario para visualizar el resultado final.",
    links: [
      { label: "Presentación PDF", url: "https://drive.google.com/file/d/15-HwQshb6jx0abCP_C1ON6TtV60e7S3h/view", type: "primary" },
    ],
  },
  {
    number: 4,
    title: "Implementación y Control",
    description: "Acceso a las herramientas de gestión y control del sistema. Gestión de backoffice y despliegue.",
    links: [
      { label: "Acceso Backoffice", url: "https://7f3c9e2d-8a41-4b6a-b2c7-5d9f1e8a4c33.netlify.app/login", type: "primary" },
    ],
  },
];

export default function PropuestaView() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-[#18181B] dark:text-white mb-2"
        >
          Propuesta Estratégica
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[#71717A] dark:text-[#A1A1AA]"
        >
          Guía paso a paso de los recursos y la planificación del proyecto 4cats.
        </motion.p>
      </header>

      <div className="space-y-8 relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-4 bottom-4 w-px bg-[#E4E4E7] dark:bg-[#2A2A35] hidden sm:block" />

        {steps.map((step, idx) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="relative pl-0 sm:pl-16"
          >
            {/* Step Number Circle */}
            <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-[#F3EEFF] dark:bg-[#1C1630] border-4 border-white dark:border-[#09090B] flex items-center justify-center text-[#7C5CBF] font-bold z-10 hidden sm:flex">
              {step.number}
            </div>

            <div className="bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4 sm:hidden">
                <span className="w-8 h-8 rounded-full bg-[#7C5CBF] text-white flex items-center justify-center text-sm font-bold">
                  {step.number}
                </span>
                <h2 className="text-xl font-bold text-[#18181B] dark:text-white">{step.title}</h2>
              </div>
              
              <h2 className="hidden sm:block text-xl font-bold text-[#18181B] dark:text-white mb-4">{step.title}</h2>
              <p className="text-[#52525B] dark:text-[#D4D4D8] mb-8 leading-relaxed">
                {step.description}
              </p>

              <div className="flex flex-wrap gap-3">
                {step.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                      link.type === "primary"
                        ? "bg-[#7C5CBF] text-white shadow-lg shadow-[#7C5CBF]/20 hover:bg-[#6B4DAE]"
                        : link.type === "secondary"
                        ? "bg-[#F3EEFF] dark:bg-[#1C1630] text-[#7C5CBF] hover:bg-[#E8DFFF] dark:hover:bg-[#251D40]"
                        : "border border-[#E4E4E7] dark:border-[#2A2A35] text-[#52525B] dark:text-[#A1A1AA] hover:bg-[#FAFAFA] dark:hover:bg-[#16161D]"
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <footer className="mt-16 text-center">
        <p className="text-xs text-[#A1A1AA]">
          ¿Dudas sobre el proceso? Contactá al equipo de desarrollo.
        </p>
      </footer>
    </div>
  );
}
