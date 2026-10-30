'use client';

import React from 'react';
import { useMap } from 'react-leaflet';
import { Maximize2, Plus, Minus } from 'lucide-react';
import { CONFIG } from '@/lib/config';

interface MapControlsProps {
  onToggleLegend: () => void;
  isLegendOpen: boolean;
}

export function MapControls({ onToggleLegend, isLegendOpen }: MapControlsProps) {
  const map = useMap();

  const handleResetView = () => {
    map.flyTo(CONFIG.map.initialCenter, CONFIG.map.initialZoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  };

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="absolute right-3 bottom-14 z-[1000] flex flex-col gap-1.5 pointer-events-auto">
      {/* Reset Spain Bounds */}
      <button
        onClick={handleResetView}
        className="w-9 h-9 rounded-xl bg-radar-panel/90 backdrop-blur-md border border-radar-border text-gray-300 hover:text-white hover:bg-radar-card flex items-center justify-center shadow-xl transition-colors"
        title="Centrar en España"
        aria-label="Centrar en España"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      {/* Zoom In */}
      <button
        onClick={handleZoomIn}
        className="w-9 h-9 rounded-xl bg-radar-panel/90 backdrop-blur-md border border-radar-border text-gray-300 hover:text-white hover:bg-radar-card flex items-center justify-center shadow-xl transition-colors"
        title="Acercar zoom"
        aria-label="Acercar zoom"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Zoom Out */}
      <button
        onClick={handleZoomOut}
        className="w-9 h-9 rounded-xl bg-radar-panel/90 backdrop-blur-md border border-radar-border text-gray-300 hover:text-white hover:bg-radar-card flex items-center justify-center shadow-xl transition-colors"
        title="Alejar zoom"
        aria-label="Alejar zoom"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
}

