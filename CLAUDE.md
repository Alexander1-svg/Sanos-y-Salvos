# CLAUDE.md — Instrucciones para Claude

@AGENTS.md

---

## Contexto adicional para Claude

### Al modificar componentes
- Siempre mantener el JSDoc existente y actualizarlo si cambian las props
- No eliminar comentarios de sección como `{/* ── PASO 1: Dueño ── */}`
- Si agregas un componente nuevo, crear también su `.stories.tsx`

### Al modificar estilos
- Usar solo clases de Tailwind CSS, no escribir CSS inline salvo casos excepcionales
- La paleta principal es `emerald` para acciones y `stone` para fondos y texto
- Los inputs siguen la clase `inputCls` y los selects `selectCls` definidas en `Reports.tsx`

### Al hacer fetch a microservicios
- Siempre usar las variables de entorno `NEXT_PUBLIC_MS_*`, nunca URLs hardcodeadas
- Parsear `res.json()` una sola vez por request para no consumir el body dos veces
- Siempre manejar el caso donde el servicio devuelve HTML en vez de JSON (Render en frío)

### Lo que NO hacer
- No usar `localStorage` ni `sessionStorage`
- No agregar librerías de UI externas (shadcn, MUI, etc.) sin consultar
- No hacer SSR en componentes que usen Leaflet