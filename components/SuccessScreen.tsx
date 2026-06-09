"use client";

import dynamic from "next/dynamic";

// Carga dinámica del componente de coincidencias (evita SSR con fetch)
const Coincidencias = dynamic(() => import("@/components/Coincidencias"), {
  ssr: false,
  loading: () => (
    <div className="mt-10 h-48 rounded-3xl bg-stone-100 animate-pulse flex items-center justify-center text-stone-400 text-sm">
      🔍 Buscando coincidencias…
    </div>
  ),
});

interface SuccessScreenProps {
  nombreMascota: string;
  email: string;
  reporteId: string; // ← nuevo: ID del reporte recién creado
  onReset: () => void;
}

export default function SuccessScreen({
  nombreMascota,
  email,
  reporteId,
  onReset,
}: SuccessScreenProps) {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-2xl px-6 py-16 flex flex-col gap-6">

        {/* Confirmación */}
        <div className="rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-100 p-10 flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <div className="h-28 w-28 rounded-full bg-emerald-100 flex items-center justify-center text-6xl">
              🐾
            </div>
            <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              ✓
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl font-black text-stone-800">
              ¡Reporte enviado!
            </h2>
            <p className="text-stone-500 leading-relaxed">
              Hemos recibido la información de{" "}
              <strong className="text-stone-700">{nombreMascota}</strong>. Te
              contactaremos a{" "}
              <strong className="text-stone-700">{email}</strong> con novedades.
            </p>
          </div>

          <div className="h-px w-full bg-stone-100" />

          <p className="text-sm text-stone-400">
            ¿Más info? Escríbenos a{" "}
            <span className="text-emerald-600 font-semibold">
              contacto@sanosysalvos.cl
            </span>
          </p>

          <button
            onClick={onReset}
            className="rounded-xl border-2 border-stone-200 px-8 py-3 font-bold text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Hacer otro reporte
          </button>
        </div>

        {/* Motor de coincidencias + form de avistamiento */}
        {reporteId && (
          <Coincidencias reporteId={reporteId} nombreMascota={nombreMascota} />
        )}
      </div>
    </div>
  );
}
