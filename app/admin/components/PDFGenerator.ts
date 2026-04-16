import { jsPDF } from "jspdf";
import "jspdf-autotable";

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

const formatCLP = (precio: number) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(precio);
};

export const generateQuotePDF = (data: QuoteData) => {
  const doc = new jsPDF() as any;

  // Header
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("4cats", 20, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text("4cats.cl", 20, 32);
  doc.text("luis.saez@4cats.cl", 20, 37);
  doc.text("+56 9 3481 9569", 20, 42);

  // Quote Info
  doc.setTextColor(0);
  doc.setFontSize(16);
  doc.text(`COTIZACIÓN N° ${String(data.numero).padStart(4, "0")}`, 130, 25);
  doc.setFontSize(10);
  doc.text(`Fecha: ${data.fecha}`, 130, 32);

  // Client Info
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENTE:", 20, 60);
  doc.setFont("helvetica", "normal");
  doc.text(data.cliente.nombre, 20, 67);
  if (data.cliente.empresa) doc.text(data.cliente.empresa, 20, 72);
  if (data.cliente.rut) doc.text(`RUT: ${data.cliente.rut}`, 20, 77);
  doc.text(data.cliente.email, 20, 82);
  doc.text(data.cliente.telefono, 20, 87);

  // Table
  const tableData = data.items.map((item) => [
    item.descripcion,
    formatCLP(item.precio),
    formatCLP(item.precio),
  ]);

  doc.autoTable({
    startY: 100,
    head: [["Descripción", "Precio Unitario", "Total"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillGray: 20, textColor: 255 },
    styles: { fontSize: 10, cellPadding: 5 },
  });

  const finalY = doc.lastAutoTable.finalY;

  // Totals
  doc.text("Subtotal:", 130, finalY + 15);
  doc.text(formatCLP(data.subtotal), 170, finalY + 15, { align: "right" });

  doc.text("IVA 19%:", 130, finalY + 22);
  doc.text(formatCLP(data.iva), 170, finalY + 22, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.text("TOTAL:", 130, finalY + 30);
  doc.text(formatCLP(data.total), 170, finalY + 30, { align: "right" });

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100);
  if (data.notas) {
    doc.text("Notas:", 20, finalY + 15);
    doc.text(data.notas, 20, finalY + 20, { maxWidth: 100 });
  }
  doc.text("Cotización válida por 30 días", 105, 280, { align: "center" });

  doc.save(`Cotizacion_${data.numero}.pdf`);
};
