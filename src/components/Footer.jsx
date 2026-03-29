import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Mail, MapPin, ArrowUp, Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../assets/logo.jpg';
import apiClient from '../config/apiClient';
import { fetchWithRetry } from '../utils/fetchUtils';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      return toast.error('Please enter your email address.');
    }
    
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return toast.error('Please enter a valid email address.');
    }

    setIsSubscribing(true);
    let loadingToast;
    const timer = setTimeout(() => {
      loadingToast = toast.loading("Server waking up... ⏳");
    }, 2000);

    try {
      const response = await fetchWithRetry(() => 
        apiClient.post('/api/v1/subscriptions/subscribe', { email })
      );

      if (response?.data?.status === 'success') {
        toast.success(response?.data?.message || 'Subscribed successfully!');
        setEmail('');
      } else {
        toast.error(response?.data?.message || 'Subscription failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Server not responding. Please try again later.");
    } finally {
      clearTimeout(timer);
      if (loadingToast) toast.dismiss(loadingToast);
      setIsSubscribing(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pt-24 pb-12 px-6 bg-dark border-t border-white/5">
      <div className="container mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 mb-20">
          
          {/* BRAND */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="text-3xl font-black flex items-center gap-2 mb-8 uppercase tracking-tighter group">
              <img 
                src={logo} 
                alt="Otter Society Logo" 
                className="w-10 h-10 object-cover rounded-full border border-white/10 shadow-[0_0_20px_rgba(0,209,181,0.3)] group-hover:scale-110 transition-transform overflow-hidden" 
              />
              OTTER SOCIETY
            </Link>

            <p className="text-gray-400 font-medium leading-relaxed max-w-sm text-center md:text-left">
              The ultimate community for sports enthusiasts. Join us every Sunday 
              and be part of something legendary.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-black text-xl mb-8 uppercase tracking-tight relative after:content-[''] after:absolute after:-bottom-2 after:left-0 lg:after:left-0 after:right-0 md:after:right-auto after:h-1 after:w-8 after:bg-primary">Explore.</h4>
            <ul className="flex flex-col items-center md:items-start gap-4 text-gray-500 font-bold">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/events" className="hover:text-primary transition-colors">Upcoming Events</Link></li>
              <li><Link to="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link to="/membership" className="hover:text-primary transition-colors">Membership</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-black text-xl mb-8 uppercase tracking-tight relative after:content-[''] after:absolute after:-bottom-2 after:left-0 lg:after:left-0 after:right-0 md:after:right-auto after:h-1 after:w-8 after:bg-primary">Connect.</h4>
            <ul className="flex flex-col items-center md:items-start gap-6 text-gray-400 font-medium">
              <li className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-full border border-white/5 hover:border-primary/30 transition-colors"><Mail size={20} className="text-primary" /></div>
                hello@ottersociety.club
              </li>
              <li className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-full border border-white/5 hover:border-primary/30 transition-colors"><MapPin size={20} className="text-primary" /></div>
                Elite Sports Arena, City Central
              </li>
            </ul>
          </div>

        </div>

        {/* NEWSLETTER SECTION (CENTERED & WIDE) */}
        <div className="max-w-2xl mx-auto py-24 border-t border-white/5 flex flex-col items-center text-center">
            <h4 className="text-white font-black text-4xl mb-4 tracking-tighter uppercase italic">Stay Alert.</h4>
            <p className="text-gray-500 font-bold text-xs mb-10 uppercase tracking-[0.3em] leading-loose max-w-md">
              Join our newsletter for exclusive club access <br className="hidden md:block" /> and legendary society updates.
            </p>
            <form 
              onSubmit={handleSubscribe} 
              noValidate 
              className="w-full flex flex-col md:flex-row bg-white/5 backdrop-blur-xl rounded-[2rem] md:rounded-full border border-white/10 group focus-within:border-primary/50 focus-within:shadow-[0_0_40px_rgba(0,209,181,0.15)] transition-all overflow-hidden p-2"
            >
              <div className="flex-1 flex items-center">
                <div className="flex items-center pl-6 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  placeholder="Enter your email address..." 
                  className="w-full bg-transparent border-none outline-none px-6 py-4 md:py-0 text-white text-base font-bold placeholder:text-gray-600 placeholder:font-medium uppercase tracking-tight"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="new-email"
                />
              </div>
              <button 
                type="submit"
                disabled={isSubscribing}
                className="w-full md:w-auto bg-primary text-dark font-black px-10 py-5 md:py-0 rounded-[1.5rem] md:rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-3 whitespace-nowrap active:scale-95 group/btn h-14 md:h-16 shadow-[0_4px_20px_rgba(0,209,181,0.3)]"
              >
                {isSubscribing ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    JOIN THE CLUB
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-8">
          <p className="text-gray-600 text-sm font-medium">
            © 2026 Otter Society Club. Designed by High-End Design Agency.
          </p>

          <div className="flex items-center gap-8">
            <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all"><Instagram size={24} /></a>
            <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all"><Twitter size={24} /></a>
            <button 
              onClick={scrollToTop}
              className="p-3 bg-white/5 rounded-full hover:bg-primary hover:text-dark transition-all shadow-lg shadow-primary/10"
            >
              <ArrowUp size={24} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
