# Proceso de Cotización

## Cómo funciona
1. El cliente llena el formulario en 4cats.cl/cotizar
2. Ingresa nombre, email, teléfono, plan de interés y mensaje
3. La cotización se guarda en Supabase con estado "pendiente"
4. 4cats responde en menos de 24 horas con propuesta a medida

## Estados de una cotización
- **pendiente** — recién enviada, sin revisar
- **aprobada** — cliente aceptó la propuesta
- **rechazada** — no se concretó

## Desde el panel admin (/admin)
- Se pueden crear cotizaciones manualmente para clientes existentes
- Se puede descargar PDF de cada cotización
- Los ítems se pueden personalizar manualmente
- Se puede registrar un cliente nuevo al crear la cotización

## Campos de una cotización
- Cliente (nombre, email, teléfono, empresa, RUT)
- Plan base seleccionado
- Ítems personalizados (descripción, cantidad, precio unitario)
- Subtotal, IVA (19%), Total
- Notas adicionales
- Estado
