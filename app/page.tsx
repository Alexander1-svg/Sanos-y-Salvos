"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

// ─── Importación dinámica del mapa (obligatorio en Next.js con Leaflet) ───────
const MapaPerdida = dynamic(() => import("@/components/MapaPerdida"), {
  ssr: false,
  loading: () => (
    <div className="h-72 rounded-2xl bg-stone-100 animate-pulse flex items-center justify-center text-stone-400 text-sm">
      🗺️ Cargando mapa…
    </div>
  ),
});

// ─── URLs de microservicios ───────────────────────────────────────────────────
const API_MASCOTAS = "http://localhost:3001";

// ─── Types ───────────────────────────────────────────────────────────────────
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

// ─── Componentes helpers ──────────────────────────────────────────────────────
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4">
      <span className="font-display text-4xl font-black text-emerald-600">{value}</span>
      <span className="text-sm font-medium text-stone-500 text-center leading-tight">{label}</span>
    </div>
  );
}

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

const inputCls =
  "w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 text-sm placeholder:text-stone-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200";

const selectCls =
  "w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 text-sm focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200 appearance-none cursor-pointer";

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SanosYSalvosPage() {
  const [ownerForm, setOwnerForm] = useState<OwnerForm>({
    nombreDueno: "",
    telefono: "",
    email: "",
    comuna: "",
    direccion: "",
  });

  const [petForm, setPetForm] = useState<PetForm>({
    nombreMascota: "",
    especie: "",
    raza: "",
    color: "",
    edad: "",
    sexo: "",
    descripcion: "",
    lugarPerdida: "",
    fechaPerdida: "",
    tieneChip: "",
    coordenadas: { lat: null, lng: null },
  });

  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [enviando, setEnviando] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setOwnerForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handlePetChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setPetForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleUbicacion = (coords: { lat: number; lng: number }, direccion: string) => {
    setPetForm((p) => ({
      ...p,
      coordenadas: coords,
      lugarPerdida: direccion,
    }));
  };

  // ── Envío al microservicio ms-gestion-mascotas ──
  const handleSubmit = async () => {
    setEnviando(true);
    setError(null);
    try {
      const payload = {
        ...ownerForm,
        ...petForm,
        fechaPerdida: new Date(petForm.fechaPerdida).toISOString(),
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

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Error de conexión con el servidor");
    } finally {
      setEnviando(false);
    }
  };

  // ── Pantalla de éxito ──
  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-6 py-20">
          <div className="relative">
            <div className="h-28 w-28 rounded-full bg-emerald-100 flex items-center justify-center text-6xl">
              🐾
            </div>
            <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              ✓
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-3xl font-black text-stone-800">¡Reporte enviado!</h2>
            <p className="text-stone-500 leading-relaxed">
              Hemos recibido la información de{" "}
              <strong className="text-stone-700">{petForm.nombreMascota}</strong>. Te
              contactaremos a{" "}
              <strong className="text-stone-700">{ownerForm.email}</strong> con novedades.
            </p>
          </div>
          <div className="h-px w-full bg-stone-200" />
          <p className="text-sm text-stone-400">
            ¿Más info? Escríbenos a{" "}
            <span className="text-emerald-600 font-semibold">contacto@sanosysalvos.cl</span>
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setActiveStep(1);
              setOwnerForm({ nombreDueno: "", telefono: "", email: "", comuna: "", direccion: "" });
              setPetForm({ nombreMascota: "", especie: "", raza: "", color: "", edad: "", sexo: "", descripcion: "", lugarPerdida: "", fechaPerdida: "", tieneChip: "", coordenadas: { lat: null, lng: null } });
            }}
            className="rounded-xl bg-emerald-600 px-8 py-3 font-bold text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
          >
            Hacer otro reporte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-lg">🐾</div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-black text-stone-800 tracking-tight">Sanos y Salvos</span>
              <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-widest">Fundación</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-500">
            <a href="#nosotros" className="hover:text-stone-800 transition-colors">Nosotros</a>
            <a href="#reporte" className="hover:text-stone-800 transition-colors">Reportar</a>
            <a href="#contacto" className="hover:text-stone-800 transition-colors">Contacto</a>
            <a href="#reporte" className="rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
              Reportar mascota
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-emerald-50 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-amber-50 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 uppercase tracking-widest">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Fundación sin fines de lucro · Desde 2018
              </span>
              <h1 className="font-display text-5xl md:text-6xl font-black text-stone-900 leading-none tracking-tight">
                Cada mascota<br />
                <span className="text-emerald-600">merece</span> volver<br />
                a casa.
              </h1>
              <p className="text-lg text-stone-500 leading-relaxed max-w-md">
                En <strong className="text-stone-700">Sanos y Salvos</strong> conectamos dueños con sus mascotas perdidas a través de una red de voluntarios, refugios y comunidades activas en todo Chile.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#reporte" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-4 font-bold text-white shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all duration-200">
                  🔍 Reportar mascota perdida
                </a>
                <a href="#nosotros" className="inline-flex items-center gap-2 rounded-xl border-2 border-stone-200 px-7 py-4 font-bold text-stone-700 hover:border-stone-300 hover:bg-stone-50 transition-all duration-200">
                  Conocer más →
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-3xl border border-stone-100 bg-stone-50 p-8 shadow-xl shadow-stone-100">
                <div className="text-6xl mb-4 text-center">🐕 🐈 🐇</div>
                <div className="grid grid-cols-3 divide-x divide-stone-200">
                  <StatCard value="1.2k+" label="Mascotas reencontradas" />
                  <StatCard value="850+" label="Voluntarios activos" />
                  <StatCard value="98%" label="Tasa de éxito" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 flex items-center gap-3">
                  <span className="text-3xl">📍</span>
                  <div>
                    <p className="font-bold text-stone-800 text-sm">Cobertura nacional</p>
                    <p className="text-xs text-stone-500">15 regiones</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 flex items-center gap-3">
                  <span className="text-3xl">⚡</span>
                  <div>
                    <p className="font-bold text-stone-800 text-sm">Respuesta rápida</p>
                    <p className="text-xs text-stone-500">Menos de 2 horas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="border-y border-stone-200 bg-stone-100 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            {[
              { n: "01", icon: "📝", title: "Reporta", desc: "Completa el formulario con los datos del dueño y de la mascota perdida." },
              { n: "02", icon: "📡", title: "Difundimos", desc: "Activamos nuestra red de voluntarios y publicamos en redes sociales." },
              { n: "03", icon: "🤝", title: "Reunimos", desc: "Coordinamos el reencuentro seguro de tu mascota con su familia." },
            ].map((step) => (
              <div key={step.n} className="flex-1 relative rounded-2xl bg-white border border-stone-200 p-8 flex flex-col gap-4 shadow-sm">
                <span className="font-display text-5xl font-black text-stone-100 absolute top-4 right-6 select-none">{step.n}</span>
                <span className="text-4xl">{step.icon}</span>
                <h3 className="font-display text-xl font-black text-stone-800">{step.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sobre nosotros ── */}
      <section id="nosotros" className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Nuestra misión</span>
                <h2 className="font-display text-4xl font-black text-stone-900 leading-tight">
                  Unidos por el amor<br />a los animales
                </h2>
              </div>
              <p className="text-stone-500 leading-relaxed">
                La Fundación <strong className="text-stone-700">Sanos y Salvos</strong> nació en 2018 como respuesta a la creciente crisis de mascotas perdidas en Chile.
              </p>
              <p className="text-stone-500 leading-relaxed">
                Contamos con una red de más de <strong className="text-stone-700">850 voluntarios</strong> distribuidos en todo el país, trabajando de forma coordinada con refugios, veterinarias y municipios.
              </p>
              <div className="flex flex-wrap gap-3">
                {["🏠 Sin lucro", "🐾 Animales primero", "🌿 100% voluntarios", "📞 Atención 24/7"].map((tag) => (
                  <span key={tag} className="rounded-full border border-stone-200 bg-stone-50 px-4 py-1.5 text-sm font-medium text-stone-600">{tag}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🐕", title: "Perros", num: "780+", color: "bg-amber-50 border-amber-100" },
                { icon: "🐈", title: "Gatos", num: "340+", color: "bg-orange-50 border-orange-100" },
                { icon: "🐇", title: "Otros animales", num: "80+", color: "bg-sky-50 border-sky-100" },
                { icon: "❤️", title: "Familias felices", num: "1.2k+", color: "bg-rose-50 border-rose-100" },
              ].map((item) => (
                <div key={item.title} className={`rounded-2xl border ${item.color} p-6 flex flex-col gap-2`}>
                  <span className="text-3xl">{item.icon}</span>
                  <span className="font-display text-2xl font-black text-stone-800">{item.num}</span>
                  <span className="text-sm font-medium text-stone-500">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Formularios ── */}
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
                        <p className="mt-2 text-xs text-stone-500 truncate">
                          📍 {petForm.lugarPerdida}
                        </p>
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
                    disabled={
                      enviando ||
                      !petForm.nombreMascota ||
                      !petForm.especie ||
                      !petForm.color ||
                      !petForm.fechaPerdida ||
                      !petForm.lugarPerdida
                    }
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

      {/* ── Footer ── */}
      <footer id="contacto" className="bg-stone-900 text-stone-400 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center text-white">🐾</div>
                <div>
                  <span className="font-display font-black text-white block leading-none">Sanos y Salvos</span>
                  <span className="text-xs text-emerald-400 uppercase tracking-widest">Fundación</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed">Conectamos mascotas perdidas con sus familias desde 2018.</p>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-widest">Contacto</h4>
              <div className="flex flex-col gap-2 text-sm">
                <a href="mailto:contacto@sanosysalvos.cl" className="hover:text-emerald-400 transition-colors">📧 contacto@sanosysalvos.cl</a>
                <a href="tel:+56912345678" className="hover:text-emerald-400 transition-colors">📞 +56 9 1234 5678</a>
                <p>📍 Santiago, Chile</p>
                <p className="text-emerald-400 font-medium">⏰ Atención 24/7</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-widest">Síguenos</h4>
              <div className="flex flex-col gap-2 text-sm">
                <a href="#" className="hover:text-emerald-400 transition-colors">Instagram @sanosysalvos</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Facebook /sanosysalvos</a>
              </div>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2024 Fundación Sanos y Salvos. Todos los derechos reservados.</p>
            <p className="text-xs text-stone-600">Hecho con ❤️ por voluntarios para mascotas y sus familias</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
