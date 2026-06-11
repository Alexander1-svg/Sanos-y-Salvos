"use client";

/**
 * Coincidencias.tsx
 * Muestra las coincidencias del motor tras publicar un reporte de pérdida.
 * También incluye el formulario para reportar un avistamiento.
 */

import React, { useEffect, useState } from "react";

// ─── Configuración de URLs ────────────────────────────────────────────────────
const API_COINCIDENCIAS = process.env.NEXT_PUBLIC_MS_MOTOR;


interface DetalleScore {
  especie: number;
  distancia: number;
  distanciaKm: number | null;
  color: number;
  raza: number;
  sexo: number;
}

interface Avistamiento {
  _id: string;
  nombreReportante: string;
  telefonoReportante: string;
  especie: string;
  raza?: string;
  color: string;
  sexo?: string;
  descripcion?: string;
  lugarAvistamiento: string;
  coordenadas: { lat: number; lng: number };
  fechaAvistamiento: string;
  creadoEn: string;
}

interface Coincidencia {
  avistamiento: Avistamiento;
  score: number;
  detalle: DetalleScore;
}

interface CoincidenciasResponse {
  reporteId: string;
  mascota: string;
  especie: string;
  totalEncontrados: number;
  coincidencias: Coincidencia[];
}

interface FormAvistamiento {
  nombreReportante: string;
  telefonoReportante: string;
  especie: string;
  raza: string;
  color: string;
  sexo: string;
  descripcion: string;
  lugarAvistamiento: string;
  coordenadas: { lat: number | null; lng: number | null };
  fechaAvistamiento: string;
}

// ─── Helpers visuales ─────────────────────────────────────────────────────────
function scoreColor(score: number): string {
  if (score >= 70) return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (score >= 40) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-stone-600 bg-stone-50 border-stone-200";
}

function scoreLabel(score: number): string {
  if (score >= 70) return "Alta coincidencia";
  if (score >= 40) return "Coincidencia media";
  return "Coincidencia baja";
}

function scoreEmoji(score: number): string {
  if (score >= 70) return "🟢";
  if (score >= 40) return "🟡";
  return "🔵";
}

const inputCls =
  "w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 text-sm " +
  "placeholder:text-stone-400 focus:border-emerald-400 focus:bg-white focus:outline-none " +
  "focus:ring-2 focus:ring-emerald-100 transition-all duration-200";

const selectCls =
  "w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 text-sm " +
  "focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 " +
  "transition-all duration-200 appearance-none cursor-pointer";

// ─── Subcomponente: Tarjeta de Coincidencia ───────────────────────────────────
function TarjetaCoincidencia({ coincidencia }: { coincidencia: Coincidencia }) {
  const { avistamiento, score, detalle } = coincidencia;
  const [expandido, setExpandido] = useState(false);

  return (
    <div
      className={`rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-200 ${scoreColor(score)}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{scoreEmoji(score)}</span>
          <div>
            <p className="font-bold text-sm">{scoreLabel(score)}</p>
            <p className="text-xs opacity-70">{avistamiento.lugarAvistamiento}</p>
          </div>
        </div>
        {/* Score badge */}
        <div className="flex flex-col items-center flex-shrink-0">
          <span className="text-2xl font-black">{score}</span>
          <span className="text-xs font-medium opacity-70">/ 100</span>
        </div>
      </div>

      {/* Info básica */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex gap-1.5 items-center">
          <span>🎨</span>
          <span className="capitalize">{avistamiento.color}</span>
        </div>
        {avistamiento.raza && (
          <div className="flex gap-1.5 items-center">
            <span>🐾</span>
            <span className="capitalize">{avistamiento.raza}</span>
          </div>
        )}
        {detalle.distanciaKm !== null && (
          <div className="flex gap-1.5 items-center">
            <span>📍</span>
            <span>{detalle.distanciaKm} km de distancia</span>
          </div>
        )}
        <div className="flex gap-1.5 items-center">
          <span>📅</span>
          <span>{new Date(avistamiento.fechaAvistamiento).toLocaleDateString("es-CL")}</span>
        </div>
      </div>

      {/* Desglose del score (expandible) */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="text-xs font-semibold opacity-60 hover:opacity-100 transition-opacity text-left"
      >
        {expandido ? "▲ Ocultar desglose" : "▼ Ver desglose del score"}
      </button>

      {expandido && (
        <div className="rounded-xl bg-white/60 border border-current/10 p-3 grid grid-cols-2 gap-2 text-xs">
          {[
            { label: "Especie",   pts: detalle.especie,   max: 30 },
            { label: "Distancia", pts: detalle.distancia,  max: 30 },
            { label: "Color",     pts: detalle.color,      max: 20 },
            { label: "Raza",      pts: detalle.raza,       max: 10 },
            { label: "Sexo",      pts: detalle.sexo,       max: 10 },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex justify-between mb-0.5">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-bold">{item.pts}/{item.max}</span>
                </div>
                <div className="h-1.5 rounded-full bg-current/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-current/40 transition-all duration-500"
                    style={{ width: `${(item.pts / item.max) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contacto */}
      <div className="rounded-xl bg-white/60 border border-current/10 p-3 flex flex-col gap-1">
        <p className="text-xs font-bold opacity-70 uppercase tracking-wide">Reportado por</p>
        <p className="text-sm font-semibold">{avistamiento.nombreReportante}</p>
        <a
          href={`tel:${avistamiento.telefonoReportante}`}
          className="text-sm font-bold underline underline-offset-2"
        >
          📞 {avistamiento.telefonoReportante}
        </a>
      </div>

      {avistamiento.descripcion && (
        <p className="text-xs opacity-70 italic">"{avistamiento.descripcion}"</p>
      )}
    </div>
  );
}

// ─── Subcomponente: Formulario de Avistamiento ────────────────────────────────
function FormularioAvistamiento({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState<FormAvistamiento>({
    nombreReportante: "", telefonoReportante: "",
    especie: "", raza: "", color: "", sexo: "", descripcion: "",
    lugarAvistamiento: "", coordenadas: { lat: null, lng: null },
    fechaAvistamiento: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ubicandose, setUbicandose] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  // Obtiene la ubicación actual del navegador
  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización.");
      return;
    }
    setUbicandose(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          // Intentar geocodificación inversa via ms-geolocalizacion
          const geoUrl = process.env.NEXT_PUBLIC_API_GEO ||
            "https://sanos-y-salvos-geolocalizacion.onrender.com";
          const res = await fetch(`${geoUrl}/reverse?lat=${lat}&lng=${lng}`);
          const data = await res.json();
          setForm((p) => ({
            ...p,
            coordenadas: { lat, lng },
            lugarAvistamiento: data.direccion || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          }));
        } catch {
          setForm((p) => ({
            ...p,
            coordenadas: { lat, lng },
            lugarAvistamiento: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          }));
        } finally {
          setUbicandose(false);
        }
      },
      () => {
        setError("No se pudo obtener tu ubicación. Ingrésala manualmente.");
        setUbicandose(false);
      }
    );
  };

  const handleSubmit = async () => {
    if (!form.coordenadas.lat || !form.coordenadas.lng) {
      setError("Debes seleccionar una ubicación.");
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch(`${API_COINCIDENCIAS}/avistamientos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          coordenadas: { lat: form.coordenadas.lat, lng: form.coordenadas.lng },
          fechaAvistamiento: new Date(form.fechaAvistamiento).toISOString(),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al enviar el avistamiento.");
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión.");
    } finally {
      setEnviando(false);
    }
  };

  const camposValidos =
    form.nombreReportante && form.telefonoReportante && form.especie &&
    form.color && form.lugarAvistamiento && form.fechaAvistamiento &&
    form.coordenadas.lat && form.coordenadas.lng;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wide text-stone-600">
            Tu nombre <span className="text-emerald-500">*</span>
          </label>
          <input name="nombreReportante" value={form.nombreReportante}
            onChange={handleChange} placeholder="Juan Pérez" className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wide text-stone-600">
            Tu teléfono <span className="text-emerald-500">*</span>
          </label>
          <input name="telefonoReportante" type="tel" value={form.telefonoReportante}
            onChange={handleChange} placeholder="+56 9 1234 5678" className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wide text-stone-600">
            Especie <span className="text-emerald-500">*</span>
          </label>
          <div className="relative">
            <select name="especie" value={form.especie} onChange={handleChange} className={selectCls}>
              <option value="">Seleccionar…</option>
              <option value="perro">🐕 Perro</option>
              <option value="gato">🐈 Gato</option>
              <option value="conejo">🐇 Conejo</option>
              <option value="ave">🦜 Ave</option>
              <option value="otro">Otro</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-stone-400">▾</div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wide text-stone-600">
            Color / pelaje <span className="text-emerald-500">*</span>
          </label>
          <input name="color" value={form.color} onChange={handleChange}
            placeholder="Ej: café con manchas blancas" className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wide text-stone-600">Raza</label>
          <input name="raza" value={form.raza} onChange={handleChange}
            placeholder="Ej: Labrador, mestizo…" className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wide text-stone-600">Sexo</label>
          <div className="relative">
            <select name="sexo" value={form.sexo} onChange={handleChange} className={selectCls}>
              <option value="">Seleccionar…</option>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
              <option value="desconocido">No sé</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-stone-400">▾</div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wide text-stone-600">
            Fecha del avistamiento <span className="text-emerald-500">*</span>
          </label>
          <input name="fechaAvistamiento" type="date" value={form.fechaAvistamiento}
            onChange={handleChange} className={inputCls} />
        </div>

        {/* Ubicación */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wide text-stone-600">
            Ubicación <span className="text-emerald-500">*</span>
          </label>
          <button
            type="button"
            onClick={obtenerUbicacion}
            disabled={ubicandose}
            className="w-full rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
          >
            {ubicandose ? "📡 Obteniendo ubicación…" : "📍 Usar mi ubicación actual"}
          </button>
          {form.lugarAvistamiento && (
            <p className="text-xs text-stone-500 truncate">✅ {form.lugarAvistamiento}</p>
          )}
        </div>

        {/* Descripción */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wide text-stone-600">
            Descripción adicional
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={3}
            placeholder="Detalles del lugar, comportamiento de la mascota, si fue vista sola o acompañada…"
            className={`${inputCls} resize-none`}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={enviando || !camposValidos}
        className="self-end inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 font-bold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {enviando ? "⏳ Enviando…" : "🔍 Publicar avistamiento"}
      </button>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
interface CoincidenciasProps {
  reporteId: string;
  nombreMascota: string;
}

type Vista = "coincidencias" | "avistar" | "exito";

export default function Coincidencias({ reporteId, nombreMascota }: CoincidenciasProps) {
  const [vista, setVista] = useState<Vista>("coincidencias");
  const [datos, setDatos] = useState<CoincidenciasResponse | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reporteId) {
      setError("No se recibió el ID del reporte. Recarga la página e intenta de nuevo.");
      setCargando(false);
      return;
    }

    setCargando(true);
    setError(null);

    const fetchCoincidencias = async () => {
      try {
        const res = await fetch(
          `${API_COINCIDENCIAS}/coincidencias/${reporteId}?minScore=20&limite=10&radioKm=15`
        );

        // Detectar respuesta HTML (pasa cuando el servicio no existe en Render o la URL es incorrecta)
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error(
            "El microservicio de coincidencias no está disponible. " +
            "Verifica que NEXT_PUBLIC_API_COINCIDENCIAS esté configurada correctamente en Vercel."
          );
        }

        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setDatos(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al consultar coincidencias.");
      } finally {
        setCargando(false);
      }
    };

    fetchCoincidencias();
  }, [reporteId]);

  return (
    <div className="mt-10 rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-100 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-stone-100">
        {[
          { id: "coincidencias" as Vista, label: "🔍 Coincidencias", badge: datos?.totalEncontrados },
          { id: "avistar"       as Vista, label: "📢 Reportar avistamiento" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setVista(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold transition-colors ${
              vista === tab.id
                ? "border-b-2 border-emerald-500 text-emerald-700 bg-emerald-50/50"
                : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
            }`}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span className="h-5 w-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-black">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">
        {/* Vista: Coincidencias */}
        {vista === "coincidencias" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-display text-xl font-black text-stone-800">
                Posibles avistamientos de {nombreMascota}
              </h3>
              <p className="text-sm text-stone-500">
                Avistamientos ordenados por similitud en un radio de 15 km.
              </p>
            </div>

            {cargando && (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 rounded-2xl bg-stone-100 animate-pulse" />
                ))}
              </div>
            )}

            {!cargando && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex flex-col gap-2">
                <p className="text-sm font-bold text-red-700">⚠️ No se pudieron cargar las coincidencias</p>
                <p className="text-xs text-red-600">{error}</p>
                <p className="text-xs text-stone-500 mt-1">
                  Mientras tanto, puedes{" "}
                  <button
                    onClick={() => setVista("avistar")}
                    className="font-semibold text-emerald-600 underline underline-offset-2"
                  >
                    reportar un avistamiento
                  </button>{" "}
                  para que otros voluntarios te ayuden.
                </p>
              </div>
            )}

            {!cargando && !error && datos?.coincidencias.length === 0 && (
              <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-10 text-center flex flex-col items-center gap-3">
                <span className="text-5xl">🔎</span>
                <p className="font-bold text-stone-700">No encontramos coincidencias todavía</p>
                <p className="text-sm text-stone-500 max-w-sm">
                  Nuestro motor está activo. Si alguien avista a {nombreMascota} aparecerá aquí.
                  También puedes pedir a voluntarios que reporten avistamientos.
                </p>
                <button
                  onClick={() => setVista("avistar")}
                  className="mt-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
                >
                  Reportar un avistamiento →
                </button>
              </div>
            )}

            {!cargando && !error && datos && datos.coincidencias.length > 0 && (
              <div className="flex flex-col gap-3">
                {datos.coincidencias.map((c) => (
                  <TarjetaCoincidencia key={c.avistamiento._id} coincidencia={c} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vista: Reportar avistamiento */}
        {vista === "avistar" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-display text-xl font-black text-stone-800">
                ¿Viste una mascota suelta?
              </h3>
              <p className="text-sm text-stone-500">
                Tu reporte puede ayudar a reunir a una mascota con su familia. Solo toma 1 minuto.
              </p>
            </div>
            <FormularioAvistamiento onSuccess={() => setVista("exito")} />
          </div>
        )}

        {/* Vista: Éxito avistamiento */}
        {vista === "exito" && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center text-4xl">
              🐾
            </div>
            <h3 className="font-display text-2xl font-black text-stone-800">
              ¡Gracias por tu reporte!
            </h3>
            <p className="text-stone-500 max-w-sm">
              El motor de coincidencias procesará tu avistamiento y notificará a los dueños con mayor similitud.
            </p>
            <button
              onClick={() => setVista("coincidencias")}
              className="rounded-xl border-2 border-stone-200 px-6 py-2.5 text-sm font-bold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              ← Ver coincidencias
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
