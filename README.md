# 🐾 Sanos y Salvos - Fundación de Rescate Animal 🐾

Este es el repositorio del **Frontend** de la plataforma "Sanos y Salvos", desarrollado con **Next.js**. El sistema permite reportar mascotas perdidas y facilitar su reencuentro a través de una red de microservicios.

---

## Arquitectura y Patrones de Diseño
El sistema se basa en un patrón de Microservicios, lo que permite que cada módulo (Mascotas, Geolocalización y Motor) sea independiente, facilitando el mantenimiento y la escalabilidad.

### Patron implementado:
- Arquitectura de Microservicios: Cada funcionalidad crítica del sistema "Sanos y Salvos" reside en un servicio independiente, lo que permite escalabilidad y fallos aislados.

---

## Estrategia de Desarrollo y Arquetipos:
El proyecto se gestiona bajo los siguientes estándares:

**Nuestro Arquetipo:** Se definió un Arquetipo de Software basado en Node.js y Express para el backend:
- Los microservicios fueron creados a partir de una plantilla estandarizada que ya incluye la estructura de carpetas (controllers, models, routes), configuración de Docker y la suite de pruebas unitarias con Jest. Esto asegura que cualquier desarrollador pueda entender cualquier servicio del sistema rápidamente.

**Estrategia de Repositorio:** Utilizamos un Monorepositorio para centralizar todos los componentes del sistema (Frontend y Microservicios) en un solo lugar. Esto facilita la gestión de versiones y permite que el despliegue con Docker Compose sea unificado y sencillo.

---

## Configuración de Variables de Entorno
Cree un archivo `.env.local` en la raíz del proyecto con las siguientes rutas para conectar los microservicios:

- `NEXT_PUBLIC_MS_GESTION`: http://localhost:3001
- `NEXT_PUBLIC_MS_GEO`: http://localhost:3002
- `NEXT_PUBLIC_MS_MOTOR`: http://localhost:3003

---

## Estructura del Repositorio
- `/app`: Páginas y rutas del Frontend (Next.js).
- `/components`: Componentes reutilizables de la interfaz.
- `/ms-gestion-mascotas`: Microservicio de CRUD y MongoDB.
- `/ms-geolocalizacion`: Microservicio de conexión con OpenStreetMap.
- `/ms-motor-coincidencias`: Lógica de emparejamiento de mascotas perdidas.

---

## Tecnologías
- **Frontend:** Next.js 16.2.4, Tailwind CSS.
- **Backend:** Node.js, Express.
- **Base de Datos:** MongoDB.
- **Contenedores:** Docker & Docker Compose.
- **Pruebas:** Jest & Mongo Memory Server.

---

## Archivo Complementario: `repositorios.txt`

Sanos y Salvos - Enlaces de Repositorios

1. Repositorio Principal (Monorepo):
   https://github.com/Alexander1-svg/Sanos-y-Salvos
   Contiene el orquestador Docker, el Frontend/BFF y los 3 microservicios.

2. Componente Frontend & BFF:
   https://github.com/tu-usuario/Sanos-y-Salvos/tree/main/app
   Contiene la interfaz de usuario y la lógica de consumo de servicios.

3. Microservicios:
   - Gestión: https://github.com/tu-usuario/Sanos-y-Salvos/tree/main/ms-gestion-mascotas
   - Geolocalización: https://github.com/tu-usuario/Sanos-y-Salvos/tree/main/ms-geolocalizacion
   - Motor: https://github.com/tu-usuario/Sanos-y-Salvos/tree/main/ms-motor-coincidencias

---

## Instalación y Ejecución

### 1. Requisitos Previos
- **Docker Desktop** (Indispensable para la base de datos y microservicios).
- **Node.js v18+** (Incluye NPM).

### 2. Dependencias
Para instalar las librerías necesarias del proyecto, ejecute en la raíz:
```bash
npm install
```

### 3. Despliegue de Infraestructura (Backend & DB)
Para levantar los microservicios y la base de datos MongoDB en contenedores:
```bash
docker compose up -d --build
```

### 4. Encender el servidor
Para iniciar el entorno de desarrollo del Frontend:
```bash
npm run dev
```

### 5. Pruebas unitarias
Cada componente backend incluye una suite de pruebas unitarias. Para ejecutarlas, entre a la carpeta del microservicio y ejecute:
#Ejemplo para el microservicio de gestión
```bash
cd ms-gestion-mascotas
npm test
```
