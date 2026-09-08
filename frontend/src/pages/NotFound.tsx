import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  const [gifUrl, setGifUrl] = useState('');

  useEffect(() => {
    const fetchGif = async () => {
      try {
        const response = await fetch('https://nekos.best/api/v2/bored');
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setGifUrl(data.results[0].url);
        }
      } catch (error) {
        console.error('Error fetching gif:', error);
        setGifUrl('https://nekos.best/api/v2/bored/0001.gif');
      }
    };

    fetchGif();
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-8xl md:text-9xl font-display font-bold tracking-widest mb-4">
        404
      </h1>

      <h2 className="text-2xl md:text-4xl font-light tracking-[0.2em] uppercase mb-8">
        LOST IN <span className="font-bold bg-gradient-to-b from-[#FF0055] to-[#6B0022] text-transparent bg-clip-text">黒水</span>
      </h2>

      {gifUrl ? (
        <div className="w-full max-w-md h-64 md:h-80 bg-gray-100 mb-8 border border-gray-200 overflow-hidden rounded-none shadow-sm relative">
          <img
            src={gifUrl}
            alt="Random anime reaction"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full max-w-md h-64 md:h-80 bg-gray-100 mb-8 border border-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Cargando...</span>
        </div>
      )}

      <p className="text-gray-500 mb-8 font-medium max-w-md">
        La página que buscas no existe u.u
      </p>

      <Link
        to="/"
        className="group px-8 py-3 bg-black text-white font-bold uppercase tracking-[0.2em] text-sm hover:bg-gray-800 transition-colors border-2 border-black"
      >
        Volver al inicio <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
      </Link>
    </div>
  );
}
