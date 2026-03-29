import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import apiClient from '../config/apiClient';
import { fetchWithRetry } from '../utils/fetchUtils';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRegistrations = async () => {
      if (!token) return;
      setLoading(true);

      try {
        const res = await fetchWithRetry(() => 
          apiClient.get('/api/v1/registrations/my', {
            headers: { Authorization: `Bearer ${token}` }
          })
        );
        setRegistrations(res?.data?.data?.registrations || []);
      } catch (err) {
        console.error(err);
        toast.error(
          err?.response?.data?.message || "Server is waking up... ⏳",
          { id: "server-error" }
        );
        setRegistrations([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchMyRegistrations();
    }, 3000);

    return () => clearTimeout(timer);
  }, [token]);

  if (!user) return <div className="h-screen flex items-center justify-center text-gray-500 font-black uppercase tracking-widest text-xl">Loading session...</div>;

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto">
        
        {/* WELCOME HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <h4 className="text-primary font-bold tracking-widest uppercase mb-4">MEMBER DASHBOARD</h4>
            <h1 className="text-4xl md:text-7xl font-black mb-4">Welcome, <br /> <span className="text-gray-500">{user?.name}.</span></h1>
          </div>
          <div className="flex items-center gap-4 glass-effect px-8 py-4 rounded-full border-white/5">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-black text-primary">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-bold text-white leading-none">{user?.name}</p>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">SOCIETY ID: #{user?._id?.slice(-6).toUpperCase() || 'XXXXXX'}</p>
            </div>
          </div>
        </div>

        {/* STATUS TRACKER GRID */}
        <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">Your Event <span className="text-primary">Journey.</span></h3>
        
        {loading ? (
          <div className="flex justify-center py-40">
            <Loader2 className="animate-spin text-primary" size={64} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(!Array.isArray(registrations) || registrations.length === 0) ? (
              <div className="col-span-full py-20 text-center glass-effect rounded-[40px] border-white/5">
                <p className="text-xl text-gray-500 font-bold mb-6 italic">No registrations yet. Ready to start?</p>
                <a href="/events" className="inline-block px-8 py-3 bg-primary text-dark font-black rounded-full hover:bg-primary/80 hover:scale-105 transition-all shadow-lg shadow-primary/10">EXPLORE EVENTS</a>
              </div>
            ) : (
              registrations.map((reg) => (
                <div key={reg?._id} className="glass-effect rounded-[40px] p-10 border-white/5 hover:border-white/10 transition-all duration-500 group relative overflow-hidden">
                  
                  {/* CARD DECOR */}
                  <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-10 blur-3xl ${
                    reg.status === 'Approved' ? 'bg-green-500' : reg.status === 'Rejected' ? 'bg-red-500' : 'bg-orange-500'
                  }`} />

                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                      {reg.status === 'Approved' ? <CheckCircle className="text-green-500" /> : 
                       reg.status === 'Rejected' ? <XCircle className="text-red-500" /> : 
                       <Clock className="text-orange-500" />}
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      reg.status === 'Approved' ? 'bg-green-500/20 text-green-500' : 
                      reg.status === 'Rejected' ? 'bg-red-500/20 text-red-500' : 
                      'bg-orange-500/20 text-orange-500'
                    }`}>
                      {reg.status || 'Pending'}
                    </span>
                  </div>

                  <h4 className="text-2xl font-black mb-2 text-white group-hover:text-primary transition-colors">{reg.eventId?.title || 'Unknown Event'}</h4>
                  <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest mb-8">
                    <Calendar size={14} />
                    {reg.eventId?.date ? new Date(reg.eventId.date).toLocaleDateString() : 'Date TBD'}
                  </div>

                  <div className="pt-8 border-t border-white/5 flex justify-between items-center text-xs font-black uppercase tracking-widest">
                    <span className="text-gray-500">PAYMENT STATUS</span>
                    <span className={reg.status === 'Approved' ? 'text-green-500' : 'text-gray-400'}>
                      {reg.status === 'Approved' ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>

                  {reg.status === 'Approved' && (
                    <div className="mt-6 flex bg-green-500/10 p-4 rounded-2xl text-[10px] font-bold text-green-500 border border-green-500/20">
                      Your spot is confirmed! See you at the arena.
                    </div>
                  )}

                </div>
              ))
            )}
          </div>
        )}

        {/* RECENT ACTIVITES OR TIPS */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-effect p-12 rounded-[48px] border-white/5 bg-gradient-to-br from-primary/5 to-transparent">
            <h4 className="text-xl font-black mb-6 uppercase tracking-tighter">Member <span className="text-primary">Perks.</span></h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li className="flex items-start gap-3">
                <CheckCircle size={18} className="text-primary mt-1 shrink-0" />
                Waitlist priority for all monthly tournaments.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={18} className="text-primary mt-1 shrink-0" />
                Exclusive 15% discount on society merch.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={18} className="text-primary mt-1 shrink-0" />
                Full access to the Otter Community Hub.
              </li>
            </ul>
          </div>
          
          <div className="glass-effect p-12 rounded-[48px] border-white/5 flex flex-col justify-center">
            <h4 className="text-3xl font-black mb-4">Want more <span className="text-secondary">Action?</span></h4>
            <p className="text-gray-500 font-medium mb-8">Explore and register for next week's sports events before slots run out.</p>
            <a href="/events" className="flex items-center gap-3 font-black text-xs uppercase tracking-widest text-white hover:text-primary transition-colors group">
              Browse Matches <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
