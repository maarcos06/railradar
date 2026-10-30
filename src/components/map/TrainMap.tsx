'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Train } from '@/types/train';
import { CONFIG } from '@/lib/config';
import { MapLayerSettings } from '@/components/panels/LayersModal';
import { TrainMarker } from './TrainMarker';
import { MapControls } from './MapControls';

interface StationInfo {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface TrainMapProps {
  trains: Train[];
  selectedTrain: Train | null;
  onSelectTrain: (train: Train) => void;
  onDeselectTrain: () => void;
  settings: MapLayerSettings;
}

// Controller component to smoothly center on selected train
function MapController({
  selectedTrain,
}: {
  selectedTrain: Train | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedTrain) {
      const currentZoom = map.getZoom();
      const targetZoom = Math.max(currentZoom, 13);
      map.flyTo(
        [selectedTrain.position.latitude, selectedTrain.position.longitude],
        targetZoom,
        {
          duration: 1.2,
          easeLinearity: 0.25,
        }
      );
    }
  }, [selectedTrain, map]);

  return null;
}

// Map Click Listener to deselect when clicking on empty map canvas
function MapEvents({ onDeselect }: { onDeselect: () => void }) {
  useMapEvents({
    click: (e) => {
      const target = e.originalEvent.target as HTMLElement;
      if (target.classList.contains('leaflet-container')) {
        onDeselect();
      }
    },
  });
  return null;
}

export function TrainMap({
  trains,
  selectedTrain,
  onSelectTrain,
  onDeselectTrain,
  settings,
}: TrainMapProps) {
  const [stations, setStations] = useState<StationInfo[]>([]);

  const stationIcon = React.useMemo(() => {
    return L.divIcon({
      html: `
        <div style="width: 14px; height: 14px; background: #9333ea; border: 2.5px solid #ffffff; border-radius: 9999px; box-shadow: 0 0 10px rgba(147, 51, 234, 0.9);"></div>
      `,
      className: 'station-node-marker',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
  }, []);

  // Fetch major stations catalog
  useEffect(() => {
    if (settings.showMajorStations && stations.length === 0) {
      fetch('/api/stations')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setStations(data);
        })
        .catch((err) => console.warn('No se pudieron cargar las estaciones:', err));
    }
  }, [settings.showMajorStations, stations.length]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={CONFIG.map.initialCenter}
        zoom={CONFIG.map.initialZoom}
        minZoom={CONFIG.map.minZoom}
        maxZoom={CONFIG.map.maxZoom}
        zoomControl={false}
        className="w-full h-full"
      >
        {/* === BASE MAP TILES (100% Free, No API Key, No Watermark) === */}
        {settings.baseMap === 'dark' && (
          <TileLayer
            key="base-dark"
            url={CONFIG.map.tileLayers.dark.base}
            attribution={CONFIG.map.tileLayers.dark.attribution}
            maxZoom={CONFIG.map.maxZoom}
          />
        )}

        {settings.baseMap === 'osm' && (
          <TileLayer
            key="base-osm"
            url={CONFIG.map.tileLayers.osm.url}
            attribution={CONFIG.map.tileLayers.osm.attribution}
            maxZoom={CONFIG.map.maxZoom}
          />
        )}

        {settings.baseMap === 'satellite' && (
          <TileLayer
            key="base-satellite"
            url={CONFIG.map.tileLayers.satellite.url}
            attribution={CONFIG.map.tileLayers.satellite.attribution}
            maxZoom={CONFIG.map.maxZoom}
          />
        )}

        {/* === DEDICATED RAILWAY TRACKS OVERLAY (OpenRailwayMap - Adif Tracks & High Speed Lines) === */}
        {settings.showRailwayTracks && (
          <TileLayer
            key="overlay-railway"
            url={CONFIG.map.tileLayers.railway.url}
            subdomains={CONFIG.map.tileLayers.railway.subdomains}
            attribution={CONFIG.map.tileLayers.railway.attribution}
            maxZoom={CONFIG.map.maxZoom}
            opacity={settings.baseMap === 'dark' ? 1.0 : 0.9}
            zIndex={10}
          />
        )}

        {/* === CITY / LOCATION LABELS (For dark base map) === */}
        {settings.baseMap === 'dark' && (
          <TileLayer
            key="overlay-dark-labels"
            url={CONFIG.map.tileLayers.dark.labels}
            maxZoom={CONFIG.map.maxZoom}
            opacity={0.85}
            zIndex={15}
          />
        )}

        {/* === MAJOR STATIONS LAYER === */}
        {settings.showMajorStations &&
          stations.map((st) => (
            <Marker
              key={st.id}
              position={[st.lat, st.lon]}
              icon={stationIcon}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                <div className="text-[11px] font-bold text-white bg-purple-950/95 px-2.5 py-1 rounded-md border border-purple-700 shadow-xl">
                  {st.name}
                </div>
              </Tooltip>
            </Marker>
          ))}

        {/* === REAL-TIME TRAIN MARKERS === */}
        {trains.map((train) => (
          <TrainMarker
            key={train.id}
            train={train}
            isSelected={selectedTrain?.id === train.id}
            onSelect={onSelectTrain}
          />
        ))}

        {/* Map View & Click Controller */}
        <MapController selectedTrain={selectedTrain} />
        <MapEvents onDeselect={onDeselectTrain} />
        <MapControls onToggleLegend={() => {}} isLegendOpen={false} />
      </MapContainer>
    </div>
  );
}
