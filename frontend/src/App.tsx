import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthDrawer from './components/AuthDrawer';
import Navbar from './components/Navbar';

function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen p-8 bg-kuromizu-bg text-black relative overflow-hidden font-sans">
      <Navbar onProfileClick={() => setIsDrawerOpen(true)} />

      <AuthDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="mt-32 text-center relative z-10 px-4 max-w-4xl mx-auto flex flex-col items-center">

      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}