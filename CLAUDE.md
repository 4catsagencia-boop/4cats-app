# 4cats-app — Contexto del Proyecto

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
bash /mnt/c/Users/luiss/Documents/supabase-keepalive/rag/rag-query.sh "tu pregunta aquí"
```

Esto devuelve los archivos y fragmentos de código más relevantes para responder con precisión.

## Paths importantes
- Proyecto: `/mnt/c/Users/luiss/4cats-app`
- RAG scripts: `/mnt/c/Users/luiss/Documents/supabase-keepalive/rag/`
- Indexer (re-indexar): `python /mnt/c/Users/luiss/Documents/supabase-keepalive/rag/indexer.py`
