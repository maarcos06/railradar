'use client';

import React, { useMemo } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Train } from '@/types/train';

interface TrainMarkerProps {
  train: Train;
  isSelected: boolean;
  onSelect: (train: Train) => void;
}

/**
 * Returns color scheme depending on service type
 */
function getTrainColors(train: Train): { primary: string; secondary: string; shadow: string } {
  switch (train.serviceType) {
    case 'AVE':
    case 'AVE INT':
      return { primary: '#a855f7', secondary: '#7e22ce', shadow: 'rgba(168, 85, 247, 0.6)' };
    case 'AVLO':
      return { primary: '#ec4899', secondary: '#be185d', shadow: 'rgba(236, 72, 153, 0.6)' };
    case 'ALVIA':
    case 'EUROMED':
      return { primary: '#38bdf8', secondary: '#0284c7', shadow: 'rgba(56, 189, 248, 0.6)' };
    case 'AVANT':
      return { primary: '#06b6d4', secondary: '#0e7490', shadow: 'rgba(6, 182, 212, 0.6)' };
    case 'MD':
    case 'PROXIMDAD':
      return { primary: '#10b981', secondary: '#047857', shadow: 'rgba(16, 185, 129, 0.6)' };
    case 'INTERCITY':
      return { primary: '#f59e0b', secondary: '#b45309', shadow: 'rgba(245, 158, 11, 0.6)' };
    default:
      return { primary: '#94a3b8', secondary: '#475569', shadow: 'rgba(148, 163, 184, 0.5)' };
  }
}

export const TrainMarker = React.memo(function TrainMarker({
  train,
  isSelected,
  onSelect,
}: TrainMarkerProps) {
  const { primary, secondary, shadow } = getTrainColors(train);
  const bearing = train.position.bearing || 0;
  const isMoving = train.currentStatus === 'IN_TRANSIT_TO';

  const customIcon = useMemo(() => {
    const pulseRing = isSelected
      ? `<div style="position: absolute; inset: -8px; border-radius: 9999px; border: 2px solid #06b6d4; animation: radar-pulse 1.6s infinite ease-out; pointer-events: none;"></div>
         <div style="position: absolute; inset: -3px; border-radius: 9999px; background: rgba(6, 182, 212, 0.25); pointer-events: none;"></div>`
      : '';

    // Aerodynamic high-speed train top-down silhouette
    const svgIcon = `
      <div style="position: relative; width: 32px; height: 32px; display: flex; items-center; justify-content: center; cursor: pointer;">
        ${pulseRing}
        <div style="transform: rotate(${bearing}deg); transition: transform 0.4s ease-out; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 6px ${shadow});">
            <!-- Train Body -->
            <path d="M16 2 C13 7 11 12 11 22 C11 26 13 28 16 28 C19 28 21 26 21 22 C21 12 19 7 16 2 Z" fill="${primary}" stroke="#ffffff" stroke-width="1.2"/>
            <!-- Cockpit / Windshield -->
            <path d="M14 6 C15 5 17 5 18 6 L18 9 C17 8.5 15 8.5 14 9 Z" fill="#0f172a"/>
            <!-- Roof Streamline Accent -->
            <line x1="16" y1="11" x2="16" y2="24" stroke="${secondary}" stroke-width="1.5" stroke-linecap="round"/>
            <!-- Front Headlights (glow when moving) -->
            ${
              isMoving
                ? `<circle cx="13.5" cy="4.5" r="1.2" fill="#fef08a" />
                   <circle cx="18.5" cy="4.5" r="1.2" fill="#fef08a" />`
                : `<circle cx="13.5" cy="4.5" r="1" fill="#cbd5e1" />
                   <circle cx="18.5" cy="4.5" r="1" fill="#cbd5e1" />`
            }
          </svg>
        </div>
      </div>
    `;

    return L.divIcon({
      html: svgIcon,
      className: 'train-radar-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  }, [bearing, primary, secondary, shadow, isSelected, isMoving]);

  return (
    <Marker
      position={[train.position.latitude, train.position.longitude]}
      icon={customIcon}
      eventHandlers={{
        click: () => onSelect(train),
      }}
    >
      <Tooltip direction="top" offset={[0, -16]} opacity={0.95}>
        <div className="bg-gray-900/95 text-white p-2 rounded-lg text-xs space-y-1 shadow-xl border border-gray-700 min-w-[160px]">
          <div className="flex items-center justify-between gap-2 border-b border-gray-700 pb-1">
            <span className="font-bold font-mono text-cyan-400">
              {train.commercialName}
            </span>
            <span className="text-[10px] px-1 rounded bg-gray-800 text-gray-300">
              {train.serviceType}
            </span>
          </div>

          <p className="text-[11px] text-gray-300 leading-tight">
            {train.origin.name} → {train.destination.name}
          </p>

          <div className="flex items-center justify-between text-[10px] pt-0.5">
            <span className={isMoving ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
              {isMoving ? 'En circulación' : 'Estacionado'}
            </span>
            {train.delayMinutes !== null && train.delayMinutes > 0 ? (
              <span className="text-amber-400 font-mono font-bold">
                +{train.delayMinutes} min
              </span>
            ) : (
              <span className="text-emerald-400">En hora</span>
            )}
          </div>
        </div>
      </Tooltip>
    </Marker>
  );
});

