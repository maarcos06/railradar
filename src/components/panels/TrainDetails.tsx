'use client';

import React from 'react';
import { Train } from '@/types/train';
import { 
  X, 
  Crosshair, 
  Navigation, 
  MapPin, 
  Clock, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Gauge
} from 'lucide-react';

interface TrainDetailsProps {
  train: Train | null;
  onClose: () => void;
  onCenterMap: (train: Train) => void;
}

export function TrainDetails({ train, onClose, onCenterMap }: TrainDetailsProps) {
  if (!train) return null;

  // Determine badge color
  const getBadgeClass = () => {
    switch (train.serviceType) {
      case 'AVE':
      case 'AVE INT':
        return 'bg-purple-950/80 text-purple-300 border-purple-700/60';
      case 'AVLO':
        return 'bg-pink-950/80 text-pink-300 border-pink-700/60';
      case 'ALVIA':
      case 'EUROMED':
        return 'bg-blue-950/80 text-blue-300 border-blue-700/60';
      case 'AVANT':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60';
      case 'MD':
      case 'PROXIMDAD':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
      case 'INTERCITY':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/60';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  const isMoving = train.currentStatus === 'IN_TRANSIT_TO';
  const delay = train.delayMinutes;

  return (
    <aside className="absolute top-16 right-3 bottom-12 w-96 max-w-[calc(100vw-24px)] z-[1000] bg-radar-panel/95 backdrop-blur-md border border-radar-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-right duration-200">
      {/* Panel Header */}
      <div className="p-4 border-b border-radar-border flex items-start justify-between gap-3 bg-radar-card/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getBadgeClass()}`}>
              {train.serviceType !== 'DESCONOCIDO' ? train.serviceType : 'TREN'}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Operador: <strong className="text-gray-200">{train.operator}</strong>
            </span>
          </div>
          <h2 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2">
            #{train.trainNumber}
            {train.isStale && (
              <span className="text-[10px] font-sans font-medium px-1.5 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-800 rounded">
                Datos desactualizados
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onCenterMap(train)}
            className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 hover:text-white hover:bg-cyan-600 transition-colors border border-cyan-800/40"
            title="Centrar mapa en este tren"
            aria-label="Centrar en mapa"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-radar-card transition-colors"
            title="Cerrar panel"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Route Card */}
        <div className="bg-radar-card/70 border border-radar-border rounded-xl p-3.5 space-y-3">
          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
            Trayecto del servicio
          </span>

          <div className="relative pl-6 space-y-4">
            {/* Vertical connector line */}
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-emerald-500 rounded" />

            {/* Origin */}
            <div className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-cyan-950" />
              <p className="text-[11px] text-cyan-400 font-semibold uppercase">Origen</p>
              <p className="text-sm font-bold text-white leading-tight">
                {train.origin.name || 'Origen no disponible'}
              </p>
            </div>

            {/* Next Stop if available */}
            {train.nextStop && (
              <div className="relative bg-radar-dark/60 p-2.5 rounded-lg border border-radar-border">
                <span className="absolute -left-6 top-3 w-2.5 h-2.5 rounded-full bg-blue-400 ring-4 ring-blue-950 animate-pulse" />
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-blue-400 font-semibold uppercase">
                    {isMoving ? 'Próxima parada' : 'Parado actualmente en'}
                  </p>
                  {train.nextStop.estimatedArrival && (
                    <span className="text-xs font-mono font-bold text-gray-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {train.nextStop.estimatedArrival}
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-gray-100 leading-tight mt-0.5">
                  {train.nextStop.name}
                </p>
              </div>
            )}

            {/* Destination */}
            <div className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-950" />
              <p className="text-[11px] text-emerald-400 font-semibold uppercase">Destino final</p>
              <p className="text-sm font-bold text-white leading-tight">
                {train.destination.name || 'Destino no disponible'}
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Telemetry & Status Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Movement status */}
          <div className="bg-radar-card/70 border border-radar-border rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Estado</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isMoving ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                }`}
              />
              <span className="text-xs font-bold text-white">
                {isMoving ? 'En circulación' : 'Estacionado'}
              </span>
            </div>
          </div>

          {/* Delay card */}
          <div className="bg-radar-card/70 border border-radar-border rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Puntualidad</span>
            </div>
            <div className="mt-2">
              {delay === null ? (
                <span className="text-xs text-gray-400">Sin estimación</span>
              ) : delay <= 0 ? (
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>En hora</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>+{delay} min retraso</span>
                </div>
              )}
            </div>
          </div>

          {/* Bearing & Heading */}
          <div className="bg-radar-card/70 border border-radar-border rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rumbo</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div
                style={{ transform: `rotate(${train.position.bearing}deg)` }}
                className="w-5 h-5 flex items-center justify-center text-cyan-400 transition-transform duration-300"
              >
                <Navigation className="w-4 h-4 fill-cyan-400" />
              </div>
              <span className="text-xs font-mono font-bold text-white">
                {train.position.bearing}°
              </span>
            </div>
          </div>

          {/* Speed estimation */}
          <div className="bg-radar-card/70 border border-radar-border rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>Velocidad</span>
            </div>
            <div className="mt-2">
              <span className="text-xs font-mono font-bold text-white">
                {train.position.speedKmH !== undefined
                  ? `${train.position.speedKmH} km/h`
                  : isMoving
                  ? 'Calculando...'
                  : '0 km/h'}
              </span>
            </div>
          </div>
        </div>

        {/* GPS Coordinates */}
        <div className="bg-radar-card/70 border border-radar-border rounded-xl p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Coordenadas GPS reales (WGS84)</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono bg-radar-dark/80 px-2.5 py-1.5 rounded border border-radar-border text-gray-300">
            <span>Lat: {train.position.latitude.toFixed(5)}</span>
            <span>Lon: {train.position.longitude.toFixed(5)}</span>
          </div>
        </div>

        {/* Feed Metadata */}
        <div className="text-[11px] text-gray-400 px-1 space-y-1">
          <div className="flex justify-between">
            <span>Trip ID oficial:</span>
            <span className="font-mono text-gray-300 truncate max-w-[180px]">
              {train.tripId || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Última señal:</span>
            <span className="font-mono text-gray-300">
              {new Date(train.timestamp).toLocaleTimeString('es-ES')}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-3 border-t border-radar-border bg-radar-card/50">
        <button
          onClick={() => onCenterMap(train)}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all"
        >
          <Crosshair className="w-4 h-4" />
          <span>Centrar tren en el mapa</span>
        </button>
      </div>
    </aside>
  );
}

