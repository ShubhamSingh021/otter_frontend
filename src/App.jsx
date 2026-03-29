import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from 'react-hot-toast';

// UTILS
import LenisWrapper from './components/LenisWrapper';

// COMPONENTS
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// CONTEXT
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// PAGES
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Events from './pages/Events';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import EventDetails from './pages/EventDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Gallery from './pages/Gallery';
import Membership from './pages/Membership';
import NotFound from './pages/NotFound';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // GSAP ScrollTrigger Global Configuration
    gsap.config({
      nullTargetWarn: false,
    });
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <LenisWrapper>
          <div className="min-h-screen bg-dark text-white selection:bg-primary selection:text-dark">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/membership" element={<Membership />} />
                
                {/* PROTECTED ROUTES */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 FALLBACK */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#121212',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                },
              }}
            />
          </div>
        </LenisWrapper>
      </AuthProvider>
    </Router>
  );
}

export default App;
