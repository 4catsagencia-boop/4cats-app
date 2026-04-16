# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## RAG — Búsqueda semántica del codebase 4cats

Para responder preguntas sobre el código del proyecto, ejecuta:

```bash
bash /mnt/c/Users/luiss/Documents/supabase-keepalive/rag/rag-query.sh "tu pregunta"
```

Devuelve los fragmentos de código más relevantes con nombre de archivo y similitud.

## Negocio 4cats — Precios y Planes

### Planes de Mantenimiento (Socio Digital)
- **Emprendedor** — $35.000 CLP/mes: seguridad, actualizaciones, respaldos semanales, soporte email
- **Profesional** — $65.000 CLP/mes: todo lo anterior + 1.5h cambios, respaldos diarios, soporte WhatsApp
- **Corporativo** — $95.000 CLP/mes: todo lo anterior + 5h mensuales, firewall DDoS, reunión estratégica mensual

### Equipo 4cats
- **Lucy** — Estrategia y Visión
- **Billie** — Diseño y Creatividad
- **Layla** — Desarrollo Web
- **Roxanne** — Marketing Digital

### Contacto
- Email: luis.saez@4cats.cl | Teléfono: +56 9 3481 9569 | Web: 4cats.cl | Ciudad: Temuco

## Proyecto 4cats-app
- Workspace: `/mnt/c/Users/luiss/4cats-app`
- Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Supabase, Vercel
- Panel admin: `/admin` (contraseña: 4cats2025)
- Supabase: https://adebzdrdwqwlskylrgiu.supabase.co
- Tablas: `planes`, `cotizaciones`, `clientes`, `code_embeddings`

Add whatever helps you do your job. This is your cheat sheet.
