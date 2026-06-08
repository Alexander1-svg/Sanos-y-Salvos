{/* ── Footer ── */}
export default function Footer() {
  return (
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
    );
}       