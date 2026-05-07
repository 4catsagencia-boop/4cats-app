import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: { cursor?: { y: number } }
}

interface QuoteData {
  numero: number;
  fecha: string;
  cliente: {
    nombre: string;
    empresa: string;
    rut: string;
    email: string;
    telefono: string;
  };
  items: Array<{
    descripcion: string;
    precio: number;
    modulo?: string;
  }>;
  subtotal: number;
  iva: number;
  total: number;
  notas?: string;
}

const loadImageAsDataUrl = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });

export const generateQuotePDF = async (data: QuoteData) => {
  const doc = new jsPDF();
  const folioFinal = 200 + data.numero;
  const clpFmt = (n: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

  // Header background
  doc.setFillColor(124, 92, 191);
  doc.rect(0, 0, 210, 48, "F");

  // Logo real
  try {
    const logoDataUrl = await loadImageAsDataUrl("/logo-4cats.png");
    doc.addImage(logoDataUrl, "PNG", 12, 8, 38, 22);
  } catch {
    // Fallback: texto si no carga la imagen
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("4cats", 14, 24);
  }

  // Nombre y slogan
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("4cats Agency", 56, 22);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("DISEÑO Y DESARROLLO WEB PROFESIONAL", 56, 30);

  // Cuadro folio
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(148, 12, 44, 22, 3, 3, "F");
  doc.setTextColor(124, 92, 191);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("COTIZACIÓN", 152, 20);
  doc.setFontSize(14);
  doc.text(`N° ${folioFinal}`, 152, 30);

  // Datos del cliente
  doc.setTextColor(124, 92, 191);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL CLIENTE", 20, 62);

  doc.setTextColor(39, 39, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(data.cliente.empresa || data.cliente.nombre, 20, 70);

  doc.setFontSize(9);
  doc.setTextColor(82, 82, 91);
  let clientY = 76;
  if (data.cliente.rut) { doc.text(`RUT: ${data.cliente.rut}`, 20, clientY); clientY += 6; }
  if (data.cliente.email) { doc.text(`Email: ${data.cliente.email}`, 20, clientY); clientY += 6; }
  if (data.cliente.telefono) { doc.text(`Teléfono: ${data.cliente.telefono}`, 20, clientY); }

  // Datos emisión
  doc.setTextColor(124, 92, 191);
  doc.setFont("helvetica", "bold");
  doc.text("EMITIDO POR", 130, 62);
  doc.setTextColor(82, 82, 91);
  doc.setFont("helvetica", "normal");
  doc.text("Luis Arnoldo Sáez Candia", 130, 70);
  doc.text(`Fecha: ${data.fecha}`, 130, 76);
  doc.text("Temuco, Chile", 130, 82);

  // Tabla de ítems
  const MODULO_NAMES: Record<string, string> = {
    sistema: "Módulo II: Sistema de Administración",
    web: "Módulo I: Plataforma Web (Landing Page)",
    mantencion: "Mantención Mensual",
  };
  const hasModulos = data.items.some(i => i.modulo);

  type AutoTableBody = (string | { content: string; styles?: Record<string, unknown> })[][];
  let tableBody: AutoTableBody = [];

  if (hasModulos) {
    const grupos: Record<string, typeof data.items> = {};
    const orden: string[] = [];
    for (const item of data.items) {
      const key = item.modulo || "otros";
      if (!grupos[key]) { grupos[key] = []; orden.push(key); }
      grupos[key].push(item);
    }
    for (const key of orden) {
      const subtotalMod = grupos[key].reduce((s, i) => s + i.precio, 0);
      tableBody.push([
        { content: MODULO_NAMES[key] || key, styles: { fontStyle: "bold", fillColor: [243, 238, 255] as unknown as string, textColor: [124, 92, 191] as unknown as string } },
        { content: "", styles: {} }
      ]);
      for (const item of grupos[key]) {
        tableBody.push([item.descripcion, clpFmt(item.precio)]);
      }
      if (subtotalMod > 0) {
        tableBody.push([
          { content: `Subtotal ${MODULO_NAMES[key] || key}`, styles: { fontStyle: "bold" } },
          { content: clpFmt(subtotalMod), styles: { fontStyle: "bold", halign: "right" as const } }
        ]);
      }
    }
  } else {
    tableBody = data.items.map(item => [item.descripcion, clpFmt(item.precio)]);
  }

  const tableStartY = Math.max(clientY + 14, 98);

  autoTable(doc, {
    startY: tableStartY,
    head: [["Descripción del Servicio", "Monto"]],
    body: tableBody,
    theme: "striped",
    headStyles: {
      fillColor: [124, 92, 191],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: "bold",
      halign: "left",
    },
    columnStyles: {
      0: { cellWidth: 135, overflow: "linebreak" },
      1: { cellWidth: 35, halign: "right", fontStyle: "bold" },
    },
    styles: { fontSize: 9, cellPadding: 4, overflow: "linebreak" },
    margin: { left: 20, right: 20, bottom: 25 },
  });

  let finalY = (doc as jsPDFWithAutoTable).lastAutoTable?.cursor?.y || 150;
  finalY += 12;

  // Si no hay espacio para totales, nueva página
  if (finalY > 240) {
    doc.addPage();
    finalY = 20;
  }

  // Totales
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(82, 82, 91);
  doc.text("Subtotal neto:", 130, finalY);
  doc.text(clpFmt(data.subtotal), 190, finalY, { align: "right" });

  doc.text("IVA (19%):", 130, finalY + 7);
  doc.text(clpFmt(data.iva), 190, finalY + 7, { align: "right" });

  doc.setFontSize(13);
  doc.setTextColor(124, 92, 191);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL:", 130, finalY + 16);
  doc.text(clpFmt(data.total), 190, finalY + 16, { align: "right" });

  // Cuadro transferencia
  const bankY = finalY + 28;
  if (bankY + 40 < 280) {
    doc.setDrawColor(228, 228, 231);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, bankY, 170, 35, 2, 2, "FD");

    doc.setTextColor(124, 92, 191);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACIÓN DE PAGO / TRANSFERENCIA", 25, bankY + 8);

    doc.setTextColor(82, 82, 91);
    doc.setFont("helvetica", "normal");
    doc.text("Nombre: Luis Arnoldo Sáez  |  RUT: 15.756.422-6  |  Banco: Banco Falabella", 25, bankY + 16);
    doc.text("Tipo: Cuenta Corriente  |  N°: 1-024-010017-8  |  Email: luissaezcandia@gmail.com", 25, bankY + 22);
    doc.setFont("helvetica", "bold");
    doc.text("Enviar comprobante de transferencia al correo indicado.", 25, bankY + 29);
  }

  // Notas
  if (data.notas) {
    doc.setFontSize(8);
    doc.setTextColor(161, 161, 170);
    doc.setFont("helvetica", "italic");
    doc.text(`Notas: ${data.notas}`, 20, bankY + 46, { maxWidth: 170 });
  }

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(161, 161, 170);
  doc.setFont("helvetica", "normal");
  doc.text("Documento generado electrónicamente por 4cats Agency. No requiere firma manuscrita.", 105, 287, { align: "center" });
  doc.text("www.4cats.cl  |  hola@4cats.cl", 105, 292, { align: "center" });

  doc.save(`Cotizacion_4cats_${folioFinal}.pdf`);
};
