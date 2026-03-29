import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Events', path: '/events' },
    { title: 'Gallery', path: '/gallery' },
    { title: 'Membership', path: '/membership' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2 group">
          <img 
            src={logo} 
            alt="Otter Society" 
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-primary/20 shadow-[0_0_15px_rgba(0,209,181,0.3)] group-hover:scale-110 transition-transform duration-300"
          />
          <span className="text-white">Otter</span>
          <span className="text-primary">Society</span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8 px-8 py-3 glass-effect rounded-full border border-white/5">
          {navLinks.map((link) => (
            <NavLink 
              key={link.title} 
              to={link.path}
              className={({ isActive }) => 
                `text-sm font-medium tracking-wide transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-gray-300 hover:text-primary'
                }`
              }
            >
              {link.title}
            </NavLink>
          ))}
        </div>

        {/* AUTH BUTTONS */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link 
                to="/login" 
                className="text-sm font-semibold hover:text-primary transition-colors text-white"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-6 py-2.5 bg-primary text-dark font-bold text-sm rounded-full hover:bg-primary/80 hover:scale-105 transition-all duration-300 transform active:scale-95 shadow-[0_0_20px_rgba(0,209,181,0.3)]"
              >
                Join the Club
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {/* USER AVATAR */}
              <div 
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-dark font-bold border-2 border-primary/20 shadow-[0_0_15px_rgba(0,209,181,0.3)]"
                title={user?.name}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              {user?.role === 'admin' ? (
                <Link 
                  to="/admin" 
                  className="p-2.5 rounded-full glass-effect text-primary hover:bg-primary/10 transition-all border border-primary/20"
                  title="Admin Dashboard"
                >
                  <Settings size={20} />
                </Link>
              ) : (
                <Link 
                  to="/dashboard" 
                  className="p-2.5 rounded-full glass-effect text-primary hover:bg-primary/10 transition-all border border-primary/20"
                  title="My Dashboard"
                >
                  <LayoutDashboard size={20} />
                </Link>
              )}
              
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg shadow-red-500/20"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-0 w-full px-6 md:hidden"
          >
            <div className="glass-effect rounded-3xl p-8 flex flex-col gap-6 border border-white/10 shadow-2xl">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.title} 
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `text-xl font-bold transition-colors ${
                      isActive ? 'text-primary' : 'hover:text-primary'
                    }`
                  }
                >
                  {link.title}
                </NavLink>
              ))}
              <hr className="border-white/10" />
              {!isAuthenticated ? (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xl font-bold hover:text-primary text-white"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-4 bg-primary text-dark font-bold text-center rounded-2xl shadow-lg shadow-primary/20"
                  >
                    Join the Club
                  </Link>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                   <Link 
                    to={user?.role === 'admin' ? "/admin" : "/dashboard"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-xl font-bold text-primary"
                  >
                    {user?.role === 'admin' ? <Settings size={22} /> : <LayoutDashboard size={22} />}
                    {user?.role === 'admin' ? 'Admin Panel' : 'My Account'}
                  </Link>
                  <button 
                    onClick={logout}
                    className="flex items-center gap-3 text-xl font-bold text-red-500"
                  >
                    <LogOut size={22} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
