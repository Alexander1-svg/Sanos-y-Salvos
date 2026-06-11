# AGENTS.md — Guía para Agentes IA

## ⚠️ Advertencia sobre Next.js
<!-- BEGIN:nextjs-agent-rules -->
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## Contexto del Proyecto
**Sanos y Salvos** es una plataforma de rescate animal desarrollada en Next.js 16 con arquitectura de microservicios. El frontend consume 3 microservicios desplegados en Render.

---

## Estructura de Componentes
- `components/Layout/` — Navbar y Footer, sin props, sin lógica
- `components/Reports.tsx` — Formulario de reporte en 2 pasos, llama a `NEXT_PUBLIC_MS_GESTION`
- `components/SuccessScreen.tsx` — Pantalla de éxito, recibe `nombreMascota`, `email`, `reporteId`, `onReset`
- `components/MapaPerdida.tsx` — Mapa Leaflet con búsqueda, llama a `NEXT_PUBLIC_MS_GEO`
- `components/Coincidencias.tsx` — Motor de coincidencias, llama a `NEXT_PUBLIC_MS_MOTOR`

---

## Variables de Entorno
Todas las URLs de microservicios están en `.env.local`. Ver `.env.local.example` para referencia. Nunca hardcodear URLs.

---

## Convenciones
- Todos los componentes usan `"use client"` porque usan `useState`
- Tailwind CSS para estilos, sin CSS modules ni styled-components
- TypeScript estricto, todas las props tipadas con interfaces
- Leaflet se importa siempre con `dynamic` y `ssr: false`