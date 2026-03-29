import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Phone, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../config/apiClient';
import { fetchWithRetry } from '../utils/fetchUtils';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    let loadingToast;
    const timer = setTimeout(() => {
      loadingToast = toast.loading("Server waking up... ⏳");
    }, 2000);

    try {
      const res = await fetchWithRetry(() => 
        apiClient.post('/api/v1/auth/signup', formData)
      );
      
      const user = res?.data?.data?.user;
      const token = res?.data?.token || res?.data?.data?.token;

      if (!user || !token) {
        throw new Error("Invalid response from server");
      }

      login(user, token);
      
      toast.success('Membership application accepted!');
      navigate('/dashboard');
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Application failed. Please try again.");
    } finally {
      clearTimeout(timer);
      if (loadingToast) toast.dismiss(loadingToast);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-32 pb-12 px-6 bg-hero-gradient">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary rounded-full blur-[150px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="glass-effect p-12 md:p-20 rounded-[64px] border-white/5 shadow-2xl">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
              <Sparkles className="text-primary" />
              JOIN THE CLUB
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Membership Application Form</p>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-4">FULL NAME</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-primary transition-colors" size={20} />
                <input 
                  required 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full pl-16 pr-8 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold focus:border-primary/50 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-4">EMAIL ADDRESS</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-primary transition-colors" size={20} />
                <input 
                  required 
                  type="email" 
                  placeholder="name@email.com"
                  className="w-full pl-16 pr-8 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold focus:border-primary/50 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  autoComplete="new-email"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-4">PHONE NUMBER</label>
              <div className="relative group">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-primary transition-colors" size={20} />
                <input 
                  required 
                  type="tel" 
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full pl-16 pr-8 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold focus:border-primary/50 outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-4">CREATE PASSWORD</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-primary transition-colors" size={20} />
                <input 
                  required 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-16 pr-8 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold focus:border-primary/50 outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="mt-4 w-full py-6 bg-primary text-dark font-black text-xl rounded-full 
              hover:bg-primary/80 hover:scale-[1.02] active:scale-95 
              flex items-center justify-center gap-3 transition-all duration-300 
              shadow-[0_0_30px_rgba(0,209,181,0.3)] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin text-dark" /> : null}
              {loading ? 'PROCESSING APPLICATION...' : 'APPLY FOR MEMBERSHIP'}
            </button>
          </form>

          <p className="mt-12 text-center text-gray-500 font-bold">
            Already a member? <Link to="/login" className="text-primary hover:underline">Login Now</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Signup;
