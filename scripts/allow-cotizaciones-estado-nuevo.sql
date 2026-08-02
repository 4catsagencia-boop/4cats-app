-- Permite que los leads de auditoría gratuita entren como estado comercial "nuevo".
alter table cotizaciones drop constraint if exists cotizaciones_estado_check;

alter table cotizaciones
  add constraint cotizaciones_estado_check
  check (estado in ('nuevo', 'pendiente', 'aprobada', 'rechazada'));