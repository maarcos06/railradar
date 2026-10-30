'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTrains } from '@/hooks/useTrains';
import { useTrainFilters } from '@/hooks/useTrainFilters';
import { Header } from '@/components/layout/Header';
import { StatusBar } from '@/components/layout/StatusBar';
import { TrainDetails } from '@/components/panels/TrainDetails';
import { SearchPanel } from '@/components/panels/SearchPanel';
import { TrainList } from '@/components/panels/TrainList';
import { AboutModal } from '@/components/panels/AboutModal';
import { LayersModal, MapLayerSettings } from '@/components/panels/LayersModal';
import { Train } from '@/types/train';
import { Radio } from 'lucide-react';

// Dynamic import with SSR disabled for Leaflet map
const DynamicTrainMap = dynamic(
  () => import('@/components/map/TrainMap').then((mod) => mod.TrainMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-radar-dark text-cyan-400 gap-3">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
          <Radio className="w-6 h-6 text-cyan-400 absolute animate-pulse" />
        </div>
        <p className="text-xs font-mono tracking-widest uppercase text-gray-400">
          Iniciando Radar Ferroviario...
        </p>
      </div>
    ),
  }
);

export default function HomePage() {
  const {
    trains,
    meta,
    loading,
    error,
    selectedTrain,
    setSelectedTrainId,
    refetch,
    secondsAgo,
  } = useTrains();

  const {
    filters,
    setFilters,
    filteredTrains,
    stats,
    resetFilters,
  } = useTrainFilters(trains);

  // Modals & panels state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);

  // Layer settings
  const [mapSettings, setMapSettings] = useState<MapLayerSettings>({
    baseMap: 'dark',
    showRailwayTracks: true, // Active by default so railway lines are immediately visible
    showMajorStations: false,
    showTrainLabels: false,
  });

  const handleSelectTrain = (train: Train) => {
    setSelectedTrainId(train.id);
  };

  const handleDeselectTrain = () => {
    setSelectedTrainId(null);
  };

  const hasActiveFilters =
    Boolean(filters.searchQuery) ||
    filters.category !== 'ALL' ||
    filters.operator !== 'ALL' ||
    filters.serviceTypes.length > 0 ||
    filters.onlyMoving ||
    filters.onlyDelayed;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-radar-dark select-none">
      {/* Top Header */}
      <Header
        meta={meta}
        totalVisible={filteredTrains.length}
        highSpeedCount={stats.highSpeed}
        secondsAgo={secondsAgo}
        onRefresh={refetch}
        isSearchOpen={isSearchOpen}
        onToggleSearch={() => {
          setIsSearchOpen((prev) => !prev);
          setIsListOpen(false);
        }}
        isListOpen={isListOpen}
        onToggleList={() => {
          setIsListOpen((prev) => !prev);
          setIsSearchOpen(false);
        }}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenLayers={() => setIsLayersOpen(true)}
      />

      {/* Main Full-Screen Radar Map */}
      <div className="absolute inset-0 z-0">
        <DynamicTrainMap
          trains={filteredTrains}
          selectedTrain={selectedTrain}
          onSelectTrain={handleSelectTrain}
          onDeselectTrain={handleDeselectTrain}
          settings={mapSettings}
        />
      </div>

      {/* Selected Train Details Panel */}
      {selectedTrain && (
        <TrainDetails
          train={selectedTrain}
          onClose={handleDeselectTrain}
          onCenterMap={handleSelectTrain}
        />
      )}

      {/* Search & Filter Floating Panel */}
      {isSearchOpen && (
        <SearchPanel
          filters={filters}
          setFilters={setFilters}
          stats={stats}
          onClose={() => setIsSearchOpen(false)}
          onReset={resetFilters}
        />
      )}

      {/* Train Fleet List Floating Sidebar */}
      {isListOpen && (
        <TrainList
          trains={filteredTrains}
          selectedTrainId={selectedTrain?.id || null}
          onSelectTrain={handleSelectTrain}
          onClose={() => setIsListOpen(false)}
        />
      )}

      {/* About Modal */}
      {isAboutOpen && <AboutModal onClose={() => setIsAboutOpen(false)} />}

      {/* Layers & Map Settings Modal */}
      {isLayersOpen && (
        <LayersModal
          settings={mapSettings}
          onUpdateSettings={setMapSettings}
          onClose={() => setIsLayersOpen(false)}
        />
      )}

      {/* Error or Degraded Status Toast */}
      {error && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1050] bg-amber-950/90 border border-amber-700/80 text-amber-200 px-4 py-2 rounded-xl text-xs shadow-2xl backdrop-blur-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{error}</span>
        </div>
      )}

      {/* Bottom Status & Attribution Bar */}
      <StatusBar
        totalTrains={trains.length}
        filteredCount={filteredTrains.length}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={resetFilters}
        onOpenAbout={() => setIsAboutOpen(true)}
      />
    </main>
  );
}

