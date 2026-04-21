# Skill Registry - 4cats-app

## Compact Rules (auto-resolved)

### Project Standards
- **PWA Segmentation**: Usar `manifest.json` (logo-web) para landing y `manifest-app.json` (logo-app) para dashboards.
- **Color Scheme Control**: Definir siempre `color-scheme` en el CSS para evitar que el OS sobrescriba el tema claro.
- **Zero Placeholders**: NUNCA usar `...` en el código. Ediciones completas y válidas únicamente.
- **Pre-Push Build**: Ejecutar `npm run build` localmente antes de cualquier push a main.
- **React 19 Purity**: Prohibido `Math.random()` en el render. Usar LCG determinista para semillas.
- **State Initialization**: Cargar `sessionStorage/localStorage` en el inicializador de `useState(() => ...)` (evita cascading renders).
- **Navigation Sync**: Resetear UI durante el render comparando `pathname`, no en `useEffect`.
- **Zero Any Policy**: No usar `any`. En `catch`, usar `error: unknown` y verificar con `instanceof Error`.
- **Supabase**: NEVER use `supabase.from()` directly in components. Use `utils/supabase.ts`.
- **Typing**: Use global interfaces from `utils/supabase.ts`.
- **Admin**: Server-side auth check via `/api/admin/auth`.
- **Auth Persistence**: En herramientas internas (`Cats Control`, `Admin`), usar SIEMPRE `localStorage` para el estado de autenticación. `sessionStorage` está prohibido para estos casos.
- **Benchmarking Logic**: Al comparar métricas, definir explícitamente el sentido de éxito (higher_is_better: boolean) para el color-coding automático (Verde ↑ / Rojo ↓).
- **Hybrid Components**: Para trackers o efectos de cliente en Server Components, extraer a un archivo independiente (ej: `Tracker.tsx`) para no romper la jerarquía de Next.js.
- **Atomic Counters**: Usar funciones RPC en Supabase para incrementar contadores (`vistas`, `puntos`) y evitar race conditions.
- **RAG**: Use `bash /mnt/c/Users/Luis/Documents/supabase-keepalive/rag/rag-query.sh` for semantic search.
- **ROI-Centric Components**: Las herramientas para clientes (dashboards/propuestas) siempre deben incluir métricas de negocio (CTR, Conversión) junto con métricas técnicas (PageSpeed), conectando explícitamente tecnología con rentabilidad (ej: "Menor carga = Menor Costo en Ads").
- **Replace Tool Safety**: En archivos grandes, evitar el uso de 'allow_multiple' con la herramienta de 'replace' para prevenir la duplicación del final del archivo (tail duplication). Siempre verificar la integridad de cierre de llave ('}') si hay errores de sintaxis post-edición.

## User Skills

| Skill | Trigger | Source |
|-------|---------|--------|
| zero-error-architect | "zero error", "architect", "cambio técnico" | local |
| branch-pr | Creating a PR, opening a pull request | global |
| issue-creation | Creating an issue, reporting a bug | global |
| judgment-day | "judgment day", "review adversarial" | global |
| go-testing | Go tests, Bubbletea TUI | global |
| skill-creator | Creating new AI skills | global |
| skill-registry | "update skills", "skill registry" | global |
