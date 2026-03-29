import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, ArrowLeft, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../config/apiClient';
import { fetchWithRetry } from '../utils/fetchUtils';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }
    if (password !== passwordConfirm) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    let loadingToast;
    const timer = setTimeout(() => {
      loadingToast = toast.loading("Server waking up... ⏳");
    }, 2000);

    try {
      const res = await fetchWithRetry(() => 
        apiClient.patch(`/api/v1/auth/reset-password/${token}`, {
          password,
          passwordConfirm
        })
      );
      
      const user = res?.data?.data?.user;
      const tokenData = res?.data?.token || res?.data?.data?.token;

      if (!user || !tokenData) {
        throw new Error("Invalid response from server");
      }

      toast.success('Password reset successfully!');
      setSuccess(true);
      
      // Auto-login user after reset
      login(user, tokenData);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err?.message || "Password reset failed. Please try again.");
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
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full" />
              RESET PASSWORD
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
              {success ? 'Securely Updated' : 'Create a strong new password'}
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-4">NEW PASSWORD</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-primary transition-colors" size={20} />
                  <input 
                    required 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••"
                    className="w-full pl-16 pr-14 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold focus:border-primary/50 outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-4">CONFIRM NEW PASSWORD</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-primary transition-colors" size={20} />
                  <input 
                    required 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    placeholder="••••••••"
                    className="w-full pl-16 pr-14 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold focus:border-primary/50 outline-none transition-all"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button 
                disabled={loading}
                type="submit"
                className="mt-4 w-full py-6 bg-primary text-dark font-black text-xl rounded-full hover:bg-primary/80 hover:scale-[1.02] flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 shadow-[0_0_30px_rgba(0,245,212,0.3)]"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Lock size={20} />}
                {loading ? 'RESETTING...' : 'RESET PASSWORD'}
              </button>
            </form>
          ) : (
            <div className="text-center bg-white/5 p-8 rounded-3xl border border-white/10">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4">Password Reset!</h3>
              <p className="text-gray-400 font-medium leading-relaxed mb-8">
                Your password has been securely updated. You are being redirected to your dashboard...
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
