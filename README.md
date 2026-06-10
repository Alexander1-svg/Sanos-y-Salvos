# 🐾 Sanos y Salvos 🐾

Este es el repositorio del **Frontend** de la plataforma "Sanos y Salvos", desarrollado con **Next.js**. El sistema permite reportar mascotas perdidas y facilitar su reencuentro a través de una red de microservicios.

---

## Arquitectura y Patrones de Diseño
El sistema se basa en un patrón de Microservicios, lo que permite que cada módulo (Mascotas, Geolocalización y Motor) sea independiente, facilitando el mantenimiento y la escalabilidad.

### Patrón implementado:
- **Arquitectura de Microservicios:** Cada funcionalidad crítica del sistema reside en un servicio independiente, lo que permite escalabilidad y fallos aislados.

---

## Estrategia de Desarrollo y Arquetipos

**Arquetipo:** Se definió un Arquetipo de Software basado en Node.js y Express para el backend:
- Los microservicios fueron creados a partir de una plantilla estandarizada que ya incluye la estructura de carpetas (`controllers`, `models`, `routes`), configuración de Docker y la suite de pruebas unitarias con Vitest. Esto asegura que cualquier desarrollador pueda entender cualquier servicio del sistema rápidamente.

**Estrategia de Repositorio:** Utilizamos un Monorepositorio para centralizar todos los componentes del sistema (Frontend y Microservicios) en un solo lugar. Esto facilita la gestión de versiones y permite que el despliegue con Docker Compose sea unificado y sencillo.

---

## Configuración de Variables de Entorno
Cree un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_MS_GESTION=https://sanos-y-salvos-gestion-mascotas.onrender.com
NEXT_PUBLIC_MS_GEO=https://sanos-y-salvos-geolocalizacion.onrender.com
NEXT_PUBLIC_MS_MOTOR=https://sanos-y-salvos-motor-coincidencias.onrender.com
```

## Estructura del Repositorio
- `/app`: Páginas y rutas del Frontend (Next.js)
- `/components/Layout`: Navbar y Footer reutilizables
- `/components`: MapaPerdida, Reports, SuccessScreen
- `/ms-gestion-mascotas`: Microservicio de CRUD y MongoDB
- `/ms-geolocalizacion`: Microservicio de conexión con OpenStreetMap
- `/ms-motor-coincidencias`: Lógica de emparejamiento de mascotas perdidas

---

## Tecnologías
- **Frontend:** Next.js 16.2.7, React 19, Tailwind CSS 4
- **Mapas:** Leaflet 1.9 + React-Leaflet 5.0
- **Backend:** Node.js 20, Express
- **Base de Datos:** MongoDB 7.2
- **Contenedores:** Docker & Docker Compose
- **Pruebas:** Vitest & Mongo Memory Server

---

## Repositorios

1. **Repositorio Principal (Monorepo):**
   https://github.com/Alexander1-svg/Sanos-y-Salvos
   Contiene el orquestador Docker, el Frontend y los 3 microservicios.

2. **Microservicios:**
   - Gestión: `/ms-gestion-mascotas`
   - Geolocalización: `/ms-geolocalizacion`
   - Motor: `/ms-motor-coincidencias`

---

## Instalación y Ejecución

### 1. Requisitos Previos
- **Docker Desktop** (indispensable para la base de datos y microservicios)
- **Node.js v20+** (incluye NPM)

### 2. Instalar dependencias
```bash
npm install
```

### 3. Levantar infraestructura (Backend & DB)
```bash
docker compose up -d --build
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

### 5. Pruebas unitarias
Las pruebas se ejecutan con Vitest y cubren los componentes del Frontend. Para correrlas:

```bash
npx vitest
```

Los componentes testeados son:
- `Navbar`
- `Footer`
- `Reports` (formulario de reporte)
- `SuccessScreen`
- `MapaPerdida`
