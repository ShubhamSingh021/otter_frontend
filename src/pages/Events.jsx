import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Users, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apiClient from '../config/apiClient';
import { fetchWithRetry } from '../utils/fetchUtils';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);

      try {
        const res = await fetchWithRetry(() => apiClient.get('/api/v1/events'));
        setEvents(res?.data?.data?.events || []);
      } catch (err) {
        console.error(err);
        toast.error(
          err?.response?.data?.message || "Server is waking up... ⏳",
          { id: "server-error" }
        );
        // Fallback for development demo
        setEvents([
          { _id: '1', title: 'Sunday Smash Cricket', type: 'Cricket', date: new Date(), slotsLeft: 4, statusLabel: 'Few Slots Left', imageUrl: 'https://plus.unsplash.com/premium_photo-1661884177579-247072c49c71?auto=format&fit=crop&q=80&w=800' },
          { _id: '2', title: 'Champions League Football', type: 'Football', date: new Date(), slotsLeft: 0, statusLabel: 'Full', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800' },
          { _id: '3', title: 'Badminton Blitz', type: 'Badminton', date: new Date(), slotsLeft: 10, statusLabel: 'Open', imageUrl: 'https://images.unsplash.com/photo-1626225967045-9c76db7b62dc?auto=format&fit=crop&q=80&w=800' },
          { _id: '4', title: 'Night Football Special', type: 'Football', date: new Date(), slotsLeft: 2, statusLabel: 'Few Slots Left', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800' },
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

  const filteredEvents = Array.isArray(events) ? events.filter(e => 
    (filter === 'All' || e.type === filter) &&
    e.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="container mx-auto">
        
        {/* HEADER */}
        <div className="mb-20">
          <h1 className="text-5xl md:text-8xl font-black mb-6">Explore <br /> <span className="text-primary tracking-tighter">Events.</span></h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl">
            Choose your game, secure your spot, and prepare for a legendary Sunday. 
            All matches are professionally managed and community-driven.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          
          {/* SEARCH */}
          <div className="relative flex-grow">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Search by sport or match title..."
              className="w-full pl-16 pr-8 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold focus:border-primary/50 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* FILTER TABS */}
          <div className="flex items-center gap-4 p-2 glass-effect rounded-full overflow-x-auto no-scrollbar">
            {['All', 'Cricket', 'Football', 'Badminton'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  filter === tab ? 'bg-primary text-dark shadow-[0_0_20px_rgba(0,245,212,0.4)]' : 'hover:bg-white/5 text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

        </div>

        {/* RESULTS GRID */}
        {loading ? (
          <div className="flex justify-center py-40">
            <Loader2 className="animate-spin text-primary" size={64} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(filteredEvents) && filteredEvents.map((event) => (
              <div 
                key={event?._id}
                className="group relative h-[500px] rounded-[40px] overflow-hidden glass-effect border-white/5 hover:border-white/20 transition-all duration-700"
              >
                {/* IMAGE */}
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.5] group-hover:grayscale-0"
                />
                
                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />

                {/* CONTENT */}
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  
                  {/* META TAGS */}
                  <div className="flex gap-3 mb-6">
                    <span className="px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-white/10 border border-white/10">
                      {event.type}
                    </span>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                      event.isFull ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-primary/20 text-primary border border-primary/50'
                    }`}>
                      {event.statusLabel || (event.slotsLeft > 0 ? 'Open' : 'Full')}
                    </span>
                  </div>

                  <h3 className="text-3xl font-black mb-6 group-hover:text-primary transition-colors duration-500">{event.title}</h3>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-white/10 group-hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                      <Calendar size={16} />
                      {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'}
                    </div>
                    
                    <Link 
                      to={`/events/${event?._id}`} 
                      className="p-4 bg-white rounded-full text-dark hover:bg-primary transition-all duration-300 transform group-hover:translate-x-0"
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-40">
            <h3 className="text-2xl font-bold text-gray-500 mb-4">No events found matching your filter.</h3>
            <button onClick={() => {setFilter('All'); setSearchTerm('');}} className="text-primary font-bold hover:underline">Clear all filters</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Events;
