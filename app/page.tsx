"use client";

import { useState } from "react";
import Navbar from "@/components/Layout/navbar";
import Footer from "@/components/Layout/footer";
import SuccessScreen from "@/components/SuccessScreen";
import ReportForm from "@/components/Reports";

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4">
      <span className="font-display text-4xl font-black text-emerald-600">{value}</span>
      <span className="text-sm font-medium text-stone-500 text-center leading-tight">{label}</span>
    </div>
  );
}

export default function SanosYSalvosPage() {
  const [submitted, setSubmitted]       = useState(false);
  const [nombreMascota, setNombreMascota] = useState("");
  const [email, setEmail]               = useState("");
  const [reporteId, setReporteId]       = useState(""); // ← nuevo

  if (submitted) {
    return (
      <SuccessScreen
        nombreMascota={nombreMascota}
        email={email}
        reporteId={reporteId}
        onReset={() => {
          setSubmitted(false);
          setNombreMascota("");
          setEmail("");
          setReporteId("");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <Navbar />

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
                  <StatCard value="850+"  label="Voluntarios activos" />
                  <StatCard value="98%"   label="Tasa de éxito" />
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
              { n: "01", icon: "📝", title: "Reporta",   desc: "Completa el formulario con los datos del dueño y de la mascota perdida." },
              { n: "02", icon: "📡", title: "Difundimos", desc: "Activamos nuestra red de voluntarios y publicamos en redes sociales." },
              { n: "03", icon: "🤝", title: "Reunimos",   desc: "Coordinamos el reencuentro seguro de tu mascota con su familia." },
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
                { icon: "🐕", title: "Perros",          num: "780+", color: "bg-amber-50 border-amber-100" },
                { icon: "🐈", title: "Gatos",           num: "340+", color: "bg-orange-50 border-orange-100" },
                { icon: "🐇", title: "Otros animales",  num: "80+",  color: "bg-sky-50 border-sky-100" },
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

      <ReportForm
        onSubmitted={(nombre, correo, id) => {
          setNombreMascota(nombre);
          setEmail(correo);
          setReporteId(id);
          setSubmitted(true);
        }}
      />

      <Footer />
    </div>
  );
}
