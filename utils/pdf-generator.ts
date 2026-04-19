import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Augment the jsPDF type for autotable support
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    cursor?: {
      y: number
    }
  }
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
  }>;
  subtotal: number;
  iva: number;
  total: number;
  notas?: string;
}

export const generateQuotePDF = (data: QuoteData) => {
  const doc = new jsPDF();
  const folioFinal = 200 + data.numero;

  // Fondo del Header
  doc.setFillColor(124, 92, 191); // #7C5CBF
  doc.rect(0, 0, 210, 45, "F");

  // --- LOGO 4CATS (5 ELIPSES PREMIUM) ---
  const lx = 25; // centro X
  const ly = 22; // centro Y
  
  doc.setFillColor(255, 255, 255);
  
  // 1. Cuerpo (Elipse grande)
  doc.ellipse(lx, ly + 3, 8, 5, "F");
  
  // 2. Cabeza (Círculo)
  doc.circle(lx - 5, ly - 2, 5, "F");
  
  // 3 y 4. Orejas (Triángulos/Elipses pequeñas)
  doc.triangle(lx - 8, ly - 5, lx - 6, ly - 10, lx - 4, ly - 6, "F");
  doc.triangle(lx - 4, ly - 5, lx - 2, ly - 10, lx - 0, ly - 6, "F");
  
  // 5. Cola (Elipse larga y curva)
  doc.setLineWidth(1.5);
  doc.setDrawColor(255, 255, 255);
  doc.line(lx + 6, ly + 1, lx + 12, ly - 5); // Cola hacia arriba
  doc.circle(lx + 12, ly - 5, 0.8, "F");

  // Ojos (Violetas para que tenga alma)
  doc.setFillColor(124, 92, 191);
  doc.circle(lx - 6.5, ly - 3, 0.8, "F");
  doc.circle(lx - 3.5, ly - 3, 0.8, "F");

  // Título y Slogan
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("4cats Studio", 45, 25);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("DISEÑO Y DESARROLLO WEB PROFESIONAL", 45, 32);

  // Cuadro de Folio (Derecha Superior)
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(150, 15, 40, 20, 3, 3, "F");
  doc.setTextColor(124, 92, 191);
  doc.setFontSize(8);
  doc.text("COTIZACIÓN", 155, 22);
  doc.setFontSize(14);
  doc.text(`N° ${folioFinal}`, 155, 30);

  // --- CUERPO ---

  // Datos del Cliente (A la izquierda ahora)
  doc.setTextColor(124, 92, 191);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL CLIENTE", 20, 60);
  
  doc.setTextColor(39, 39, 42); // Zinc-800
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(data.cliente.empresa || data.cliente.nombre, 20, 68);
  
  doc.setFontSize(9);
  doc.setTextColor(82, 82, 91); // Zinc-600
  if (data.cliente.rut) doc.text(`RUT: ${data.cliente.rut}`, 20, 74);
  doc.text(`Email: ${data.cliente.email}`, 20, 79);
  if (data.cliente.telefono) doc.text(`Teléfono: ${data.cliente.telefono}`, 20, 84);

  // Datos de Emisión (A la derecha)
  doc.setTextColor(124, 92, 191);
  doc.setFont("helvetica", "bold");
  doc.text("EMITIDO POR", 130, 60);
  doc.setTextColor(82, 82, 91);
  doc.setFont("helvetica", "normal");
  doc.text("Luis Arnoldo Sáez Candia", 130, 68);
  doc.text(`Fecha: ${data.fecha}`, 130, 73);
  doc.text("Temuco, Chile", 130, 78);

  // Tabla de Items (Con corrección de desborde)
  const tableBody = data.items.map((item) => [
    item.descripcion,
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(item.precio),
  ]);

  autoTable(doc, {
    startY: 95,
    head: [["Descripción del Servicio", "Monto"]],
    body: tableBody,
    theme: "striped",
    headStyles: { 
      fillColor: [124, 92, 191], 
      textColor: [255, 255, 255], 
      fontSize: 10, 
      fontStyle: "bold",
      halign: "left"
    },
    columnStyles: {
      0: { cellWidth: 130 }, // Ancho fijo para evitar desborde
      1: { halign: "right", fontStyle: "bold" }
    },
    styles: { fontSize: 9, cellPadding: 5 },
    margin: { left: 20, right: 20 },
  });

  // Posición después de la tabla
  let finalY = (doc as jsPDFWithAutoTable).lastAutoTable?.cursor?.y || 150;
  finalY += 10;

  // Totales (Alineados a la derecha)
  doc.setFontSize(10);
  doc.setTextColor(82, 82, 91);
  doc.text("Subtotal:", 140, finalY);
  doc.text(new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(data.subtotal), 190, finalY, { align: "right" });

  doc.text("IVA (19%):", 140, finalY + 7);
  doc.text(new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(data.iva), 190, finalY + 7, { align: "right" });

  doc.setFontSize(14);
  doc.setTextColor(124, 92, 191);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL:", 140, finalY + 16);
  doc.text(new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(data.total), 190, finalY + 16, { align: "right" });

  // Cuadro de Transferencia (Más estilizado)
  const bankY = Math.max(finalY + 30, 190);
  doc.setDrawColor(228, 228, 231); // Zinc-200
  doc.setFillColor(250, 250, 250); // Zinc-50
  doc.roundedRect(20, bankY, 170, 35, 2, 2, "FD");
  
  doc.setTextColor(124, 92, 191);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMACIÓN DE PAGO / TRANSFERENCIA", 25, bankY + 7);
  
  doc.setTextColor(82, 82, 91);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Nombre: Luis Arnoldo Sáez  |  RUT: 15.756.422-6  |  Banco: Banco Falabella`, 25, bankY + 15);
  doc.text(`Tipo: Cuenta Corriente  |  N°: 1-024-010017-8  |  Email: luissaezcandia@gmail.com`, 25, bankY + 22);
  doc.setFont("helvetica", "bold");
  doc.text("Por favor, enviar comprobante de transferencia al correo indicado.", 25, bankY + 29);

  // Notas finales
  if (data.notas) {
    doc.setFontSize(8);
    doc.setTextColor(161, 161, 170);
    doc.setFont("helvetica", "italic");
    doc.text(`Notas adicionales: ${data.notas}`, 20, bankY + 45, { maxWidth: 170 });
  }

  // --- FOOTER LEGAL ---
  doc.setFontSize(7);
  doc.setTextColor(161, 161, 170);
  doc.setFont("helvetica", "normal");
  doc.text("Documento generado electrónicamente por 4cats Studio. No requiere firma manuscrita.", 105, 285, { align: "center" });
  doc.text("www.4cats.cl  |  hola@4cats.cl", 105, 290, { align: "center" });

  doc.save(`Cotizacion_4cats_${folioFinal}.pdf`);
};
