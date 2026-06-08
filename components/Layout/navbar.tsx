{/* ── Navbar ── */}
export default function Navbar() {
  return (
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
  );
}      