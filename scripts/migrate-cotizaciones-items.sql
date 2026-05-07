-- Migración: agregar columnas items y metadata a cotizaciones
-- Ejecutar en Supabase SQL Editor

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cotizaciones' AND column_name = 'items'
  ) THEN
    ALTER TABLE cotizaciones ADD COLUMN items JSONB;
    RAISE NOTICE 'Columna items agregada';
  ELSE
    RAISE NOTICE 'Columna items ya existe';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cotizaciones' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE cotizaciones ADD COLUMN metadata JSONB;
    RAISE NOTICE 'Columna metadata agregada';
  ELSE
    RAISE NOTICE 'Columna metadata ya existe';
  END IF;
END $$;
