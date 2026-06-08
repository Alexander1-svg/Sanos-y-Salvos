"use client";

interface SuccessScreenProps {
  nombreMascota: string;
  email: string;
  onReset: () => void;
}

export default function SuccessScreen({ nombreMascota, email, onReset }: SuccessScreenProps) {
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
            <strong className="text-stone-700">{nombreMascota}</strong>. Te
            contactaremos a{" "}
            <strong className="text-stone-700">{email}</strong> con novedades.
          </p>
        </div>
        <div className="h-px w-full bg-stone-200" />
        <p className="text-sm text-stone-400">
          ¿Más info? Escríbenos a{" "}
          <span className="text-emerald-600 font-semibold">contacto@sanosysalvos.cl</span>
        </p>
        <button
          onClick={onReset}
          className="rounded-xl bg-emerald-600 px-8 py-3 font-bold text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
        >
          Hacer otro reporte
        </button>
      </div>
    </div>
  );
}