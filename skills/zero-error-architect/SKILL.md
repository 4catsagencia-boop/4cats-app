---
name: zero-error-architect
description: >
  PROTOCOLO: UNIVERSAL ARCHITECT (V4.0) - ZERO ERROR MODE.
  Sistema operativo de actuación para desarrollo seguro en 4cats-app.
  Trigger: Al modificar Supabase, paneles administrativos o componentes UI.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "4.0"
---

## 🧭 PRINCIPIOS DE ARQUITECTURA 4CATS

### 1. Seguridad de Datos (RLS Compliance)
- **Regla**: Prohibido usar el cliente `supabase` para INSERT/UPDATE/DELETE en el cliente.
- **Patrón**: Siempre usar `useAdminDB` hook -> API Proxy -> Service Role.
- **Auditoría**: Siempre capturar IP del solicitante siguiendo estándar Next.js 15.

### 2. Pureza React 19 (Hydration Safety)
- **Regla**: Prohibido el uso de `Math.random()` directamente en renders.
- **Solución**: Usar generadores deterministas basados en `Date.now()` o props estáticas.

### 3. Calidad de Código y Estilo
- **Regla**: Después de tocar >2 archivos, correr `npm run lint`.
- **Regla**: Escapar siempre caracteres especiales en JSX (`&quot;`, `&apos;`).
- **PWA**: Usar `manifest.json` para landing y `manifest-app.json` para herramientas internas.

## 🛠️ FASES DE ACTUACIÓN

### FASE 1: DIAGNÓSTICO ESTRUCTURAL
1. **MAPEO**: Usar `grep_search` para identificar cables sueltos (ej: importaciones viejas).
2. **ANÁLISIS DE IMPACTO**: Verificar si el cambio afecta a `utils/supabase.ts` (Fuente de Verdad).

### FASE 2: EJECUCIÓN DECLARATIVA
1. **Surgical Edits**: Cambios mínimos y precisos. Preferir `write_file` para evitar errores de indentación en archivos grandes.
2. **Validación**: Correr linter inmediatamente si hay sospecha de errores de formato.

### FASE 3: CIERRE Y EVOLUCIÓN (ENGRAM)
1. **Memoria**: Guardar hallazgos no obvios en el Engram (`mem_save`).
2. **Documentación**: Actualizar `AGENTS.md` o skills si nace un nuevo patrón.

## 📝 EJEMPLOS DE PATRONES RECOMENDADOS

### Proxy Select
```typescript
const adminDB = useAdminDB();
const data = await adminDB.select("tabla", { column: "id", value: "123" });
```

### IP Tracking Estándar
```typescript
const forwarded = req.headers.get('x-forwarded-for');
const ip = forwarded ? forwarded.split(',')[0] : (req as any).ip || 'unknown';
```
