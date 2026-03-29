import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Membership = () => {
  const benefits = [
    'Access to Weekly Sunday Sports',
    'Official Otter Society Jersey',
    'Invitation to Monthly Social Events',
    'Priority Registration for Tournaments',
    'Member-only WhatsApp Community',
    'Fitness and Diet Guidance',
  ];

  return (
    <section id="membership" className="py-32 px-6 bg-dark-soft relative overflow-hidden">
      
      {/* DECORATIVE LIGHT */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto">
        <div className="glass-effect rounded-[64px] p-12 md:p-24 flex flex-col lg:flex-row items-center gap-20 border-white/5">
          
          <div className="lg:w-1/2">
            <h4 className="text-secondary font-bold tracking-widest uppercase mb-6">READY TO PLAY?</h4>
            <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight">
              Join the <br /> <span className="text-primary tracking-tighter">Otter Society.</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 font-medium mb-12">
              Membership is more than a title. It's an invitation to a lifestyle of athletic excellence 
              and authentic connection. No matter your skill level, there's a place for you here.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 text-white font-bold">
                  <div className="p-1 bg-primary/20 rounded-full">
                    <Check size={16} className="text-primary" />
                  </div>
                  {benefit}
                </div>
              ))}
            </div>

            <Link 
              to="/signup" 
              className="inline-block px-12 py-5 bg-primary text-dark font-black text-xl rounded-full hover:bg-primary/80 hover:scale-[1.02] transition-all duration-300 transform active:scale-95 shadow-lg shadow-primary/10"
            >
              BECOME A MEMBER
            </Link>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="relative z-10 w-full aspect-square rounded-[40px] overflow-hidden border-8 border-white/5 transform rotate-3 hover:rotate-0 transition-transform duration-700">
              <img 
                src="https://images.unsplash.com/photo-1541534741688-6078c64b591d?auto=format&fit=crop&q=80&w=800" 
                alt="Member Club" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* FLOATING CARD */}
            <div className="absolute -bottom-10 -left-10 z-20 glass-effect p-8 rounded-3xl border border-white/10 animate-bounce group-hover:animate-none">
              <p className="text-primary font-black text-3xl">90%</p>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Retention Rate</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Membership;
