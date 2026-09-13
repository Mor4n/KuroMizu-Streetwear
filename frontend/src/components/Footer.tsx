import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t-2 border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-display font-black tracking-widest uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
              黒水
            </h3>
            <p className="text-gray-400 text-sm tracking-wider leading-relaxed max-w-md">
              Contemporary streetwear | Designed in Agua Prieta, Japan.<br />
              Worn globally.
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-gray-500">STAY CONNECTED</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-300">
              <li>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"></circle></svg>
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18 3h3l-7.5 8.6L22 21h-6.5l-5-6.6L4.5 21H1.5l8-9.2L1 3h6.6l4.5 5.9L18 3z"></path></svg>
                  Twitter / X
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M19.589 6.686a4.793 4.793 0 01-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 01-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 013.183-4.51v-3.5a6.329 6.329 0 00-5.394 10.692 6.33 6.33 0 0010.857-4.424V8.687a8.182 8.182 0 004.773 1.526V6.79a4.831 4.831 0 01-1.003-.104z"></path></svg>
                  TikiToki
                </a>
              </li>
            </ul>
          </div>


        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-xs text-gray-600 font-medium tracking-widest uppercase">
          <p>&copy; {new Date().getFullYear()} KuroMizu Tokyo.</p>
          <p className="mt-4 md:mt-0">Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
