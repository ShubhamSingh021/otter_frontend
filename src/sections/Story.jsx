import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import apiClient from '../config/apiClient';
import { fetchWithRetry } from '../utils/fetchUtils';
import { Loader2 } from 'lucide-react';

const Story = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const [content, setContent] = useState({
    tagline: 'OUR PHILOSOPHY',
    title: 'Movement is Life. Community is Strength.',
    description1: 'Founded in 2024, Otter Society was born from a simple observation: sports are better when shared.',
    description2: 'Whether you are a seasoned pro or picking up a ball for the first time, our mission is to provide the platform.'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoryContent = async () => {
      try {
        const res = await fetchWithRetry(() => apiClient.get('/api/v1/content'));
        const storyData = res?.data?.data?.contents?.story;
        if (storyData) {
          setContent(prev => ({ ...prev, ...storyData }));
        }
      } catch (err) {
        console.error('Failed to fetch story content');
        toast.error(
          err?.response?.data?.message || "Server is waking up... ⏳",
          { id: "server-error" }
        );
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchStoryContent();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.story-text',
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.to(imageRef.current, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 md:py-60 px-6 bg-dark overflow-hidden"
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* TEXT CONTENT */}
        <div className="z-10">
          {loading ? (
             <div className="space-y-8">
               <div className="h-6 w-40 bg-white/5 animate-pulse rounded-full" />
               <div className="h-24 w-full bg-white/5 animate-pulse rounded-3xl" />
               <div className="h-40 w-full bg-white/5 animate-pulse rounded-3xl" />
             </div>
          ) : (
            <>
              <h4 className="story-text text-primary font-black tracking-widest uppercase mb-4 text-xs">{content.tagline}</h4>
              <h2 className="story-text text-4xl md:text-7xl font-black leading-tight mb-8 uppercase tracking-tighter">
                {content.title.split('.').map((part, i) => (
                  <span key={i} className={i % 2 !== 0 ? 'text-gray-500 block' : 'block'}>{part.trim()}</span>
                ))}
              </h2>
              <div className="story-text space-y-6">
                <p className="text-lg md:text-xl text-gray-400 font-bold leading-relaxed max-w-xl">
                  {content.description1}
                </p>
                <p className="text-lg md:text-xl text-gray-500 font-bold leading-relaxed max-w-xl italic">
                  {content.description2}
                </p>
              </div>
              <div className="story-text mt-12 grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-6xl font-black text-white outline-text">50+</h3>
                  <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2">Active Members</p>
                </div>
                <div>
                  <h3 className="text-6xl font-black text-white outline-text">12</h3>
                  <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2">Sports Played</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* PARALLAX IMAGE BOX */}
        <div className="relative group">
          <div 
            ref={imageRef}
            className="w-full aspect-square md:aspect-[4/5] rounded-[50px] overflow-hidden glass-effect border-0 shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover:bg-primary/0 transition-all duration-700" />
            <img 
              src="https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&q=80&w=1000" 
              alt="Community Spirit" 
              className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
            />
          </div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />
        </div>
      </div>
    </section>
  );
};

export default Story;
