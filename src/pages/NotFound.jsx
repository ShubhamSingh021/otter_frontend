import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6 bg-hero-gradient">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="glass-effect p-16 md:p-24 rounded-[80px] border-white/5 shadow-2xl">
          <h1 className="text-[120px] md:text-[180px] font-black leading-none text-primary italic mb-4">404</h1>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter">LOST IN THE FIELD?</h2>
          <p className="text-gray-400 font-medium text-lg leading-relaxed mb-12 max-w-md mx-auto">
            The session you're looking for was either cancelled or moved to a different arena.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/" 
              className="flex items-center gap-3 px-8 py-4 bg-primary text-dark font-black rounded-full hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              <Home size={20} />
              Back Home
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-3 px-8 py-4 bg-white/5 text-white font-black rounded-full hover:bg-white/10 transition-all border border-white/10"
            >
              <ArrowLeft size={20} />
              Previous Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
