import { NextResponse } from 'next/server';
import { getStaticData } from '@/lib/staticData';

export const dynamic = 'force-dynamic';

// Major Spanish high-speed & nodal stations with verified coordinates
const MAJOR_STATION_CODES = [
  '17000', // Madrid-Chamartín-Clara Campoamor
  '18000', // Madrid-Atocha Cercanías / Puerta de Atocha
  '71801', // Barcelona-Sants
  '60911', // Valencia Joaquín Sorolla
  '51203', // Sevilla-Santa Justa
  '04040', // Zaragoza-Delicias
  '02003', // Antequera-Santa Ana
  '02030', // Antequera AV
  '54413', // Málaga María Zambrano
  '60000', // Alicante Terminal
  '31400', // Valladolid-Campo Grande
  '14201', // Santander
  '11200', // Miranda de Ebro
  '13200', // Bilbao Abando
  '11511', // San Sebastián-Donostia
  '15100', // León
  '22100', // Ourense
  '23004', // A Coruña
  '22303', // Vigo Guixar / Urzaiz
  '37606', // Badajoz
  '37500', // Mérida
  '03100', // Jaén
  '05000', // Córdoba
  '01005', // Marchena
  '79009', // Girona
  '79400', // Figueres-Vilafant
  '78800', // Camp de Tarragona
  '65000', // Castellón de la Plana
  '62100', // Albacete Los Llanos
  '40100', // Ciudad Real
  '40200', // Puertollano
  '10600', // Segovia Guiomar
  '08240', // Medina del Campo AV
  '30200', // Zamora
];

export async function GET() {
  const { stationsMap } = getStaticData();
  const majorStations = MAJOR_STATION_CODES.map((code) => {
    const s = stationsMap[code];
    return {
      id: code,
      name: s?.name || `Estación ${code}`,
      lat: s?.lat ?? null,
      lon: s?.lon ?? null,
    };
  }).filter((s) => s.lat !== null && s.lon !== null);

  return NextResponse.json(majorStations, {
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

