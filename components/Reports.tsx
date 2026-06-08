"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const MapaPerdida = dynamic(() => import("@/components/MapaPerdida"), {
  ssr: false,
  loading: () => (
    <div className="h-72 rounded-2xl bg-stone-100 animate-pulse flex items-center justify-center text-stone-400 text-sm">
      🗺️ Cargando mapa…
    </div>
  ),
});

const API_MASCOTAS = "https://sanos-y-salvos-gestion-mascotas.onrender.com";

interface OwnerForm {
  nombreDueno: string;
  telefono: string;
  email: string;
  comuna: string;
  direccion: string;
}

interface PetForm {
  nombreMascota: string;
  especie: string;
  raza: string;
  color: string;
  edad: string;
  sexo: string;
  descripcion: string;
  lugarPerdida: string;
  fechaPerdida: string;
  tieneChip: string;
  coordenadas: { lat: number | null; lng: number | null };
}

const inputCls = "w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 text-sm placeholder:text-stone-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200";
const selectCls = "w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 text-sm focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200 appearance-none cursor-pointer";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-stone-700 tracking-wide uppercase">
        {label}
        {required && <span className="text-emerald-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

interface ReportFormProps {
  onSubmitted: (nombreMascota: string, email: string) => void;
}

export default function ReportForm({ onSubmitted }: ReportFormProps) {
  const [ownerForm, setOwnerForm] = useState<OwnerForm>({
    nombreDueno: "", telefono: "", email: "", comuna: "", direccion: "",
  });
  const [petForm, setPetForm] = useState<PetForm>({
    nombreMascota: "", especie: "", raza: "", color: "", edad: "", sexo: "",
    descripcion: "", lugarPerdida: "", fechaPerdida: "", tieneChip: "",
    coordenadas: { lat: null, lng: null },
  });
  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setOwnerForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handlePetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setPetForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleUbicacion = (coords: { lat: number; lng: number }, direccion: string) => {
    setPetForm((p) => ({ ...p, coordenadas: coords, lugarPerdida: direccion }));
  };

  const handleSubmit = async () => {
    setEnviando(true);
    setError(null);
    try {
      const payload = {
        ...ownerForm,
        ...petForm,
        fechaPerdida: new Date(petForm.fechaPerdida).toISOString(),
        coordenadas: petForm.coordenadas.lat && petForm.coordenadas.lng
          ? { lat: petForm.coordenadas.lat, lng: petForm.coordenadas.lng }
          : undefined,
      };
      const res = await fetch(`${API_MASCOTAS}/reportes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al enviar el reporte");
      }
      onSubmitted(petForm.nombreMascota, ownerForm.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión con el servidor");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section id="reporte" className="py-24 bg-stone-50 border-t border-stone-200">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center flex flex-col items-center gap-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Formulario de reporte</span>
          <h2 className="font-display text-4xl font-black text-stone-900">Reportar mascota perdida</h2>
          <p className="text-stone-500 max-w-lg leading-relaxed">
            Completa la información en dos pasos. Cuanta más detalle proporciones, mayor será la probabilidad de reencuentro.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-10 max-w-xs mx-auto">
          {[{ n: 1, label: "Dueño" }, { n: 2, label: "Mascota" }].map((s, i) => (
            <React.Fragment key={s.n}>
              <button
                onClick={() => setActiveStep(s.n as 1 | 2)}
                className={`flex items-center gap-2 flex-1 justify-center rounded-xl py-3 px-4 font-bold text-sm transition-all duration-200 ${
                  activeStep === s.n
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                    : "bg-white border border-stone-200 text-stone-500 hover:border-emerald-300"
                }`}
              >
                <span className={`h-6 w-6 rounded-full text-xs flex items-center justify-center font-black ${activeStep === s.n ? "bg-white/20" : "bg-stone-100"}`}>
                  {s.n}
                </span>
                {s.label}
              </button>
              {i === 0 && <div className="h-px w-6 bg-stone-300 flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-100 overflow-hidden">

          {/* ── PASO 1: Dueño ── */}
          {activeStep === 1 && (
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-stone-100">
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">👤</div>
                <div>
                  <h3 className="font-display text-xl font-black text-stone-800">Información del dueño</h3>
                  <p className="text-sm text-stone-400">Necesitamos estos datos para contactarte con novedades</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Nombre completo" required>
                  <input name="nombreDueno" value={ownerForm.nombreDueno} onChange={handleOwnerChange} placeholder="Ej: María González" className={inputCls} />
                </Field>
                <Field label="Teléfono de contacto" required>
                  <input name="telefono" type="tel" value={ownerForm.telefono} onChange={handleOwnerChange} placeholder="+56 9 1234 5678" className={inputCls} />
                </Field>
                <Field label="Correo electrónico" required>
                  <input name="email" type="email" value={ownerForm.email} onChange={handleOwnerChange} placeholder="ejemplo@correo.com" className={inputCls} />
                </Field>
                <Field label="Comuna" required>
                  <input name="comuna" value={ownerForm.comuna} onChange={handleOwnerChange} placeholder="Ej: Las Condes" className={inputCls} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Dirección de referencia">
                    <input name="direccion" value={ownerForm.direccion} onChange={handleOwnerChange} placeholder="Calle, número, barrio…" className={inputCls} />
                  </Field>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setActiveStep(2)}
                  disabled={!ownerForm.nombreDueno || !ownerForm.telefono || !ownerForm.email || !ownerForm.comuna}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 font-bold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Siguiente: Datos de la mascota
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ── PASO 2: Mascota ── */}
          {activeStep === 2 && (
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-stone-100">
                <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">🐾</div>
                <div>
                  <h3 className="font-display text-xl font-black text-stone-800">Información de la mascota</h3>
                  <p className="text-sm text-stone-400">Describe con el mayor detalle posible para facilitar la búsqueda</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Nombre de la mascota" required>
                  <input name="nombreMascota" value={petForm.nombreMascota} onChange={handlePetChange} placeholder="Ej: Luna" className={inputCls} />
                </Field>
                <Field label="Especie" required>
                  <div className="relative">
                    <select name="especie" value={petForm.especie} onChange={handlePetChange} className={selectCls}>
                      <option value="">Seleccionar…</option>
                      <option value="perro">🐕 Perro</option>
                      <option value="gato">🐈 Gato</option>
                      <option value="conejo">🐇 Conejo</option>
                      <option value="ave">🦜 Ave</option>
                      <option value="otro">Otro</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-stone-400">▾</div>
                  </div>
                </Field>
                <Field label="Raza">
                  <input name="raza" value={petForm.raza} onChange={handlePetChange} placeholder="Ej: Labrador, mestizo…" className={inputCls} />
                </Field>
                <Field label="Color / pelaje" required>
                  <input name="color" value={petForm.color} onChange={handlePetChange} placeholder="Ej: Café con manchas blancas" className={inputCls} />
                </Field>
                <Field label="Edad aproximada">
                  <input name="edad" value={petForm.edad} onChange={handlePetChange} placeholder="Ej: 3 años" className={inputCls} />
                </Field>
                <Field label="Sexo">
                  <div className="relative">
                    <select name="sexo" value={petForm.sexo} onChange={handlePetChange} className={selectCls}>
                      <option value="">Seleccionar…</option>
                      <option value="macho">Macho</option>
                      <option value="hembra">Hembra</option>
                      <option value="desconocido">Desconocido</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-stone-400">▾</div>
                  </div>
                </Field>
                <Field label="¿Tiene microchip?">
                  <div className="relative">
                    <select name="tieneChip" value={petForm.tieneChip} onChange={handlePetChange} className={selectCls}>
                      <option value="">Seleccionar…</option>
                      <option value="si">Sí</option>
                      <option value="no">No</option>
                      <option value="desconocido">No sé</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-stone-400">▾</div>
                  </div>
                </Field>
                <Field label="Fecha que se perdió" required>
                  <input name="fechaPerdida" type="date" value={petForm.fechaPerdida} onChange={handlePetChange} className={inputCls} />
                </Field>

                {/* Mapa OpenStreetMap */}
                <div className="md:col-span-2">
                  <Field label="Ubicación donde se perdió" required>
                    <MapaPerdida onUbicacionSeleccionada={handleUbicacion} />
                    {petForm.lugarPerdida && (
                      <p className="mt-2 text-xs text-stone-500 truncate">📍 {petForm.lugarPerdida}</p>
                    )}
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Descripción adicional">
                    <textarea
                      name="descripcion"
                      value={petForm.descripcion}
                      onChange={handlePetChange}
                      rows={4}
                      placeholder="Señas particulares, collar, comportamiento, última vez vista…"
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  ⚠️ {error}
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-between items-center">
                <button
                  onClick={() => setActiveStep(1)}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-stone-200 px-6 py-3 font-bold text-stone-600 hover:border-stone-300 hover:bg-stone-50 transition-all duration-200"
                >
                  ← Volver
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={enviando || !petForm.nombreMascota || !petForm.especie || !petForm.color || !petForm.fechaPerdida || !petForm.lugarPerdida}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 font-bold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {enviando ? "⏳ Enviando…" : "🐾 Enviar reporte"}
                </button>
              </div>
            </div>
          )}
        </div>
        <p className="text-center text-xs text-stone-400 mt-4">
          Los datos ingresados serán utilizados únicamente para facilitar la búsqueda de tu mascota.
        </p>
      </div>
    </section>
  );
}