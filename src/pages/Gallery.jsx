import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Play, Filter } from 'lucide-react';

const Gallery = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-dark">
      <div className="container mx-auto">
        
        {/* HERO SECTION */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            <ImageIcon size={14} />
            Visual Archive
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-8"
          >
            MOMENTS OF <span className="text-primary italic">GLORY.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto font-medium"
          >
            Relive the most intense matches, community meetups, and legendary victories 
            that define the Otter Society spirit.
          </motion.p>
        </div>

        {/* GALLERY GRID PLACEHOLDER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <motion.div 
              key={item}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: item * 0.1 }}
              className="aspect-video rounded-[32px] bg-white/5 border border-white/10 overflow-hidden relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/20 backdrop-blur-sm">
                <Play size={48} className="text-white fill-white" />
              </div>
              <div className="absolute bottom-8 left-8">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Tournament #0{item}</p>
                <h3 className="text-xl font-black text-white px-2">CHAMPIONSHIP FINALS</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* COMING SOON LOAD */}
        <div className="mt-20 text-center">
            <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-full text-gray-400 font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-sm">
                Load More Archive
            </button>
        </div>

      </div>
    </div>
  );
};

export default Gallery;
