import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { Loader2, PlayCircle } from 'lucide-react';
import apiClient from '../config/apiClient';
import { fetchWithRetry } from '../utils/fetchUtils';
import { toast } from 'react-hot-toast';

const Gallery = () => {
  const containerRef = useRef(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);

      try {
        const res = await fetchWithRetry(() => apiClient.get('/api/v1/gallery'));
        const items = res?.data?.data?.items;
        setMedia(Array.isArray(items) ? items.filter(item => item?.isActive) : []);
      } catch (err) {
        console.error(err);
        toast.error(
          err?.response?.data?.message || "Server is waking up... ⏳",
          { id: "server-error" }
        );
        setMedia([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchGallery();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading || media.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from('.gallery-item', {
        scale: 0.8,
        opacity: 0,
        stagger: 0.1,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, [loading, media]);

  return (
    <section 
      ref={containerRef}
      id="gallery" 
      className="py-32 px-6 bg-dark overflow-hidden"
    >
      <div className="container mx-auto">
        
        <div className="text-center mb-24">
          <h4 className="text-primary font-black tracking-widest uppercase mb-4 text-xs">MOMENTS</h4>
          <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter">Captured <span className="text-gray-500">Glory.</span></h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-white/5 animate-pulse rounded-[40px]" />
            ))}
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {media.map((item, index) => (
              <div 
                key={item._id} 
                className="gallery-item relative rounded-[40px] overflow-hidden group glass-effect border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.3)]"
              >
                {item.type === 'video' ? (
                  <div className="relative aspect-video lg:aspect-square">
                    <video 
                      src={item.url} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      muted
                      loop
                      onMouseOver={(e) => e.target.play()}
                      onMouseOut={(e) => e.target.pause()}
                    />
                    <div className="absolute top-6 right-6 p-3 bg-primary/20 backdrop-blur-md rounded-full text-primary">
                      <PlayCircle size={20} />
                    </div>
                  </div>
                ) : (
                  <img 
                    src={item.url} 
                    alt={item.caption || `Gallery ${index}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] grayscale group-hover:grayscale-0"
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <p className="text-white font-bold text-sm tracking-wide uppercase">{item.caption}</p>
                </div>

                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />
              </div>
            ))}
          </div>
        )}

        {media.length === 0 && !loading && (
          <div className="text-center py-40">
            <p className="text-gray-500 font-black tracking-widest uppercase italic text-sm">Waiting for the next legend to be captured.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
