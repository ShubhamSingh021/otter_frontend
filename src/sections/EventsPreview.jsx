import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '../config/apiClient';
import { fetchWithRetry } from '../utils/fetchUtils';

const EventsPreview = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);

      try {
        const res = await fetchWithRetry(() => apiClient.get('/api/v1/events'));
        const eventData = res?.data?.data?.events;
        setEvents(Array.isArray(eventData) ? eventData.slice(0, 3) : []);
      } catch (err) {
        console.error(err);
        toast.error(
          err?.response?.data?.message || "Server is waking up... ⏳",
          { id: "server-error" }
        );
        setEvents([
          { _id: '1', title: 'Sunday Smash Cricket', date: new Date(), slotsLeft: 4, statusLabel: 'Few Slots Left', imageUrl: 'https://plus.unsplash.com/premium_photo-1661884177579-247072c49c71?auto=format&fit=crop&q=80&w=800' },
          { _id: '2', title: 'Champions League Football', date: new Date(), slotsLeft: 0, statusLabel: 'Full', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800' },
          { _id: '3', title: 'Badminton Blitz', date: new Date(), slotsLeft: 10, statusLabel: 'Open', imageUrl: 'https://images.unsplash.com/photo-1626225967045-9c76db7b62dc?auto=format&fit=crop&q=80&w=800' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchEvents();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.from('.event-card', {
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    }
  }, [loading]);

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-dark-soft">
      <div className="container mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h4 className="text-secondary font-bold tracking-widest uppercase mb-4">NEXT SUNDAY</h4>
            <h2 className="text-4xl md:text-6xl font-black">Upcoming Sports.</h2>
          </div>
          <Link 
            to="/events" 
            className="group flex items-center gap-2 text-white font-bold hover:text-primary transition-all duration-300"
          >
            VIEW ALL EVENTS
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-[450px] rounded-3xl animate-pulse bg-white/5" />
            ))
          ) : (
            events.map((event) => (
              <div 
                key={event._id}
                className="event-card group relative h-[480px] rounded-[32px] overflow-hidden glass-effect border-white/5 hover:border-white/20 transition-all duration-500"
              >
                {/* IMAGE */}
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                />
                
                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                {/* STATUS TAG */}
                <div className={`absolute top-6 right-6 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                  event.isFull ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-primary/20 text-primary border border-primary/50'
                }`}>
                  {event.statusLabel}
                </div>

                {/* CONTENT */}
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    <Calendar size={14} />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <h3 className="text-2xl font-black mb-4">{event.title}</h3>
                  
                  <Link 
                    to={`/events/${event._id}`}
                    className="flex items-center gap-2 font-bold text-sm bg-white text-dark py-3 px-6 rounded-full w-fit transform translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"
                  >
                    REGISTER NOW
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;
