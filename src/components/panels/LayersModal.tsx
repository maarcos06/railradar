'use client';

import React from 'react';
import { X, Layers, Train, Map, Globe, Building2, Check } from 'lucide-react';

export interface MapLayerSettings {
  baseMap: 'dark' | 'osm' | 'satellite';
  showRailwayTracks: boolean;
  showMajorStations: boolean;
  showTrainLabels: boolean;
}

interface LayersModalProps {
  settings: MapLayerSettings;
  onUpdateSettings: React.Dispatch<React.SetStateAction<MapLayerSettings>>;
  onClose: () => void;
}

export function LayersModal({
  settings,
  onUpdateSettings,
  onClose,
}: LayersModalProps) {
  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-radar-panel border border-radar-border w-full max-w-md rounded-2xl shadow-2xl p-5 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-radar-border">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Capas y Mapa Ferroviario</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-radar-card"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {/* Base Map Style */}
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Map className="w-4 h-4 text-cyan-400" />
              <span>Estilo de Mapa Base (100% Gratuito y sin marcas de agua)</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {/* Dark Radar */}
              <button
                onClick={() => onUpdateSettings((prev) => ({ ...prev, baseMap: 'dark' }))}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                  settings.baseMap === 'dark'
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/20'
                    : 'bg-radar-card border-radar-border text-gray-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 text-left">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#151d2e] border border-cyan-500" />
                  <div>
                    <p className="font-bold">Radar Nocturno (Recomendado)</p>
                    <p className="text-[11px] text-gray-400 font-normal">
                      Fondo oscuro que resalta al máximo las vías y los trenes en circulación.
                    </p>
                  </div>
                </div>
                {settings.baseMap === 'dark' && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
              </button>

              {/* OpenStreetMap Standard */}
              <button
                onClick={() => onUpdateSettings((prev) => ({ ...prev, baseMap: 'osm' }))}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                  settings.baseMap === 'osm'
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/20'
                    : 'bg-radar-card border-radar-border text-gray-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 text-left">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 border border-white" />
                  <div>
                    <p className="font-bold">OpenStreetMap Cartografía Oficial</p>
                    <p className="text-[11px] text-gray-400 font-normal">
                      Mapa estándar con relieve, ciudades, carreteras y geografía completa.
                    </p>
                  </div>
                </div>
                {settings.baseMap === 'osm' && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
              </button>

              {/* Satellite */}
              <button
                onClick={() => onUpdateSettings((prev) => ({ ...prev, baseMap: 'satellite' }))}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                  settings.baseMap === 'satellite'
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/20'
                    : 'bg-radar-card border-radar-border text-gray-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 text-left">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <div>
                    <p className="font-bold">Satélite Real (Ortofoto Aérea)</p>
                    <p className="text-[11px] text-gray-400 font-normal">
                      Imágenes satelitales de alta resolución de las vías y el terreno.
                    </p>
                  </div>
                </div>
                {settings.baseMap === 'satellite' && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
              </button>
            </div>
          </div>

          {/* Overlays */}
          <div className="space-y-2.5 pt-2 border-t border-radar-border">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
              Capas Ferroviarias
            </label>

            {/* OpenRailwayMap tracks */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-radar-card/80 border border-radar-border cursor-pointer hover:bg-radar-card transition-colors">
              <div className="flex items-center gap-2.5">
                <Train className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Red de Vías Ferroviarias (OpenRailwayMap)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Activa
                    </span>
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Líneas de alta velocidad (rojo), convencionales (naranja) y ramales de Adif.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showRailwayTracks}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({ ...prev, showRailwayTracks: e.target.checked }))
                }
                className="w-4 h-4 rounded text-cyan-500 bg-radar-dark border-radar-border focus:ring-0"
              />
            </label>

            {/* Major Stations */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-radar-card/80 border border-radar-border cursor-pointer hover:bg-radar-card transition-colors">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="text-xs font-bold text-white">Estaciones Principales de España</p>
                  <p className="text-[11px] text-gray-400">
                    Nodos clave como Atocha, Chamartín, Sants, Santa Justa, Joaquín Sorolla.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showMajorStations}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({ ...prev, showMajorStations: e.target.checked }))
                }
                className="w-4 h-4 rounded text-cyan-500 bg-radar-dark border-radar-border focus:ring-0"
              />
            </label>
          </div>
        </div>

        <div className="pt-3 border-t border-radar-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-cyan-600/20"
          >
            Aplicar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
