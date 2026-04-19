---
name: zero-error-architect
description: >
  Protocolo de actuación para asegurar cambios sin errores en 4cats-app.
  Trigger: Al iniciar cualquier tarea técnica, refactorización o corrección de bugs.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

Usa esta skill SIEMPRE que vayas a modificar código, base de datos o infraestructura en el ecosistema 4cats. No es opcional.

## Critical Patterns

### Fase 1: Diagnóstico (No tocar código)
- **Investigación:** Usa `grep_search` y `codebase_investigator` para mapear dependencias.
- **Detección de "Zonas Rojas":** Si tocas Auth, DB Schema o Env vars, detente y pide confirmación doble.
- **Plan Mode:** Si el cambio afecta a más de 2 archivos, presenta el flujo de datos (Input -> Transformación -> Output) y espera aprobación.

### Fase 2: Ejecución Controlada
- **Un archivo a la vez:** No hagas cambios masivos. Edita, guarda y verifica.
- **Validación Inmediata:** Tras cada cambio, ejecuta `tsc` o `lint`. Si falla, rollback inmediato.
- **Estándares:** React 19 + TypeScript (Strict Mode) + Tailwind CSS 4.

### Fase 3: Engram & Cierre
- **Documentación:** `mem_save` explicando el "Por qué" (la razón técnica), no solo el "Qué".
- **Resumen:** Entrega un resumen conciso de cambios y una sugerencia de commit siguiendo estándares.

### Fase 4: Capitalización de Errores (Post-Commit)
- **Análisis de Fricción:** Identifica qué falló (tipos, lógica, sintaxis).
- **Extracción de Skill:** Si el error puede repetirse, crea una regla en el `skill-registry.md`.
- **Actualización del Engram:** Inyecta la solución exacta como una regla de oro para el futuro.

## Code Examples

### Correcto (Uso de utilidades centralizadas)
```typescript
// utils/supabase.ts
export const fetchPlanes = async () => {
  const { data } = await supabase.from(Tables.PLANES).select('*');
  return data;
};
```

### Incorrecto (Acceso directo prohibido)
```typescript
// components/BadComponent.tsx
const data = await supabase.from('planes').select('*'); // PROHIBIDO
```

## Resources

- **Documentación**: Ver `docs/negocio.md` para contexto de dominio.
- **Utilidades**: `utils/supabase.ts` es la fuente de verdad.
