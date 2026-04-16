# 4cats-app — Contexto del Proyecto

## Project Laws (MANDATORY)
- **Supabase**: NEVER use `supabase.from()` directly in components. Use shared functions from `utils/supabase.ts`.
- **Typing**: Use global interfaces from `utils/supabase.ts`. No `any[]` or local duplicates.
- **Admin**: All admin actions must use server-side auth check via `/api/admin/auth`.
- **Git**: If push fails (403/rejected), use `git remote set-url` or `--allow-unrelated-histories` as needed.

## Stack
- Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4
- Supabase (backend + DB): https://adebzdrdwqwlskylrgiu.supabase.co
- Deploy: Vercel

## Tablas Supabase
- `planes` — planes de servicio (publicado, destacado, precio)
- `cotizaciones` — cotizaciones con estado (pendiente/aprobada/rechazada)
- `clientes` — clientes de la agencia
- `code_embeddings` — índice RAG del codebase (pgvector)

## Rutas principales
- `/` — Home
- `/planes` — Planes diseño/desarrollo
- `/planes-mantenimiento` — Planes mantenimiento
- `/cotizar` — Formulario público de cotización
- `/infografia` — Propuesta de mantenimiento
- `/admin` — Panel CMS (contraseña: 4cats2025)

## RAG — Búsqueda semántica del codebase
Antes de responder preguntas sobre el código del proyecto, ejecuta:

```bash
bash /mnt/c/Users/Luis/Documents/supabase-keepalive/rag/rag-query.sh "tu pregunta aquí"
```

Esto devuelve los archivos y fragmentos de código más relevantes para responder con precisión.

## Paths importantes
- Proyecto: `C:\Users\Luis\4cats-app` (Windows) / `/mnt/c/Users/Luis/4cats-app` (WSL)
- RAG scripts: `/mnt/c/Users/Luis/Documents/supabase-keepalive/rag/`
- Indexer (re-indexar): `python /mnt/c/Users/Luis/Documents/supabase-keepalive/rag/indexer.py`
