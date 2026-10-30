'use client';

import React from 'react';
import { ShieldCheck, ExternalLink, Filter } from 'lucide-react';
import { CONFIG } from '@/lib/config';

interface StatusBarProps {
  totalTrains: number;
  filteredCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onOpenAbout: () => void;
}

export function StatusBar({
  totalTrains,
  filteredCount,
  hasActiveFilters,
  onClearFilters,
  onOpenAbout,
}: StatusBarProps) {
  return (
    <footer className="absolute bottom-2 left-3 right-3 z-[1000] pointer-events-none flex items-center justify-between gap-2 text-[11px] text-gray-400">
      {/* Active filters pill */}
      <div className="pointer-events-auto">
        {hasActiveFilters && (
          <div className="flex items-center gap-2 bg-radar-panel/90 backdrop-blur-md border border-cyan-800/60 px-2.5 py-1 rounded-lg shadow-lg text-cyan-300">
            <Filter className="w-3 h-3 text-cyan-400" />
            <span>
              Filtro activo: mostrando <strong className="text-white">{filteredCount}</strong> de {totalTrains} trenes
            </span>
            <button
              onClick={onClearFilters}
              className="ml-1 text-xs text-cyan-400 hover:text-white underline font-medium"
            >
              Restablecer
            </button>
          </div>
        )}
      </div>

      {/* Attribution & Data Source */}
      <div className="pointer-events-auto flex items-center gap-3 bg-radar-panel/90 backdrop-blur-md border border-radar-border px-3 py-1 rounded-lg shadow-lg">
        <div className="flex items-center gap-1.5 text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Datos:</span>
          <a
            href={CONFIG.renfe.openDataPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-200 hover:text-cyan-400 inline-flex items-center gap-0.5 font-medium transition-colors"
          >
            Renfe Data (CC BY 4.0)
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        </div>

        <span className="text-radar-border">•</span>

        <span className="text-gray-400 hidden sm:inline">
          Vías: <strong className="text-gray-300">OpenRailwayMap</strong>
        </span>

        <span className="text-radar-border hidden sm:inline">•</span>

        <button
          onClick={onOpenAbout}
          className="hover:text-cyan-400 transition-colors text-gray-300"
        >
          Cobertura y detalles
        </button>
      </div>
    </footer>
  );
}

