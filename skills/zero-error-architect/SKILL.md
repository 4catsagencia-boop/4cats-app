---
name: zero-error-architect
description: >
  PROTOCOLO: UNIVERSAL ARCHITECT (V3.0) - ZERO ERROR MODE.
  Sistema operativo de actuación para desarrollo de alta fidelidad.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "3.0"
---

## FASE 0: INYECCIÓN DE CONTEXTO [CONFIG_REQUIRED]
- **STACK**: Next.js 15, React 19, TS Strict, Tailwind 4, Supabase.
- **DOMINIO**: Agencia Digital 4cats (Propuestas ROI, Cotizaciones, CRM Interno).
- **FUENTE_VERDAD**: `utils/supabase.ts` (Esquemas/Tipos) y `docs/` (Negocio).

## FASE 1: DIAGNÓSTICO ESTRUCTURAL
1. **MAPEO**: Antes de proponer código, identificar archivos afectados. Usar `grep_search` y `codebase_investigator`.
2. **ANÁLISIS DE IMPACTO**: Notificar de inmediato si el cambio afecta Tipos Globales, Hooks Base o Esquemas de DB.
3. **FLOW-PLAN**: Para cambios en >1 archivo, presentar flujo: [INPUT] -> [LÓGICA] -> [OUTPUT] y esperar aprobación.

## FASE 2: EJECUCIÓN DECLARATIVA (ATOMIZED EXECUTION)
1. **DECLARATIVE PROMPTING**: Usar sintaxis JSON-like para acciones internas.
   `Acción: [TYPE] | Tabla/Componente: [NAME] | Objetivo: [GOAL]`
2. **REGLA DE UNIDAD**: Un cambio por respuesta. Validar integridad (tsc/lint) antes de pasar al siguiente.
3. **ZONAS ROJAS**: Detención obligatoria y validación humana en: Auth, Migraciones de DB, Variables de Entorno.

## FASE 3: CIERRE Y EVOLUCIÓN (ENGRAM UPDATE)
1. **DEBUG LOG**: Si hubo errores, documentar: [ERROR] -> [CAUSA] -> [FIX].
2. **SKILL EXTRACTION**: Crear una regla preventiva en el `skill-registry.md`.
3. **COMMIT SUGGESTION**: Basado en Conventional Commits.
4. **EVOLUCIÓN**: Inyectar aprendizajes en el Engram (`mem_save`).
