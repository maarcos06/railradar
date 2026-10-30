export const CONFIG = {
  app: {
    name: 'RailRadar España',
    version: '1.0.0',
    description: 'Seguimiento de trenes en tiempo real sobre la red ferroviaria española',
  },
  renfe: {
    vehiclePositionsUrl: 'https://gtfsrt.renfe.com/vehicle_positions_LD.json',
    tripUpdatesUrl: 'https://gtfsrt.renfe.com/trip_updates_LD.json',
    openDataPortalUrl: 'https://data.renfe.com/',
    datasetPositionsUrl: 'https://data.renfe.com/dataset/posicion-vehiculos-av-ld-md',
    datasetTripsUrl: 'https://data.renfe.com/dataset/horarios-viaje-alta-velocidad-larga-media-distancia',
    license: 'Creative Commons Attribution 4.0 (CC BY 4.0)',
    pollIntervalSeconds: 15,
    requestTimeoutMs: 8000,
  },
  cache: {
    trainsTtlSeconds: 12,
    staleThresholdMinutes: 3,
  },
  map: {
    initialCenter: [40.4168, -3.7038] as [number, number], // Madrid
    initialZoom: 6,
    minZoom: 5,
    maxZoom: 19, // Deep zoom into railway tracks and stations
    tileLayers: {
      // 1. Radar Dark (100% free, no API key, no watermark)
      dark: {
        name: 'Radar Nocturno Ferroviario',
        base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        labels: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, HERE, Garmin &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
      // 2. OpenStreetMap Standard (100% free, no API key, official geography)
      osm: {
        name: 'OpenStreetMap Cartografía Oficial',
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
      // 3. Real Satellite / Aerial Orthophoto (100% free, real railway corridors)
      satellite: {
        name: 'Satélite / Ortofoto Aérea',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics',
      },
      // Dedicated High-Resolution Railway Infrastructure Overlay (OpenRailwayMap)
      railway: {
        name: 'Red de Vías Ferroviarias (OpenRailwayMap)',
        url: 'https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c'],
        attribution: 'Vías &copy; <a href="https://www.openrailwaymap.org/">OpenRailwayMap</a>',
      },
    },
  },
};
