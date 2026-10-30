'use client';

import React, { useState } from 'react';
import { Train } from '@/types/train';
import { X, Search, Crosshair, ArrowRight, Activity, Clock } from 'lucide-react';

interface TrainListProps {
  trains: Train[];
  selectedTrainId: string | null;
  onSelectTrain: (train: Train) => void;
  onClose: () => void;
}

export function TrainList({
  trains,
  selectedTrainId,
  onSelectTrain,
  onClose,
}: TrainListProps) {
  const [localSearch, setLocalSearch] = useState('');

  const displayList = localSearch.trim()
    ? trains.filter(
        (t) =>
          t.trainNumber.toLowerCase().includes(localSearch.toLowerCase()) ||
          t.commercialName.toLowerCase().includes(localSearch.toLowerCase()) ||
          t.origin.name.toLowerCase().includes(localSearch.toLowerCase()) ||
          t.destination.name.toLowerCase().includes(localSearch.toLowerCase())
      )
    : trains;

  return (
    <aside className="absolute top-16 left-3 bottom-12 w-96 max-w-[calc(100vw-24px)] z-[1000] bg-radar-panel/95 backdrop-blur-md border border-radar-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-left duration-200">
      {/* Header */}
      <div className="p-4 border-b border-radar-border flex items-center justify-between bg-radar-card/50">
        <div>
          <h3 className="text-sm font-bold text-white">Flota de Trenes</h3>
          <p className="text-[11px] text-gray-400">
            {displayList.length} trenes activos encontrados
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-radar-card transition-colors"
          title="Cerrar lista"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter inside list */}
      <div className="p-3 border-b border-radar-border bg-radar-dark/60">
        <div className="relative">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Filtrar por tren o estación..."
            className="w-full bg-radar-card border border-radar-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>

      {/* List items */}
      <div className="flex-1 overflow-y-auto divide-y divide-radar-border/60">
        {displayList.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs">
            No se han encontrado trenes con ese criterio.
          </div>
        ) : (
          displayList.map((train) => {
            const isSelected = train.id === selectedTrainId;
            const isMoving = train.currentStatus === 'IN_TRANSIT_TO';

            return (
              <div
                key={train.id}
                onClick={() => onSelectTrain(train)}
                className={`p-3 cursor-pointer transition-colors hover:bg-radar-card/80 ${
                  isSelected ? 'bg-cyan-950/40 border-l-4 border-cyan-400' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs text-white">
                      #{train.trainNumber}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-gray-800 text-gray-300">
                      {train.serviceType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    {train.delayMinutes !== null && train.delayMinutes > 0 && (
                      <span className="text-amber-400 font-mono font-semibold flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        +{train.delayMinutes}m
                      </span>
                    )}
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        isMoving ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                      title={isMoving ? 'En movimiento' : 'Estacionado'}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-gray-400 truncate">
                  <span className="truncate text-gray-300">{train.origin.name}</span>
                  <ArrowRight className="w-3 h-3 text-cyan-500 shrink-0" />
                  <span className="truncate text-gray-300">{train.destination.name}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

