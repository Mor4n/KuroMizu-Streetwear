import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Layout from './components/Layout';

function Home() {
  return (
    <>
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* NOOOTA: OCUPO CAMBIAR ESTE VIDEO EN EL FUTURO POR OTRO */}
          <source src="https://hosshi.netlify.app/assets/tienda-online-zoPwI51s.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gray-900/60 z-0"></div>

        <div className="relative z-10 text-center text-white px-4 mt-20">
          <h2 className="text-5xl md:text-7xl font-display uppercase tracking-wider mb-6">
            KuroMizu <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Season 1</span>
          </h2>
          <button className="group px-10 py-4 bg-white text-black font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 border-2 border-white cursor-pointer rounded-none">
            ENTER ARCHIVE <span className="inline-block ml-2 group-hover:translate-x-2 transition-transform">&rarr;</span>
          </button>
        </div>
      </section>

      {/* Marquee */}
      <div className="w-full bg-black text-white py-3 overflow-hidden border-b-2 border-white/20">
        <div className="animate-marquee inline-block whitespace-nowrap text-sm font-bold tracking-[0.3em]">
          <span className="mx-8">KUROMIZU TOKYO</span> // <span className="mx-8">SEASON 1</span> // <span className="mx-8">OUT NOW</span> //
          <span className="mx-8">KUROMIZU TOKYO</span> // <span className="mx-8">SEASON 1</span> // <span className="mx-8">OUT NOW</span> //
          <span className="mx-8">KUROMIZU TOKYO</span> // <span className="mx-8">SEASON 1</span> // <span className="mx-8">OUT NOW</span> //
        </div>
      </div>

      {/* Productos */}
      <Products />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products/:id" element={<ProductDetail />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}