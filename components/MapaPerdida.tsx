"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Coordenadas {
  lat: number;
  lng: number;
}

interface Props {
  onUbicacionSeleccionada: (coords: Coordenadas, direccion: string) => void;
}

function ClickHandler({ onClic }: { onClic: (coords: Coordenadas) => void }) {
  useMapEvents({
    click(e) {
      onClic({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

const GEO_API = "http://localhost:3002";

export default function MapaPerdida({ onUbicacionSeleccionada }: Props) {
  const [marcador, setMarcador] = useState<Coordenadas | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState<{ nombre: string; lat: number; lng: number }[]>([]);

  const buscarLugar = async () => {
    if (!busqueda.trim()) return;
    setBuscando(true);
    setSugerencias([]);
    try {
      const res = await fetch(`${GEO_API}/buscar?q=${encodeURIComponent(busqueda)}`);
      const data = await res.json();
      setSugerencias(data);
    } catch (error) {
      console.error("Error buscando lugar:", error);
    } finally {
      setBuscando(false);
    }
  };

  const seleccionarSugerencia = (lugar: { nombre: string; lat: number; lng: number }) => {
    const coords = { lat: lugar.lat, lng: lugar.lng };
    setMarcador(coords);
    setBusqueda(lugar.nombre);
    setSugerencias([]);
    onUbicacionSeleccionada(coords, lugar.nombre);
  };

  const handleClic = async (coords: Coordenadas) => {
    setMarcador(coords);
    try {
      const res = await fetch(`${GEO_API}/reverse?lat=${coords.lat}&lng=${coords.lng}`);
      const data = await res.json();
      setBusqueda(data.direccion || "");
      onUbicacionSeleccionada(coords, data.direccion || `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
    } catch {
      onUbicacionSeleccionada(coords, `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Buscador */}
      <div className="relative flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarLugar()}
            placeholder="Buscar lugar… Ej: Parque Bicentenario, Vitacura"
            className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
          />
          <button
            onClick={buscarLugar}
            disabled={buscando}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {buscando ? "⏳" : "Buscar"}
          </button>
        </div>

        {/* Sugerencias */}
        {sugerencias.length > 0 && (
          <div className="absolute top-12 left-0 right-0 z-[1000] rounded-xl border border-stone-200 bg-white shadow-xl overflow-hidden">
            {sugerencias.map((s, i) => (
              <button
                key={i}
                onClick={() => seleccionarSugerencia(s)}
                className="w-full text-left px-4 py-3 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 border-b border-stone-100 last:border-0 transition-colors"
              >
                📍 {s.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-stone-400">
        📍 También puedes hacer clic directamente en el mapa para marcar el lugar
      </p>

      {/* Mapa */}
      <div className="rounded-2xl overflow-hidden border border-stone-200 h-72 z-0">
        <MapContainer
          center={[-33.4569, -70.6483]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='© <a href="https://carto.com/">CARTO</a> © <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <ClickHandler onClic={handleClic} />
          {marcador && (
            <Marker position={[marcador.lat, marcador.lng]} icon={icon}>
              <Popup>📍 Última ubicación conocida</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {marcador && (
        <p className="text-xs text-emerald-600 font-medium">
          ✅ Coordenadas: {marcador.lat.toFixed(5)}, {marcador.lng.toFixed(5)}
        </p>
      )}
    </div>
  );
}
