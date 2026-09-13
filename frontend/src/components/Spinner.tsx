export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-20 w-full">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      <p className="text-xs font-bold tracking-widest uppercase text-gray-500 animate-pulse">
        Cargando...
      </p>
    </div>
  );
}
