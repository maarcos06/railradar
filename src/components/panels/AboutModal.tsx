'use client';

import React from 'react';
import { X, ExternalLink, ShieldCheck, Database, Info, Train } from 'lucide-react';
import { CONFIG } from '@/lib/config';

interface AboutModalProps {
  onClose: () => void;
}

export function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-radar-panel border border-radar-border w-full max-w-lg rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-radar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Train className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Acerca de RailRadar España</h3>
              <p className="text-[11px] text-gray-400">Transparencia, fuentes de datos y licencias</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-radar-card"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable text */}
        <div className="py-4 space-y-4 overflow-y-auto text-xs text-gray-300 leading-relaxed">
          <section>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5 mb-1.5">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>¿Qué es RailRadar España?</span>
            </h4>
            <p>
              RailRadar España es una plataforma web interactiva inspirada en los radares de tráfico en tiempo real, diseñada para visualizar la circulación de los convoyes de la red ferroviaria española directamente sobre el mapa utilizando coordenadas GPS y telemetría real.
            </p>
          </section>

          <section className="bg-radar-card/80 p-3.5 rounded-xl border border-radar-border space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Fuentes de Datos Oficiales</span>
            </h4>
            <p>
              Esta aplicación consume directamente los conjuntos de datos en tiempo real (GTFS-Realtime) y estáticos del portal oficial de datos abiertos de Renfe:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              <li>
                <strong>Posición de vehículos (AV, LD, MD):</strong> Feeds GTFS-RT de telemetría y geoposicionamiento GPS actualizados aproximadamente cada 15 segundos.
              </li>
              <li>
                <strong>Horarios de viaje (Trip Updates):</strong> Feeds de actualizaciones en tiempo real sobre paradas, estimaciones de llegada y retrasos acumulados.
              </li>
              <li>
                <strong>Horarios de alta velocidad, larga y media distancia (GTFS estático):</strong> Relaciona cada servicio con sus cabeceras (origen y destino) y tipos de servicio comercial.
              </li>
            </ul>
          </section>

          <section className="bg-purple-950/30 p-3.5 rounded-xl border border-purple-800/40 space-y-1.5">
            <h4 className="text-sm font-bold text-purple-300">
              Cobertura y Operadores (Ouigo / iryo)
            </h4>
            <p className="text-gray-300">
              Actualmente, los operadores privados <strong>OUIGO España</strong> e <strong>iryo</strong> (ILSA) no proporcionan un feed público abierto de telemetría GPS en tiempo real para la comunidad de desarrolladores. La arquitectura de RailRadar España está diseñada para federar múltiples operadores de forma modular tan pronto como existan fuentes abiertas disponibles.
            </p>
            <p className="text-[11px] text-purple-400 font-medium">
              * En cumplimiento estricto con los principios de fidelidad de datos, RailRadar España nunca genera trenes ficticios ni simula posiciones no fundamentadas en señales reales.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Atribución y Licencias</span>
            </h4>
            <p>
              Los datos ferroviarios proceden de <strong>Renfe Operadora</strong> a través de su portal oficial <em>Renfe Data</em>, bajo licencia <strong>Creative Commons Reconocimiento 4.0 Internacional (CC BY 4.0)</strong>.
            </p>
            <p>
              Cartografía base proporcionada por <strong>Esri</strong> y colaboradores de <strong>OpenStreetMap</strong>. Capa de infraestructuras ferroviarias y trazado de vías cortesía de <strong>OpenRailwayMap</strong>.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-radar-border flex items-center justify-between">
          <a
            href={CONFIG.renfe.openDataPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
          >
            <span>Ir a data.renfe.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

