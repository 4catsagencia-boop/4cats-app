-- Kill Switch para propuestas estratégicas
-- Separa el control de acceso (activo) del ciclo de vida comercial (estado).
-- Idempotente: se puede correr varias veces sin romper nada.

ALTER TABLE propuestas
  ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true;

-- Las propuestas existentes quedan activas por defecto.
-- Para desactivar un enlace: UPDATE propuestas SET activo = false WHERE id = '...';
