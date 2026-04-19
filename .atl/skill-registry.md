# Skill Registry - 4cats-app

## Compact Rules (auto-resolved)

### Project Standards
- **Zero Placeholders**: NUNCA usar `...` o comentarios de omisión en el código. Cada edición debe ser sintácticamente válida y completa.
- **Pre-Push Build**: Es obligatorio correr `npm run build` localmente antes de pushear cambios que afecten el layout o componentes críticos.
- **React 19 Purity**: Prohibido `Math.random()` en el render. Usar LCG determinista para semillas.
- **State Initialization**: Cargar `sessionStorage/localStorage` en el inicializador de `useState(() => ...)` (evita cascading renders).
- **Navigation Sync**: Resetear UI durante el render comparando `pathname`, no en `useEffect`.
- **Zero Any Policy**: No usar `any`. En `catch`, usar `error: unknown` y verificar con `instanceof Error`.
- **Supabase**: NEVER use `supabase.from()` directly in components. Use `utils/supabase.ts`.
- **Typing**: Use global interfaces from `utils/supabase.ts`.
- **Admin**: Server-side auth check via `/api/admin/auth`.
- **RAG**: Use `bash /mnt/c/Users/Luis/Documents/supabase-keepalive/rag/rag-query.sh` for semantic search.

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
