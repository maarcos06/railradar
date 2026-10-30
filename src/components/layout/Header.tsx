'use client';

import React from 'react';
import { TrainFeedMetadata } from '@/types/train';
import { 
  Radio, 
  RefreshCw, 
  Search, 
  ListFilter, 
  Info, 
  Zap, 
  Train as TrainIcon,
  Layers
} from 'lucide-react';

interface HeaderProps {
  meta: TrainFeedMetadata | null;
  totalVisible: number;
  highSpeedCount: number;
  secondsAgo: number;
  onRefresh: () => void;
  isSearchOpen: boolean;
  onToggleSearch: () => void;
  isListOpen: boolean;
  onToggleList: () => void;
  onOpenAbout: () => void;
  onOpenLayers: () => void;
}

export function Header({
  meta,
  totalVisible,
  highSpeedCount,
  secondsAgo,
  onRefresh,
  isSearchOpen,
  onToggleSearch,
  isListOpen,
  onToggleList,
  onOpenAbout,
  onOpenLayers,
}: HeaderProps) {
  const isOnline = meta?.status === 'ONLINE';
  const isDegraded = meta?.status === 'DEGRADED';

  return (
    <header className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
      {/* Brand & Status Pill */}
      <div className="flex items-center gap-3 bg-radar-panel/90 backdrop-blur-md border border-radar-border px-3.5 py-2 rounded-xl shadow-xl pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <TrainIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold tracking-wider text-base text-white">RAILRADAR</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                ESPAÑA
              </span>
            </div>
            <p className="text-[11px] text-gray-400 leading-tight mt-0.5 hidden sm:block">
              Tracking ferroviario en tiempo real
            </p>
          </div>
        </div>

        <div className="h-5 w-px bg-radar-border hidden sm:block" />

        {/* Live Status indicator */}
        <div className="flex items-center gap-2 text-xs">
          <span className="relative flex h-2.5 w-2.5">
            {isOnline && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isOnline
                  ? 'bg-emerald-500 shadow-emerald-500/50'
                  : isDegraded
                  ? 'bg-amber-500 shadow-amber-500/50'
                  : 'bg-red-500 shadow-red-500/50'
              }`}
            />
          </span>
          <span className="hidden md:inline text-gray-300 font-medium">
            {isOnline ? 'EN VIVO' : isDegraded ? 'DEGRADADO' : 'SIN SEÑAL'}
          </span>
          <span className="text-[11px] text-gray-400 font-mono hidden md:inline">
            ({secondsAgo}s)
          </span>
        </div>
      </div>

      {/* Counters & Action Buttons */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Quick Counters */}
        <div className="hidden lg:flex items-center gap-2 bg-radar-panel/90 backdrop-blur-md border border-radar-border px-3 py-1.5 rounded-xl shadow-xl text-xs">
          <div className="flex items-center gap-1.5 text-gray-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Trenes en radar:</span>
            <span className="font-bold text-white font-mono bg-cyan-950/60 px-1.5 py-0.5 rounded text-cyan-300">
              {totalVisible}
            </span>
          </div>
          <div className="h-3.5 w-px bg-radar-border" />
          <div className="flex items-center gap-1.5 text-gray-300">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>Alta Velocidad:</span>
            <span className="font-bold text-purple-300 font-mono bg-purple-950/60 px-1.5 py-0.5 rounded">
              {highSpeedCount}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 bg-radar-panel/90 backdrop-blur-md border border-radar-border p-1 rounded-xl shadow-xl">
          <button
            onClick={onToggleSearch}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium ${
              isSearchOpen
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-gray-300 hover:text-white hover:bg-radar-card'
            }`}
            title="Buscar y filtrar trenes"
            aria-label="Buscar"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Buscar</span>
          </button>

          <button
            onClick={onToggleList}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium ${
              isListOpen
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-gray-300 hover:text-white hover:bg-radar-card'
            }`}
            title="Ver lista de trenes"
            aria-label="Lista de trenes"
          >
            <ListFilter className="w-4 h-4" />
            <span className="hidden sm:inline">Flota</span>
          </button>

          <button
            onClick={onOpenLayers}
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-radar-card transition-colors"
            title="Capas del mapa (vías Adif, estaciones)"
            aria-label="Capas"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={onRefresh}
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-radar-card transition-colors"
            title="Actualizar datos ahora"
            aria-label="Actualizar"
          >
            <RefreshCw className="w-4 h-4 hover:rotate-180 transition-transform duration-500" />
          </button>

          <button
            onClick={onOpenAbout}
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-radar-card transition-colors"
            title="Acerca de RailRadar y fuentes de datos"
            aria-label="Información"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

