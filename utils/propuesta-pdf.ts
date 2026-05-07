import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Propuesta, METRIC_HIGHER_IS_BETTER } from "./supabase";

// Mapeo de iconos y descripciones de impacto para la tabla estratégica
const ROI_IMPACT_MAP: Record<string, { impact: string, icon: string, dim: string }> = {
  'CTR (Click-to-Call)': { impact: 'Más servicios facturados', icon: 'M', dim: 'Conversión' },
  'Tasa Conversión':      { impact: 'Mejor retorno de inversión', icon: '$', dim: 'Ventas' },
  'Ranking Keywords':     { impact: 'Menos gasto en publicidad', icon: 'V', dim: 'Visibilidad' },
  'PageSpeed Mobile':     { impact: 'Retención inmediata', icon: 'Z', dim: 'UX' },
  'Uptime (24/7)':        { impact: 'Disponibilidad total', icon: 'E', dim: 'Estabilidad' },
  'Security Score':       { impact: 'Blindaje de marca', icon: 'S', dim: 'Confianza' },
  'Accesibilidad (A11y)': { impact: 'Inclusión y mejor SEO', icon: 'A', dim: 'Calidad' },
  'Tiempo Tarea Crítica': { impact: 'Fricción mínima', icon: 'T', dim: 'UX' },
  'Costo por Lead':       { impact: 'Eficiencia publicitaria', icon: 'L', dim: 'Finanzas' },
};

export const generatePropuestaPDF = (propuesta: Propuesta) => {
  const doc = new jsPDF();
  const primaryColor = [124, 92, 191]; // #7C5CBF
  const secondaryColor = [39, 39, 42]; // #27272A

  // --- PORTADA ---
  // Fondo superior
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 100, "F");

  // Logo 4cats (Simplificado para PDF)
  doc.setFillColor(255, 255, 255);
  doc.circle(30, 40, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("4cats Studio", 45, 45);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("ESTRATEGIA DIGITAL & DESARROLLO DE ALTO IMPACTO", 45, 52);

  // Título de la propuesta
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text(propuesta.titulo.toUpperCase(), 20, 140, { maxWidth: 170 });
  
  if (propuesta.subtitulo) {
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(113, 113, 122);
    doc.text(propuesta.subtitulo, 20, 160, { maxWidth: 170 });
  }

  // Información de cliente y fecha
  doc.setDrawColor(228, 228, 231);
  doc.line(20, 180, 190, 180);
  
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PREPARADO PARA:", 20, 195);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(14);
  doc.text(propuesta.cliente_id || "CLIENTE EXCLUSIVO", 20, 205);

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(10);
  doc.text("FECHA DE EMISIÓN:", 130, 195);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(12);
  doc.text(new Date().toLocaleDateString('es-CL'), 130, 205);

  // Banner confidencial
  doc.setFillColor(244, 244, 245);
  doc.roundedRect(20, 240, 170, 20, 3, 3, "F");
  doc.setTextColor(161, 161, 170);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("DOCUMENTO PRIVADO Y CONFIDENCIAL", 105, 250, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text("Prohibida su reproducción o distribución sin consentimiento de 4cats.", 105, 254, { align: "center" });

  // --- PÁGINA 2: DESAFÍO Y SOLUCIÓN ---
  doc.addPage();
  
  // Header pequeño para páginas internas
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("PROPUESTA TÉCNICA | 4CATS STUDIO", 20, 13);

  // El Desafío
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("1. El Desafío Estratégico", 20, 40);
  
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(propuesta.problema || "Análisis de situación actual pendiente.", 20, 50, { maxWidth: 170, lineHeightFactor: 1.5 });

  // La Solución
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`2. ${propuesta.solucion_titulo || "Nuestra Propuesta"}`, 20, 120);
  
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(propuesta.solucion_descripcion || "Descripción de arquitectura técnica.", 20, 130, { maxWidth: 170, lineHeightFactor: 1.5 });

  // Ventajas
  if (propuesta.ventajas && propuesta.ventajas.length > 0) {
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("3. Diferenciadores Clave", 20, 200);

    const ventajasData = propuesta.ventajas.map(v => [v.titulo, v.descripcion]);
    autoTable(doc, {
      startY: 210,
      head: [["Dimensión", "Valor Agregado"]],
      body: ventajasData,
      theme: "grid",
      headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { fontSize: 9, cellPadding: 5 },
      columnStyles: { 0: { cellWidth: 40, fontStyle: "bold" } }
    });
  }

  // --- PÁGINA 3: ROADMAP ---
  if (propuesta.roadmap && propuesta.roadmap.length > 0) {
    doc.addPage();
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("PLAN DE EJECUCIÓN Y ROADMAP", 20, 13);

    let currentY = 40;
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("4. Cronograma de Implementación", 20, currentY);
    currentY += 15;

    propuesta.roadmap.forEach((module, idx) => {
      doc.setFillColor(243, 238, 255);
      doc.rect(20, currentY, 170, 10, "F");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`${module.id}: ${module.titulo}`, 25, currentY + 7);
      currentY += 12;

      const itemsData = module.items.map(i => [i.titulo, i.descripcion, i.fases ? `Fase ${i.fases}` : "-"]);
      autoTable(doc, {
        startY: currentY,
        head: [["Funcionalidad", "Detalle Técnico", "Entrega"]],
        body: itemsData,
        theme: "striped",
        headStyles: { fillColor: [228, 228, 231], textColor: [82, 82, 91], fontStyle: "bold" },
        styles: { fontSize: 8, cellPadding: 4 },
        columnStyles: { 0: { cellWidth: 40, fontStyle: "bold" }, 2: { cellWidth: 20, halign: "center" } },
        margin: { left: 20, right: 20 }
      });
      
      currentY = (doc as any).lastAutoTable.cursor.y + 10;
      
      // Salto de página si el roadmap es muy largo
      if (currentY > 250 && idx < propuesta.roadmap!.length - 1) {
        doc.addPage();
        currentY = 30;
      }
    });
  }

  // --- PÁGINA 4: IMPACTO EROI ---
  const roiMetrics = (propuesta.metricas || [])
    .filter(m => ROI_IMPACT_MAP[m.nombre] && (m.actual > 0 || m.propuesta > 0))
    .map(m => ({
      ...m,
      ...ROI_IMPACT_MAP[m.nombre]
    }));

  if (roiMetrics.length > 0) {
    doc.addPage();
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("ANÁLISIS DE IMPACTO Y ROI", 20, 13);

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("5. Proyección de Resultados (ROI)", 20, 40);

    const tableData = roiMetrics.map(m => [
      m.nombre,
      `${m.actual}${m.unidad}`,
      `${m.propuesta}${m.unidad}`,
      m.impact
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["Dimensión", "Estado Actual", "Propuesta 4cats", "Impacto en Negocio"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
      styles: { fontSize: 9, cellPadding: 6 },
      columnStyles: { 
        0: { fontStyle: "bold" },
        1: { halign: "center" },
        2: { halign: "center", fontStyle: "bold" },
        3: { fontStyle: "italic", textColor: primaryColor }
      }
    });

    let lastY = (doc as any).lastAutoTable.cursor.y + 20;

    // Benchmarking adicional si hay PageSpeed
    const psMobile = propuesta.metricas.find(m => m.nombre === 'PageSpeed Mobile');
    if (psMobile) {
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Comparativa de Performance (Lighthouse)", 20, lastY);
      
      const benchmarkData = [
        ["PageSpeed Mobile", `${psMobile.actual}/100`, `${psMobile.competidor}/100`, `${psMobile.propuesta}/100`]
      ];

      autoTable(doc, {
        startY: lastY + 5,
        head: [["Métrica", "Actual", "Competidor", "Propuesta 4cats"]],
        body: benchmarkData,
        theme: "plain",
        headStyles: { fillColor: [244, 244, 245], textColor: [82, 82, 91] },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: { 3: { textColor: primaryColor, fontStyle: "bold" } }
      });
    }
  }

  // Finalización
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(161, 161, 170);
    doc.text(`Propuesta Técnica Confidencial - Página ${i} de ${pageCount}`, 105, 290, { align: "center" });
  }

  doc.save(`Propuesta_Tecnica_4cats_${propuesta.slug}.pdf`);
};
