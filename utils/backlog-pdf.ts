import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Backlog } from "./supabase";

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    cursor?: {
      y: number
    }
  }
}

const MARGIN_LEFT = 20;
const MARGIN_RIGHT = 20;
const CONTENT_WIDTH = 210 - MARGIN_LEFT - MARGIN_RIGHT;

export const generateBacklogPDF = (backlog: Backlog) => {
  const doc = new jsPDF();
  const nombreArchivo = backlog.nombre.replace(/\s+/g, "_").toLowerCase();

  // --- HEADER ---
  doc.setFillColor(124, 92, 191); // #7C5CBF
  doc.rect(0, 0, 210, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("PRODUCT BACKLOG", MARGIN_LEFT, 20);

  // --- INFORMACIÓN DEL PROYECTO ---
  let currentY = 42;

  // Sección título
  doc.setTextColor(124, 92, 191);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PROYECTO", MARGIN_LEFT, currentY);

  currentY += 7;

  // Nombre del proyecto
  doc.setTextColor(39, 39, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(backlog.nombre, MARGIN_LEFT, currentY);

  currentY += 6;

  // Datos del cliente
  doc.setFontSize(9);
  doc.setTextColor(82, 82, 91);
  doc.text(`Cliente: ${backlog.cliente_nombre}`, MARGIN_LEFT, currentY);

  currentY += 5;
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-CL")}`, MARGIN_LEFT, currentY);

  // Descripción
  if (backlog.descripcion) {
    currentY += 6;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const descLines = doc.splitTextToSize(backlog.descripcion, CONTENT_WIDTH);
    doc.text(descLines, MARGIN_LEFT, currentY);
    currentY += descLines.length * 4;
  }

  currentY += 8;

  // --- ÉPICAS Y USER STORIES ---
  for (let i = 0; i < backlog.epicas.length; i++) {
    const epica = backlog.epicas[i];

    // Verificar si cabe en la página actual (estimamos 8px por HU para textos de 1-2 líneas)
    const estimatedHeight = 10 + (epica.historias.length * 8) + 3;
    if (currentY + estimatedHeight > 270) {
      doc.addPage();
      currentY = 15;
    }

    // Título de la épica con fondo
    doc.setFillColor(243, 238, 255); // #F3EEFF
    doc.rect(MARGIN_LEFT, currentY, CONTENT_WIDTH, 7, "F");

    doc.setTextColor(124, 92, 191);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`${epica.codigo}: ${epica.nombre}`, MARGIN_LEFT + 2, currentY + 4.5);

    currentY += 9;

    // Tabla de User Stories
    if (epica.historias.length > 0) {
      type AutoTableBody = (string | { content: string; styles?: Record<string, unknown> })[][];
      const tableBody: AutoTableBody = epica.historias.map((hu) => [
        hu.descripcion,
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [],
        body: tableBody,
        theme: "plain",
        bodyStyles: {
          fontSize: 7,
          textColor: [80, 80, 90],
          lineColor: [230, 230, 230],
          lineWidth: 0.3,
        },
        columnStyles: {
          0: { cellWidth: CONTENT_WIDTH, halign: "left" },
        },
        styles: {
          cellPadding: 2,
          overflow: "linebreak",
        },
        margin: { left: MARGIN_LEFT, right: MARGIN_RIGHT, bottom: 20 },
        rowPageBreak: "avoid",
      });

      // cursor.y siempre refleja la posición final, sea en la misma página o en una nueva
      currentY = ((doc as jsPDFWithAutoTable).lastAutoTable?.cursor?.y ?? currentY + 20) + 4;
    } else {
      doc.setFontSize(8);
      doc.setTextColor(161, 161, 170);
      doc.setFont("helvetica", "italic");
      doc.text("Sin historias de usuario", MARGIN_LEFT + 2, currentY);
      currentY += 6;
    }
  }

  // --- RESUMEN FINAL ---
  currentY += 3;

  // Verificar si cabe el resumen
  if (currentY > 250) {
    doc.addPage();
    currentY = 15;
  }

  const totalEpicas = backlog.epicas.length;
  const totalHUs = backlog.epicas.reduce((sum, e) => sum + e.historias.length, 0);

  doc.setFillColor(243, 238, 255);
  doc.setDrawColor(124, 92, 191);
  doc.setLineWidth(0.5);
  doc.rect(MARGIN_LEFT, currentY, CONTENT_WIDTH, 18, "FD");

  doc.setTextColor(124, 92, 191);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("RESUMEN", MARGIN_LEFT + 2, currentY + 5);

  doc.setTextColor(82, 82, 91);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Total de Épicas: ${totalEpicas}`, MARGIN_LEFT + 2, currentY + 11);
  doc.text(`Total de Historias de Usuario: ${totalHUs}`, MARGIN_LEFT + 2, currentY + 16);

  // Notas
  if (backlog.notas) {
    currentY += 22;
    doc.setTextColor(124, 92, 191);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Notas", MARGIN_LEFT, currentY);

    currentY += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(82, 82, 91);
    doc.setFontSize(8);
    const notasLines = doc.splitTextToSize(backlog.notas, CONTENT_WIDTH);
    doc.text(notasLines, MARGIN_LEFT, currentY);
  }

  doc.save(`Backlog_${nombreArchivo}_${new Date().toISOString().split("T")[0]}.pdf`);
};
