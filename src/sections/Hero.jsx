import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronDown, PlayCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../config/apiClient';
import { fetchWithRetry } from '../utils/fetchUtils';

const Hero = () => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);

  const [content, setContent] = useState({
    title: 'PLAY. COMPETE. ENJOY.',
    subtitle: 'UNLEASH THE OTTER WITHIN',
    description: 'Join the elite sports community where every Sunday is a new challenge. Experience the ultimate fusion of fitness, fun, and fellowship.',
    cta: 'BECOME A MEMBER'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const res = await fetchWithRetry(() => apiClient.get('/api/v1/content'));
        const heroData = res?.data?.data?.contents?.hero;
        if (heroData) {
          setContent(prev => ({ ...prev, ...heroData }));
        }
      } catch (err) {
        console.error('Failed to fetch hero content');
        toast.error(
          err?.response?.data?.message || "Server is waking up... ⏳",
          { id: "server-error" }
        );
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchHeroContent();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo(
        '.hero-title-line',
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.1 }
      )
      .fromTo(
        subtextRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        '-=1'
      )
      .fromTo(
        ctaRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8 },
        '-=0.8'
      );

      gsap.to('.hero-blob', {
        y: 'random(-50, 50)',
        x: 'random(-50, 50)',
        duration: 'random(3, 5)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, [loading]);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden bg-hero-gradient"
    >
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="hero-blob absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[150px]" />
        <div className="hero-blob absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-8">
            <div className="h-20 w-80 bg-white/5 animate-pulse rounded-full" />
            <div className="h-40 w-[600px] bg-white/5 animate-pulse rounded-3xl" />
          </div>
        ) : (
          <>
            <h1 className="hero-title text-5xl md:text-9xl font-black tracking-tight flex flex-col leading-[0.9] uppercase overflow-hidden">
              {content.title.split('.').filter(Boolean).map((word, i) => (
                <span key={i} className={`hero-title-line inline-block py-2 ${i === 1 ? 'text-primary' : ''}`}>
                  {word.trim()}.
                </span>
              ))}
            </h1>

            <p 
              ref={subtextRef}
              className="max-w-2xl mx-auto mt-10 text-lg md:text-xl text-gray-400 font-bold leading-relaxed"
            >
              {content.description}
            </p>

            <div 
              ref={ctaRef}
              className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6"
            >
              <Link 
                to="/signup" 
                className="group relative px-12 py-5 bg-primary text-dark font-black text-lg rounded-full overflow-hidden transition-all duration-300 transform shadow-[0_0_30px_rgba(0,209,181,0.3)] hover:shadow-[0_0_50px_rgba(0,209,181,0.5)] hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 uppercase">{content.cta}</span>
              </Link>
              
              <Link 
                to="/events" 
                className="flex items-center gap-3 text-white font-bold hover:text-primary transition-all text-lg group"
              >
                <div className="p-2 bg-white/5 rounded-full group-hover:bg-primary group-hover:text-dark transition-all">
                  <PlayCircle className="w-8 h-8" />
                </div>
                VIEW UPCOMING EVENTS
              </Link>
            </div>
          </>
        )}
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <ChevronDown size={32} />
      </div>
    </section>
  );
};

export default Hero;
