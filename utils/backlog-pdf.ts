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

export const generateBacklogPDF = (backlog: Backlog) => {
  const doc = new jsPDF();
  const nombreArchivo = backlog.nombre.replace(/\s+/g, "_").toLowerCase();

  // Fondo del Header
  doc.setFillColor(124, 92, 191); // #7C5CBF
  doc.rect(0, 0, 210, 45, "F");

  // --- LOGO 4CATS ---
  const lx = 25;
  const ly = 22;

  doc.setFillColor(255, 255, 255);
  doc.ellipse(lx, ly + 3, 8, 5, "F");
  doc.circle(lx - 5, ly - 2, 5, "F");
  doc.triangle(lx - 8, ly - 5, lx - 6, ly - 10, lx - 4, ly - 6, "F");
  doc.triangle(lx - 4, ly - 5, lx - 2, ly - 10, lx - 0, ly - 6, "F");
  doc.setLineWidth(1.5);
  doc.setDrawColor(255, 255, 255);
  doc.line(lx + 6, ly + 1, lx + 12, ly - 5);
  doc.circle(lx + 12, ly - 5, 0.8, "F");

  doc.setFillColor(124, 92, 191);
  doc.circle(lx - 6.5, ly - 3, 0.8, "F");
  doc.circle(lx - 3.5, ly - 3, 0.8, "F");

  // Título
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("4cats Studio", 45, 25);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("PRODUCT BACKLOG", 45, 32);

  // Cuadro de Folio
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(150, 15, 40, 20, 3, 3, "F");
  doc.setTextColor(124, 92, 191);
  doc.setFontSize(8);
  doc.text("BACKLOG", 155, 22);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(backlog.nombre, 155, 30);

  // --- CUERPO ---

  // Datos del Proyecto
  doc.setTextColor(124, 92, 191);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMACIÓN DEL PROYECTO", 20, 60);

  doc.setTextColor(39, 39, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(backlog.nombre, 20, 68);

  doc.setFontSize(9);
  doc.setTextColor(82, 82, 91);
  doc.text(`Cliente: ${backlog.cliente_nombre}`, 20, 74);
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-CL")}`, 20, 79);

  if (backlog.descripcion) {
    doc.setFontSize(8);
    doc.text(`Descripción: ${backlog.descripcion}`, 20, 84, { maxWidth: 170 });
  }

  let currentY = 95;

  // Épicas y User Stories
  for (let i = 0; i < backlog.epicas.length; i++) {
    const epica = backlog.epicas[i];

    // Título de la épica con fondo violeta
    doc.setFillColor(243, 238, 255); // #F3EEFF
    doc.rect(20, currentY - 3, 170, 7, "F");

    doc.setTextColor(124, 92, 191);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`${epica.codigo}: ${epica.nombre}`, 22, currentY + 2);

    if (epica.descripcion) {
      doc.setFontSize(8);
      doc.setTextColor(82, 82, 91);
      doc.setFont("helvetica", "normal");
      doc.text(`${epica.descripcion}`, 22, currentY + 6.5, { maxWidth: 165 });
      currentY += 3;
    }

    currentY += 8;

    // Tabla de User Stories
    if (epica.historias.length > 0) {
      type AutoTableBody = (string | { content: string; styles?: Record<string, unknown> })[][];
      const tableBody: AutoTableBody = epica.historias.map((hu) => [
        hu.codigo,
        hu.descripcion,
        hu.notas || "",
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [["Código", "Descripción", "Notas"]],
        body: tableBody,
        theme: "grid",
        headStyles: {
          fillColor: [200, 190, 220],
          textColor: [80, 80, 90],
          fontSize: 8,
          fontStyle: "bold",
          halign: "left",
        },
        columnStyles: {
          0: { cellWidth: 25, halign: "left" },
          1: { cellWidth: 90, halign: "left" },
          2: { cellWidth: 55, halign: "left" },
        },
        styles: { fontSize: 7, cellPadding: 3 },
        margin: { left: 20, right: 20 },
        pageBreak: "auto",
      });

      currentY = (doc as jsPDFWithAutoTable).lastAutoTable?.cursor?.y || currentY + 20;
      currentY += 8;
    } else {
      doc.setFontSize(8);
      doc.setTextColor(161, 161, 170);
      doc.setFont("helvetica", "italic");
      doc.text("Sin historias de usuario", 22, currentY);
      currentY += 6;
    }

    // Espacio entre épicas
    currentY += 3;

    // Romper página si es necesario
    if (currentY > 250) {
      doc.addPage();
      currentY = 15;
    }
  }

  // Resumen final
  const totalEpicas = backlog.epicas.length;
  const totalHUs = backlog.epicas.reduce((sum, e) => sum + e.historias.length, 0);

  let summaryY = Math.max(currentY + 5, 250);

  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(228, 228, 231);
  doc.roundedRect(20, summaryY, 170, 25, 2, 2, "FD");

  doc.setTextColor(124, 92, 191);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("RESUMEN", 25, summaryY + 7);

  doc.setTextColor(82, 82, 91);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Total de Épicas: ${totalEpicas}`, 25, summaryY + 14);
  doc.text(`Total de Historias de Usuario: ${totalHUs}`, 25, summaryY + 19);

  // Notas
  if (backlog.notas) {
    summaryY += 30;
    doc.setTextColor(82, 82, 91);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Notas:", 20, summaryY);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(130, 130, 140);
    doc.text(backlog.notas, 20, summaryY + 5, { maxWidth: 170 });
  }

  // --- FOOTER ---
  doc.setFontSize(7);
  doc.setTextColor(161, 161, 170);
  doc.setFont("helvetica", "normal");
  doc.text("Documento generado electrónicamente por 4cats Studio. No requiere firma manuscrita.", 105, 285, { align: "center" });
  doc.text("www.4cats.cl  |  hola@4cats.cl", 105, 290, { align: "center" });

  doc.save(`Backlog_${nombreArchivo}_${new Date().toISOString().split("T")[0]}.pdf`);
};
