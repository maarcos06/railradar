'use client';

import React, { useEffect } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js Client Error:', error);
  }, [error]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#0a0e17] text-white p-4">
      <div className="bg-[#151d2e] border border-[#1f293d] rounded-2xl p-6 max-w-md text-center shadow-2xl space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-800 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Error en el radar</h2>
          <p className="text-xs text-gray-400 mt-1">
            Se ha producido un problema al renderizar el mapa interactivo.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-600/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Recargar Radar</span>
        </button>
      </div>
    </div>
  );
}

