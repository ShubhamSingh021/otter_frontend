import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../config/apiClient';
import { fetchWithRetry } from '../utils/fetchUtils';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    let loadingToast;
    const timer = setTimeout(() => {
      loadingToast = toast.loading("Server waking up... ⏳");
    }, 2000);

    try {
      const res = await fetchWithRetry(() => 
        apiClient.post('/api/v1/auth/login', { email, password })
      );
      
      const user = res?.data?.data?.user;
      const token = res?.data?.token || res?.data?.data?.token;

      if (!user || !token) {
        throw new Error("Invalid response from server");
      }

      login(user, token);
      
      toast.success('Welcome back, Otter!');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Login failed. Please try again.");
    } finally {
      clearTimeout(timer);
      if (loadingToast) toast.dismiss(loadingToast);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6 bg-hero-gradient">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary rounded-full blur-[150px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="glass-effect p-12 md:p-20 rounded-[64px] border-white/5 shadow-2xl">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full" />
              LOGIN
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Enter your society credentials</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-4">EMAIL ADDRESS</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-primary transition-colors" size={20} />
                <input 
                  required 
                  type="email" 
                  placeholder="name@email.com"
                  className="w-full pl-16 pr-8 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold focus:border-primary/50 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="new-email"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-4">PASSWORD</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-primary transition-colors" size={20} />
                <input 
                  required 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-16 pr-8 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold focus:border-primary/50 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="flex justify-end pr-4">
                <Link to="/forgot-password" size={14} className="text-xs font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-widest">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="mt-4 w-full py-6 bg-primary text-dark font-black text-xl rounded-full hover:bg-primary/80 hover:scale-[1.02] flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 shadow-[0_0_30px_rgba(0,245,212,0.3)]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <LogIn />}
              {loading ? 'OPENING GATES...' : 'ENTER THE CLUB'}
            </button>
          </form>

          <p className="mt-12 text-center text-gray-500 font-bold">
            New here? <Link to="/signup" className="text-primary hover:underline">Apply for Membership</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
