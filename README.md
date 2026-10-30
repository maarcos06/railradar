# 🚄 RailRadar España — Tracking Ferroviario en Tiempo Real

> Plataforma web de monitorización y visualización interactiva de trenes sobre la red ferroviaria española en tiempo real, inspirada en la experiencia de usuario de FlightRadar24.

Desarrollada con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** y **Leaflet**, consumiendo feeds oficiales de telemetría GPS y GTFS-Realtime del portal de datos abiertos de **Renfe Data**.

---

## 🌟 Características Principales

- **🛰️ Datos y Coordenadas GPS 100% Reales:** Conexión directa a los feeds oficiales de Renfe GTFS-RT (*Vehicle Positions* y *Trip Updates*). No se generan posiciones ficticias.
- **🗺️ Mapa Interactivo de Alta Resolución (100% Gratuito y Sin Claves de API):** Cartografía fluida con Leaflet, combinando una base oscura de alta definición (Esri Canvas Dark Gray) o cartografía oficial (OpenStreetMap / Satélite) con la capa oficial de vías de **OpenRailwayMap** activa de forma predeterminada. Sin marcas de agua ni restricciones de pago.
- **🛤️ Trazado de Vías Exacto y Milimétrico:** Las vías de alta velocidad (rojo), convencionales (naranja) y ramales de Adif están trazadas con precisión submétrica (WGS84). Los trenes encajan de manera exacta sobre sus raíles correspondientes en cualquier nivel de zoom (hasta zoom 19).
  - **Alta Velocidad:** AVE, AVLO, AVE Internacional.
  - **Larga Distancia:** Alvia, Euromed, Intercity.
  - **Media Distancia:** Avant, Regionales, Proximidad.
- **📊 Panel Detallado de Telemetría (FlightRadar Style):** Información en tiempo real del convoy seleccionado:
  - Origen y destino oficial de la circulación.
  - Próxima estación y hora estimada de llegada (ETA).
  - Estado operacional (*En circulación* / *Estacionado*).
  - Retraso acumulado en minutos (calculado desde Trip Updates).
  - Rumbo en grados y velocidad estimada en km/h.
  - Coordenadas geográficas exactas (WGS84).
- **🔍 Búsqueda y Filtrado Dinámico:**
  - Búsqueda por número de tren o estación.
  - Filtro por categoría de servicio.
  - Conmutador para ver solo trenes en movimiento o con retraso.
  - Vista de lista completa de la flota activa.
- **🛤️ Capas Ferroviarias Opcionales:**
  - Capa de infraestructura de vías oficiales con **OpenRailwayMap**.
  - Visualización de las principales estaciones ferroviarias nodales de España (Atocha, Chamartín, Sants, Santa Justa, Joaquín Sorolla, Delicias, etc.).
  - Modo Oscuro (Radar) y Modo Claro.
- **⚡ Alto Rendimiento y Resiliencia:**
  - Caché en memoria en el servidor (`MemoryCache`) con TTL de 12 segundos para respetar la frecuencia de actualización de Renfe y evitar saturación.
  - Degradación elegante: Si la fuente externa experimenta microcortes, el sistema sirve las últimas posiciones conocidas indicando el estado *DEGRADADO*.

---

## 🏗️ Arquitectura del Proyecto

```text
railradar-espana/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── trains/route.ts      # Endpoint REST normalizado con caché y filtros
│   │   │   ├── health/route.ts      # Health check del sistema y proveedores
│   │   │   └── stations/route.ts    # Catálogo de estaciones principales
│   │   ├── layout.tsx               # Root layout, metadatos y fuentes
│   │   ├── page.tsx                 # Dashboard principal y orquestación
│   │   └── globals.css              # Estilos radar, Leaflet y animaciones
│   │
│   ├── components/
│   │   ├── map/
│   │   │   ├── TrainMap.tsx         # Contenedor Leaflet (SSR false)
│   │   │   ├── TrainMarker.tsx      # Icono SVG aerodinámico orientado por rumbo
│   │   │   └── MapControls.tsx      # Controles de vista de España y zoom
│   │   ├── panels/
│   │   │   ├── TrainDetails.tsx     # Panel lateral de telemetría del tren
│   │   │   ├── TrainList.tsx        # Panel de flota activa
│   │   │   ├── SearchPanel.tsx      # Buscador y filtros de categoría
│   │   │   ├── LayersModal.tsx      # Selector de capas (vías, estaciones, tema)
│   │   │   └── AboutModal.tsx       # Transparencia, fuentes y licencias
│   │   └── layout/
│   │       ├── Header.tsx           # Barra superior con estado en vivo y contadores
│   │       └── StatusBar.tsx        # Barra inferior de atribución y estado
│   │
│   ├── services/
│   │   ├── providers/
│   │   │   ├── renfe.ts             # Ingesta y normalización de Renfe GTFS-RT
│   │   │   └── types.ts             # Interfaz extensible TrainDataProvider
│   │   └── trainService.ts          # Servicio de orquestación y caché
│   │
│   ├── lib/
│   │   ├── config.ts                # Configuración de URLs y parámetros
│   │   ├── cache.ts                 # Caché en memoria y tracking de historial
│   │   └── geo.ts                   # Cálculo de distancias (Haversine), rumbos y velocidad
│   │
│   ├── hooks/
│   │   ├── useTrains.ts             # Hook con polling cada 15s y estado reactivo
│   │   └── useTrainFilters.ts       # Hook de filtrado reactivo y estadísticas
│   │
│   ├── types/
│   │   └── train.ts                 # Modelos de datos TypeScript tipados estrictamente
│   │
│   └── data/                        # Metadatos estáticos GTFS precompilados
│       ├── stations.json            # Diccionario de 1.006 estaciones españolas
│       ├── routes.json              # Mapeo de rutas y servicios
│       └── trips.json               # Relación de viajes y números de tren
│
├── tests/
│   ├── geo.test.ts                  # Tests de cálculos geoespaciales y límites de España
│   ├── renfe_normalizer.test.ts     # Tests de deduplicación y categorización
│   ├── filters.test.ts              # Tests de búsqueda y filtros reactivos
│   └── api_resilience.test.ts       # Tests de caché, caducidad y fallback
│
├── public/                          # Favicon e iconos estáticos
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vitest.config.ts
└── README.md
```

---

## 📡 Fuentes de Datos y Cobertura

### 1. Conjuntos de datos utilizados (Renfe Data)
- **Posición de vehículos (Alta Velocidad, Larga Distancia y Media Distancia):**
  - URL de consulta: `https://gtfsrt.renfe.com/vehicle_positions_LD.json`
  - Frecuencia oficial de refresco: Cada **15 segundos**.
- **Horarios de viaje (Trip Updates):**
  - URL de consulta: `https://gtfsrt.renfe.com/trip_updates_LD.json`
  - Frecuencia oficial de refresco: Cada **30 segundos**.
- **Horarios estáticos (GTFS Timetable):**
  - Recurso oficial de Renfe Data para cruce de cabeceras, servicios comerciales y estaciones.

### 2. Situación de otros operadores (OUIGO e iryo)
- **OUIGO España** e **iryo** (ILSA) actualmente **no publican feeds abiertos de telemetría GTFS-RT con coordenadas GPS en tiempo real** para desarrolladores externos.
- La arquitectura de **RailRadar España** utiliza el patrón `TrainDataProvider`, lo que permite incorporar estos operadores en el momento en que sus datos de posicionamiento sean accesibles públicamente o a través del Punto de Acceso Nacional (NAP).
- **Principio ético y de fidelidad:** No se simulan ni inventan posiciones de trenes privados sin señal real verificable.

### 3. Licencias y Atribución
- Datos ferroviarios: **Renfe Operadora** bajo licencia [Creative Commons Reconocimiento 4.0 Internacional (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
- Cartografía: **CARTO** y contribuidores de **OpenStreetMap**.
- Red de vías: Proyecto **OpenRailwayMap**.

---

## 🚀 Instalación y Ejecución Local

### Requisitos previos
- **Node.js** v18 o superior (v20+ / v22 LTS recomendado).
- Gestor de paquetes **npm**.

### 1. Clonar o acceder al proyecto
```bash
cd proyecto_tren
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```
La aplicación estará disponible inmediatamente en `http://localhost:3000`.

### 4. Ejecutar pruebas automatizadas
```bash
npm test
```
Ejecuta la suite de pruebas unitarias y de integración con **Vitest**.

### 5. Compilar para producción
```bash
npm run build
```

### 6. Ejecutar en producción
```bash
npm run start
```

---

## ☁️ Despliegue en Vercel u otras plataformas

El proyecto está listo para ser desplegado sin configuración adicional en **Vercel**, **Netlify** o cualquier contenedor Docker/Node.js:

1. Conecta el repositorio Git a **Vercel**.
2. Framework Preset: **Next.js**.
3. Build Command: `next build`.
4. Output Directory: `.next`.
5. Pulsa **Deploy**.

Las rutas API (`/api/trains`, `/api/health`, `/api/stations`) operan como funciones serverless compatibles con edge caching mediante los headers `Cache-Control: public, s-maxage=10, stale-while-revalidate=20`.

---

## 🛡️ Fiabilidad y Tratamiento de Errores

| Escenario | Comportamiento del Sistema |
| :--- | :--- |
| **Petición concurrida masiva** | La caché en memoria (`MemoryCache`) responde en <1 ms, evitando peticiones redundantes a Renfe. |
| **Microcorte en feed de Renfe** | Se sirven los datos cacheados con indicador de estado `DEGRADADO`. |
| **Caída prolongada de la fuente** | La app muestra un aviso explícito en pantalla indicando `SIN SEÑAL / OFFLINE`, sin mostrar trenes ficticios. |
| **Coordenadas erróneas o nulas** | Se descartan mediante `isValidSpainCoordinate()`. |
| **Registros duplicados en feed** | Se filtran por identificador de vehículo único. |

#   r a i l r a d a r  
 