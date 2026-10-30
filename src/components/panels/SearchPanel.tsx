'use client';

import React from 'react';
import { FilterState } from '@/hooks/useTrainFilters';
import { ServiceCategory } from '@/types/train';
import { Search, X, Zap, Navigation2, Check, RotateCcw } from 'lucide-react';

interface SearchPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  stats: {
    total: number;
    highSpeed: number;
    longDistance: number;
    mediumDistance: number;
    regional: number;
    moving: number;
    delayed: number;
  };
  onClose: () => void;
  onReset: () => void;
}

const CATEGORIES: { id: ServiceCategory; label: string; countKey: keyof SearchPanelProps['stats'] }[] = [
  { id: 'ALL', label: 'Todos', countKey: 'total' },
  { id: 'HIGH_SPEED', label: 'Alta Velocidad', countKey: 'highSpeed' },
  { id: 'LONG_DISTANCE', label: 'Larga Distancia', countKey: 'longDistance' },
  { id: 'MEDIUM_DISTANCE', label: 'Media Distancia', countKey: 'mediumDistance' },
  { id: 'REGIONAL', label: 'Regionales', countKey: 'regional' },
];

export function SearchPanel({
  filters,
  setFilters,
  stats,
  onClose,
  onReset,
}: SearchPanelProps) {
  return (
    <div className="absolute top-16 left-3 w-96 max-w-[calc(100vw-24px)] z-[1000] bg-radar-panel/95 backdrop-blur-md border border-radar-border rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-left duration-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-cyan-400" />
          <span>Búsqueda y Filtros de Trenes</span>
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={onReset}
            className="p-1.5 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-radar-card transition-colors flex items-center gap-1"
            title="Restablecer filtros"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-radar-card transition-colors"
            title="Cerrar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
          placeholder="Número de tren (ej: 05152), estación u origen..."
          className="w-full bg-radar-dark border border-radar-border rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors font-sans"
        />
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        {filters.searchQuery && (
          <button
            onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
            className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Service Category Buttons */}
      <div className="mb-4">
        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
          Categoría de servicio
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.id;
            const count = stats[cat.countKey];

            return (
              <button
                key={cat.id}
                onClick={() => setFilters((prev) => ({ ...prev, category: cat.id }))}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-radar-card text-gray-300 hover:bg-gray-800 hover:text-white border border-radar-border'
                }`}
              >
                {cat.id === 'HIGH_SPEED' && <Zap className="w-3 h-3 text-purple-300" />}
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                  isSelected ? 'bg-cyan-700 text-white' : 'bg-gray-800 text-gray-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Operator Filter */}
      <div className="mb-4">
        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
          Operador ferroviario
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setFilters((prev) => ({ ...prev, operator: 'ALL' }))}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
              filters.operator === 'ALL'
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60'
                : 'bg-radar-card text-gray-400 border-radar-border hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, operator: 'Renfe' }))}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
              filters.operator === 'Renfe'
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60'
                : 'bg-radar-card text-gray-400 border-radar-border hover:text-white'
            }`}
          >
            Renfe (Oficial)
          </button>
        </div>
        <p className="text-[10px] text-gray-500 mt-1 italic">
          * Ouigo e Iryo no ofrecen feeds públicos de telemetría GPS en tiempo real.
        </p>
      </div>

      {/* Quick Toggles */}
      <div className="space-y-2 pt-2 border-t border-radar-border">
        <label
          className="flex items-center justify-between p-2 rounded-lg bg-radar-card/60 hover:bg-radar-card cursor-pointer border border-radar-border text-xs transition-colors"
        >
          <span className="flex items-center gap-2 text-gray-200">
            <Navigation2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Solo trenes en movimiento</span>
          </span>
          <input
            type="checkbox"
            checked={filters.onlyMoving}
            onChange={(e) => setFilters((prev) => ({ ...prev, onlyMoving: e.target.checked }))}
            className="w-4 h-4 rounded text-cyan-500 bg-radar-dark border-radar-border focus:ring-0 focus:ring-offset-0"
          />
        </label>

        <label
          className="flex items-center justify-between p-2 rounded-lg bg-radar-card/60 hover:bg-radar-card cursor-pointer border border-radar-border text-xs transition-colors"
        >
          <span className="flex items-center gap-2 text-gray-200">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Solo trenes con retraso</span>
          </span>
          <input
            type="checkbox"
            checked={filters.onlyDelayed}
            onChange={(e) => setFilters((prev) => ({ ...prev, onlyDelayed: e.target.checked }))}
            className="w-4 h-4 rounded text-cyan-500 bg-radar-dark border-radar-border focus:ring-0 focus:ring-offset-0"
          />
        </label>
      </div>
    </div>
  );
}

