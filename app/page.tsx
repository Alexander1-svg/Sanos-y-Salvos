import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 overflow-hidden">

      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-amber-100/60 blur-3xl dark:bg-amber-900/20" />
        <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-zinc-200/80 blur-3xl dark:bg-zinc-800/40" />
        {/* Grid sutil */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <main className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-12 px-6 py-20 text-center">

        {/* Logo / Marca */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-5xl">🐾</span>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            PetAlert
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400">
            Porque cada mascota merece volver a casa.
          </p>
        </div>

        {/* Card principal */}
        <Link
          href="/reportar"
          className="group relative w-full max-w-md overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-lg shadow-amber-100/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-200/60 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-none dark:hover:border-amber-500/40"
        >
          {/* Acento superior */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

          <div className="flex flex-col items-center gap-5 px-8 py-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-3xl shadow-inner dark:bg-zinc-800">
              🔍
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Reportar mascota perdida
              </h2>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                Completa el formulario con los datos del dueño y de tu mascota.
                Te ayudaremos a difundir el aviso.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 group-hover:bg-amber-500 group-hover:shadow-amber-300/50">
              Comenzar reporte
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </Link>

        {/* Pie de página */}
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          Servicio gratuito · Sin registro requerido
        </p>
      </main>
    </div>
  );
}
